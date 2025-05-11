package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.OrderStatus;
import com.nick1est.proconnectx.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderDisputeService {
    private final OrderRepository orderRepository;
    private final TransactionService transactionService;
    private final EventService eventService;

    @Transactional
    public void approveOrderFromDispute(Order order, UserDetailsImpl userDetails, ProfileType profileType) {
        order.setStatus(OrderStatus.COMPLETED);
        transactionService.releaseTransaction(order);
        eventService.recordOrderApproved(order, userDetails, profileType);
        eventService.recordOrderCompleted(order);
    }

    @Transactional
    public void cancelOrderAndRefundFromDispute(Order order, UserDetailsImpl userDetails) {
        order.setStatus(OrderStatus.CANCELED);
        transactionService.refundTransaction(order);
        eventService.recordOrderCanceledWithRefund(order, userDetails);
    }
}
