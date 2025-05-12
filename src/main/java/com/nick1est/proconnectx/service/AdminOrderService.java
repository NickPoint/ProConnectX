package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.OrderStatus;
import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.events.domain.OrderApprovedByAdminEvent;
import com.nick1est.proconnectx.events.domain.OrderCanceledByAdminEvent;
import com.nick1est.proconnectx.events.domain.OrderCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminOrderService {
    private final TransactionService transactionService;
    private final ApplicationEventPublisher events;

    @Transactional
    public void approveOrderFromDispute(Order order, Profile admin) {
        changeStatus(order, OrderStatus.APPROVED);
        events.publishEvent(new OrderApprovedByAdminEvent(order, admin));
        completeOrder(order);
    }

    @Transactional
    public void completeOrder(Order order) {
        changeStatus(order, OrderStatus.COMPLETED);
        transactionService.releaseTransaction(order);
        events.publishEvent(new OrderCompletedEvent(order));
    }

    @Transactional
    public void cancelOrderAndRefundFromDispute(Order order, Profile admin) {
        changeStatus(order, OrderStatus.CANCELED);
        order.setRejectionReason(null);
        transactionService.refundTransaction(order);
        events.publishEvent(new OrderCanceledByAdminEvent(order, admin));
    }

    private void changeStatus(Order order, OrderStatus newStatus) {
        if (!order.getStatus().canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                    "Invalid transition: " + order.getStatus() + " → " + newStatus
            );
        }
        order.setStatus(newStatus);
    }
}
