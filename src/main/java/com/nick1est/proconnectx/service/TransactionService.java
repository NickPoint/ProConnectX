package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Transaction;
import com.nick1est.proconnectx.dao.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    @Transactional(propagation = Propagation.MANDATORY)
    public void createTransaction(Order order) {
        val transaction = new Transaction();
        transaction.setAmount(order.getService().getPrice());
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setOrder(order);
        order.setTransaction(transaction);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void escrowTransaction(Order order) {
        val transaction = order.getTransaction();
        changeStatus(transaction, TransactionStatus.ESCROWED);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void releaseTransaction(Order order) {
        val transaction = order.getTransaction();
        changeStatus(transaction, TransactionStatus.RELEASED);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void cancelTransaction(Order order) {
        val transaction = order.getTransaction();
        changeStatus(transaction, TransactionStatus.CANCELED);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void refundTransaction(Order order) {
        val transaction = order.getTransaction();
        changeStatus(transaction, TransactionStatus.REFUNDED);
    }

    private void changeStatus(Transaction transaction, TransactionStatus newStatus) {
        if (!transaction.getStatus().canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                    "Invalid transition: " + transaction.getStatus() + " → " + newStatus
            );
        }
        transaction.setStatus(newStatus);
    }
}
