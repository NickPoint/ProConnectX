package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.BookServiceDto;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.dto.OrdersFilter;
import com.nick1est.proconnectx.events.domain.*;
import com.nick1est.proconnectx.mapper.OrderMapper;
import com.nick1est.proconnectx.repository.OrderRepository;
import com.nick1est.proconnectx.service.profile.ClientProfileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
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
    private final ApplicationEventPublisher events;
    private final TransactionService transactionService;
    private final DisputeService disputeService;
    private final FileService fileService;
    private final ClientProfileService clientProfileService;

    @Transactional
    public void acceptOrder(Long orderId,
                            Profile freelancer,
                            LocalDate deadlineDate) {
        val order = getById(orderId);

        changeStatus(order, OrderStatus.IN_PROGRESS);
        order.setDeadlineDate(deadlineDate);
        transactionService.escrowTransaction(order);
        events.publishEvent(new OrderAcceptedEvent(order, freelancer, deadlineDate));
    }

    @Transactional
    public void completeOrder(Long orderId) {
        val order = getById(orderId);

        changeStatus(order, OrderStatus.COMPLETED);
        transactionService.releaseTransaction(order);
        events.publishEvent(new OrderCompletedEvent(order));
    }

    @Transactional
    public void submitOrderForReview(Long orderId,
                                     Profile profile) {
        val order = getById(orderId);
        changeStatus(order, OrderStatus.SUBMITTED_FOR_REVIEW);
        events.publishEvent(new OrderSubmitterForReviewEvent(order, profile));
    }

    @Transactional
    public void approveOrder(Long orderId, Profile profile) {
        val order = getById(orderId);
        changeStatus(order, OrderStatus.APPROVED);
        events.publishEvent(new OrderApprovedEvent(order, profile));

        completeOrder(orderId);
    }

    @Transactional
    public void disputeOrder(Long orderId, String reason, Profile client) {
        val order = getById(orderId);
        changeStatus(order, OrderStatus.DISPUTED);
        disputeService.openDispute(order, reason, client);
    }

    @Transactional
    public void cancelOrder(Long orderId, String reason, Profile freelancer) {
        val order = getById(orderId);
        changeStatus(order, OrderStatus.CANCELED);
        order.setRejectionReason(reason);
        transactionService.cancelTransaction(order);
        events.publishEvent(new OrderCanceledEvent(order, freelancer));
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
        val client = clientProfileService.getById(clientId);
        val service = serviceService.getServiceReferenceById(serviceId);
        val order = new Order();
        order.setService(service);
        order.setClient(client);
        order.setFreelancer(service.getFreelancer());
        order.setType(OrderType.SERVICE);
        order.setAdditionalNotes(bookingInfo.getAdditionalNotes());
        transactionService.createTransaction(order);
        val savedOrder = orderRepository.save(order);
        if (!bookingInfo.getFiles().isEmpty()) {
            order.setFiles(fileService.uploadFiles(savedOrder, bookingInfo.getFiles(), DocumentType.ORDER_FILES, true));
        }
        events.publishEvent(new OrderPlacedEvent(savedOrder, client));
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
                    return cb.equal(root.get("freelancer"), activeProfile);
                } else if (ProfileType.CLIENT == activeProfile.getProfileType()) {
                    return cb.equal(root.get("client"), activeProfile);
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
