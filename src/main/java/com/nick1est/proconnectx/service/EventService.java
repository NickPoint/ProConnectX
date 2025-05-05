package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.events.ServiceOrderEvent;
import com.nick1est.proconnectx.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(propagation = Propagation.MANDATORY)
public class EventService {
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final ApplicationEventPublisher applicationEventPublisher;

    public void recordOrderCreated(Order order, Client client) {
        log.debug("Client {} has created an order: {}", client.getId(), order.getId());
        createEvent(order, EventType.ORDER_CREATED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_CREATED, null, null, order.getService().getFreelancer().getId()));
    }

    public void recordOrderAccepted(Order order, Freelancer freelancer) {
        log.debug("Freelancer {} accepted the order: {}", freelancer.getId(), order.getId());
        createEvent(order, EventType.ORDER_ACCEPTED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_ACCEPTED, null, order.getClient().getId(), null));
    }

    public void recordOrderCompleted(Order order) {
        log.debug("Order has been completed: {}", order.getId());
        createEvent(order, EventType.ORDER_COMPLETED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_COMPLETED, null, order.getClient().getId(),
                        order.getService().getFreelancer().getId()));
    }

    public void recordOrderSubmittedForReview(Order order, Freelancer freelancer) {
        log.debug("Freelancer {} submitted order for review: {}", freelancer.getId(), order.getId());
        createEvent(order, EventType.ORDER_SUBMITTED_FOR_REVIEW);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_SUBMITTED_FOR_REVIEW, null, order.getClient().getId(), null));
    }

    public void recordOrderApproved(Order order, UserDetailsImpl userDetails, AccountType accountType) {
        if (AccountType.ADMIN.equals(accountType)) {
            log.debug("Admin {} approved the order: {}", userDetails.getId(), order.getId());
            createEvent(order, EventType.ORDER_APPROVED_BY_ADMIN);
            applicationEventPublisher.publishEvent(
                    new ServiceOrderEvent(order.getId(), EventType.ORDER_APPROVED_BY_ADMIN, null, order.getClient().getId(), order.getService().getFreelancer().getId()));
        } else if (AccountType.CLIENT.equals(accountType)) {
            log.debug("Client {} approved the order: {}", userDetails.getClient().getId(), order.getId());
            createEvent(order, EventType.ORDER_APPROVED);
            applicationEventPublisher.publishEvent(
                    new ServiceOrderEvent(order.getId(), EventType.ORDER_APPROVED, null, null, order.getService().getFreelancer().getId()));
        }
    }

    public void recordOrderDisputed(Order order, Dispute dispute, String reason, Client client) {
        log.debug("Client {} disputed the order: {}", client.getId(), order.getId());
        createEvent(order, dispute, EventType.ORDER_DISPUTED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_DISPUTED, reason, null, order.getService().getFreelancer().getId()));
    }

    public void recordProposalCreated(Dispute dispute, String proposal, Freelancer freelancer) {
        log.debug("Freelancer {} proposed solution in the dispute: {}", freelancer.getId(), dispute);
        val order = dispute.getOrder();
        createEvent(order, dispute, EventType.PROPOSAL_CREATED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.PROPOSAL_CREATED, proposal, dispute.getOrder().getClient().getId(), null));
    }
    public void recordProposalRejected(Dispute dispute, String reason, Client client) {
        log.debug("Client {} rejected proposal in the dispute: {}", client.getId(), dispute);
        val order = dispute.getOrder();
        createEvent(order, dispute, EventType.PROPOSAL_REJECTED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.PROPOSAL_REJECTED, reason, null, order.getService().getFreelancer().getId()));
    }

    public void recordProposalAccepted(Dispute dispute, Client client) {
        log.debug("Client {} accepted proposal in the dispute: {}", client.getId(), dispute);
        val order = dispute.getOrder();
        createEvent(order, dispute, EventType.PROPOSAL_ACCEPTED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.PROPOSAL_ACCEPTED, null, null, order.getService().getFreelancer().getId()));
    }

    public void recordOrderCanceled(Order order, Freelancer freelancer) {
        log.debug("Freelancer {} canceled the order: {}", freelancer.getId(), order.getId());
        createEvent(order, EventType.ORDER_CANCELED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_CANCELED, null, order.getClient().getId(), null));
    }

    public void recordOrderCanceledWithRefund(Order order, UserDetailsImpl userDetails) {
        log.debug("Admin {} canceled the order with refund: {}", userDetails.getId(), order.getId());
        createEvent(order, EventType.ORDER_CANCELED_WITH_REFUND_BY_ADMIN);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_CANCELED_WITH_REFUND_BY_ADMIN, null, order.getClient().getId(), order.getService().getFreelancer().getId()));
    }

    private Event createEvent(Order order, EventType type) {
        val event = new Event();
        event.setOrder(order);
        event.setType(type);
        eventRepository.save(event);
        return event;
    }

    private Event createEvent(Order order, Dispute dispute, EventType type) {
        val event = new Event();
        event.setOrder(order);
        event.setDispute(dispute);
        event.setType(type);
        eventRepository.save(event);
        return event;
    }
}
