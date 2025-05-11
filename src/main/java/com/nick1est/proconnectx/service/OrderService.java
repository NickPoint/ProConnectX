package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.BookServiceDto;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.dto.OrdersFilter;
import com.nick1est.proconnectx.mapper.OrderMapper;
import com.nick1est.proconnectx.repository.OrderRepository;
import com.nick1est.proconnectx.service.profile.ClientProfileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final List<OrderStatus> ACTIVE_ORDER_STATUSES = List.of(OrderStatus.IN_PROGRESS, OrderStatus.DISPUTED);

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ServiceService serviceService;
    private final EventService eventService;
    private final TransactionService transactionService;
    private final DisputeService disputeService;
    private final FileService fileService;
    private final ClientProfileService clientProfileService;

    @Transactional
    public void acceptOrder(Long orderId,
                            Long freelancerId,
                            LocalDate deadlineDate) {
        val order = getById(orderId);

        changeStatus(order, OrderStatus.IN_PROGRESS);
        order.setDeadlineDate(deadlineDate);
        transactionService.escrowTransaction(order);
        eventService.recordOrderAccepted(order, freelancerId);
    }

    @Transactional
    public void completeOrder(Long orderId) {
        val order = getById(orderId);

        if (!order.getStatus().canTransitionTo(OrderStatus.COMPLETED)) {
            throw new IllegalStateException("Cannot complete order from status: " + order.getStatus());
        }

        changeStatus(order, OrderStatus.COMPLETED);
        transactionService.releaseTransaction(order);
        eventService.recordOrderCompleted(order);
    }

    @Transactional
    public void submitOrderForReview(Long orderId,
                                     Long freelancerId) {
        val order = getById(orderId);
        changeStatus(order, OrderStatus.SUBMITTED_FOR_REVIEW);
        eventService.recordOrderSubmittedForReview(order, freelancerId);
    }

    @Transactional
    public void approveOrder(Long orderId, UserDetailsImpl userDetails) {
        val order = getById(orderId);
        approveOrder(order, userDetails, ProfileType.CLIENT);
        completeOrder(orderId);
    }

    @Transactional
    public void approveOrder(Order order, UserDetailsImpl userDetails, ProfileType profileType) {
        changeStatus(order, OrderStatus.APPROVED);
        eventService.recordOrderApproved(order, userDetails, profileType);
    }

    @Transactional
    public void disputeOrder(Long orderId, String reason, Profile clientProfile) {
        val order = getById(orderId);
        changeStatus(order, OrderStatus.DISPUTED);
        disputeService.openDispute(order, reason, clientProfile);
    }

    @Transactional
    public void cancelOrder(Long orderId, String reason, UserDetailsImpl userDetails) {
        val order = getById(orderId);
        changeStatus(order, OrderStatus.CANCELED);
        order.setRejectionReason(reason);
        transactionService.cancelTransaction(order);
        eventService.recordOrderCanceled(order, userDetails.getActiveProfile());
    }

    @Transactional
    public void cancelOrderAndMakeRefund(Order order, UserDetailsImpl userDetails) {
        changeStatus(order, OrderStatus.CANCELED);
        transactionService.refundTransaction(order);
        eventService.recordOrderCanceledWithRefund(order, userDetails);
    }

    private void changeStatus(Order order, OrderStatus newStatus) {
        if (!order.getStatus().canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                    "Invalid transition: " + order.getStatus() + " → " + newStatus
            );
        }
        order.setStatus(newStatus);
    }


    @Transactional
    public Long bookService(Long serviceId,
                            Long clientId,
                            BookServiceDto bookingInfo) {
        log.debug("Client {} booked the service {}", clientId, serviceId);
        val clientProfile = clientProfileService.getById(clientId);
        val service = serviceService.getServiceReferenceById(serviceId);
        val order = new Order();
        order.setService(service);
        order.setClient(clientProfile);
        order.setFreelancer(service.getFreelancer());
        order.setType(OrderType.SERVICE);
        order.setAdditionalNotes(bookingInfo.getAdditionalNotes());
        transactionService.createTransaction(order);
        val savedOrder = orderRepository.save(order);
        savedOrder.setFiles(fileService.uploadFiles(savedOrder, bookingInfo.getFiles(), DocumentType.ORDER_FILES, false));
        eventService.recordOrderCreated(savedOrder, clientProfile);
        return savedOrder.getId();
    }

    public OrderDto getDtoById(Long orderId) {
        val byId = getById(orderId);
        return orderMapper.toDto(byId);
    }

    public Order getById(Long orderId) {
        val order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order with id: " + orderId + " not found"));
        return order;
    }

    @Transactional
    public Page<OrderDto> getUserOrders(UserDetailsImpl userDetails, OrdersFilter filter, Pageable pageable) {
        Specification<Order> spec = OrderSpecifications.buildSpecification(userDetails, filter);
        Page<Order> orders = orderRepository.findAll(spec, pageable);

        return orders.map(orderMapper::toDto);
    }

    @Transactional
    public Page<OrderDto> getActiveUserOrders(UserDetailsImpl userDetails, Pageable pageable) {
        Page<Order> orders;
        val activeProfile = userDetails.getActiveProfile();
        if (ProfileType.FREELANCER == activeProfile.getProfileType()) {
            orders = orderRepository.findByFreelancerIdAndStatusIn(activeProfile.getId(), ACTIVE_ORDER_STATUSES, pageable);
        } else if (ProfileType.CLIENT == activeProfile.getProfileType()) {
            orders = orderRepository.findByClientIdAndStatusIn(activeProfile.getId(), ACTIVE_ORDER_STATUSES, pageable);
        } else {
            throw new IllegalArgumentException("User with active profile " + activeProfile.getProfileType() + " doesn't have any relation to orders");
        }

        return orders.map(orderMapper::toDto);
    }

    public class OrderSpecifications {

        public static Specification<Order> filterByUser(UserDetailsImpl userDetails) {
            return (root, query, cb) -> {
                val activeProfile = userDetails.getActiveProfile();
                if (ProfileType.ADMIN == activeProfile.getProfileType()) {
                    return cb.conjunction();
                } else if (ProfileType.FREELANCER == activeProfile.getProfileType()) {
                    return cb.equal(root.get("freelancerProfile"), activeProfile);
                } else if (ProfileType.CLIENT == activeProfile.getProfileType()) {
                    return cb.equal(root.get("clientProfile"), activeProfile);
                } else {
                    return cb.disjunction();
                }
            };
        }

        public static Specification<Order> filterByStatuses(List<OrderStatus> statuses) {
            return (root, query, cb) -> (statuses != null && !statuses.isEmpty())
                    ? root.get("status").in(statuses)
                    : cb.conjunction();
        }

        public static Specification<Order> buildSpecification(UserDetailsImpl userDetails, OrdersFilter filter) {
            return Specification.where(filterByUser(userDetails)).and(filterByStatuses(filter.getStatuses()));
        }
    }

}
