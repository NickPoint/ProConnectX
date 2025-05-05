package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.mapper.OrderMapper;
import com.nick1est.proconnectx.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Transactional
    public void acceptOrder(Long orderId,
                            Freelancer freelancer,
                            LocalDate deadlineDate) {
        val order = getById(orderId);
        order.setStatus(OrderStatus.IN_PROGRESS);
        order.setDeadlineDate(deadlineDate);
        transactionService.escrowTransaction(order);
        eventService.recordOrderAccepted(order, freelancer);
    }

    @Transactional
    public void completeOrder(Long orderId) {
        val order = getById(orderId);
        order.setStatus(OrderStatus.COMPLETED);
        transactionService.releaseTransaction(order);
        eventService.recordOrderCompleted(order);
    }

    @Transactional
    public void submitOrderForReview(Long orderId,
                                     Freelancer freelancer) {
        val order = getById(orderId);
        order.setStatus(OrderStatus.SUBMITTED_FOR_REVIEW);
        eventService.recordOrderSubmittedForReview(order, freelancer);
    }

    @Transactional
    public void approveOrder(Long orderId, UserDetailsImpl userDetails) {
        val order = getById(orderId);
        approveOrder(order, userDetails, AccountType.CLIENT);
        completeOrder(orderId);
    }

    @Transactional
    public void approveOrder(Order order, UserDetailsImpl userDetails, AccountType accountType) {
        order.setStatus(OrderStatus.APPROVED);
        eventService.recordOrderApproved(order, userDetails, accountType);
    }

    @Transactional
    public void disputeOrder(Long orderId, String reason, Client client) {
        val order = getById(orderId);
        order.setStatus(OrderStatus.DISPUTED);
        disputeService.openDispute(order, reason, client);
    }

    @Transactional
    public void cancelOrder(Long orderId, String reason, UserDetailsImpl userDetails) {
        val order = getById(orderId);
        order.setStatus(OrderStatus.CANCELED);
        order.setRejectionReason(reason);
        transactionService.cancelTransaction(order);
        eventService.recordOrderCanceled(order, userDetails.getFreelancer());
    }

    @Transactional
    public void cancelOrderAndMakeRefund(Order order, UserDetailsImpl userDetails) {
        order.setStatus(OrderStatus.CANCELED);
        transactionService.refundTransaction(order);
        eventService.recordOrderCanceledWithRefund(order, userDetails);
    }


    @Transactional
    public Long bookService(Long serviceId,
                            Client client,
                            String additionalNotes) {
        log.debug("Client {} booking service {}", client, serviceId);
        val service = serviceService.getServiceReferenceById(serviceId);
        val order = new Order();
        order.setService(service);
        order.setClient(client);
        order.setType(OrderType.SERVICE);
        order.setAdditionalNotes(additionalNotes);
        transactionService.createTransaction(order);
        val savedOrder = orderRepository.save(order);
        eventService.recordOrderCreated(savedOrder, client);
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
    public Page<OrderDto> getUserOrders(UserDetailsImpl userDetails, Pageable pageable) {
        Page<Order> orders;
        if (RoleType.ROLE_FREELANCER.equals(userDetails.getActiveRole())) {
            orders = orderRepository.findByService_Freelancer(userDetails.getFreelancer(), pageable);
        } else if (userDetails.getActiveRole().equals(RoleType.ROLE_CLIENT)) {
            orders = orderRepository.findByClient(userDetails.getClient(), pageable);
        } else {
            throw new IllegalArgumentException("User with role " + userDetails.getActiveRole() + " doesn't have any relation to orders");
        }

        return orders.map(orderMapper::toDto);
    }

    @Transactional
    public Page<OrderDto> getActiveUserOrders(UserDetailsImpl userDetails, Pageable pageable) {
        Page<Order> orders;
        if (RoleType.ROLE_FREELANCER.equals(userDetails.getActiveRole())) {
            orders = orderRepository.findByService_FreelancerAndStatusIn(userDetails.getFreelancer(), ACTIVE_ORDER_STATUSES, pageable);
        } else if (userDetails.getActiveRole().equals(RoleType.ROLE_CLIENT)) {
            orders = orderRepository.findByClientAndStatusIn(userDetails.getClient(), ACTIVE_ORDER_STATUSES, pageable);
        } else {
            throw new IllegalArgumentException("User with role " + userDetails.getActiveRole() + " doesn't have any relation to orders");
        }

        return orders.map(orderMapper::toDto);
    }

}
