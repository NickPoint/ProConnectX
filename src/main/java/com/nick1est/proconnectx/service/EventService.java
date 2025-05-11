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
    private final ApplicationEventPublisher applicationEventPublisher;

    public void recordOrderCreated(Order order, Profile clientProfile) {
        log.debug("Client {} has created an order: {}", clientProfile.getId(), order.getId());
        createEvent(order, EventType.ORDER_CREATED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_CREATED, null, null, order.getService().getFreelancer().getId()));
    }

    public void recordOrderAccepted(Order order, Long freelancerId) {
        log.debug("Freelancer {} accepted the order: {}", freelancerId, order.getId());
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

    public void recordOrderSubmittedForReview(Order order, Long freelancerId) {
        log.debug("Freelancer {} submitted order for review: {}", freelancerId, order.getId());
        createEvent(order, EventType.ORDER_SUBMITTED_FOR_REVIEW);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_SUBMITTED_FOR_REVIEW, null, order.getClient().getId(), null));
    }

    public void recordOrderApproved(Order order, UserDetailsImpl userDetails, ProfileType profileType) {
        if (ProfileType.ADMIN.equals(profileType)) {
            log.debug("Admin {} approved the order: {}", userDetails.getUser().getId(), order.getId());
            createEvent(order, EventType.ORDER_APPROVED_BY_ADMIN);
            applicationEventPublisher.publishEvent(
                    new ServiceOrderEvent(order.getId(), EventType.ORDER_APPROVED_BY_ADMIN, null, order.getClient().getId(), order.getService().getFreelancer().getId()));
        } else if (ProfileType.CLIENT.equals(profileType)) {
            log.debug("Client {} approved the order: {}", userDetails.getActiveProfile().getId(), order.getId());
            createEvent(order, EventType.ORDER_APPROVED);
            applicationEventPublisher.publishEvent(
                    new ServiceOrderEvent(order.getId(), EventType.ORDER_APPROVED, null, null, order.getService().getFreelancer().getId()));
        }
    }

    public void recordOrderDisputed(Order order, Dispute dispute, String reason, Profile clientProfile) {
        log.debug("Client {} disputed the order: {}", clientProfile.getId(), order.getId());
        createEvent(order, dispute, EventType.ORDER_DISPUTED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_DISPUTED, reason, null, order.getService().getFreelancer().getId()));
    }

    public void recordProposalCreated(Dispute dispute, String proposal, Profile freelancerProfile) {
        log.debug("Freelancer {} proposed solution in the dispute: {}", freelancerProfile.getId(), dispute);
        val order = dispute.getOrder();
        createEvent(order, dispute, EventType.PROPOSAL_CREATED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.PROPOSAL_CREATED, proposal, dispute.getOrder().getClient().getId(), null));
    }
    public void recordProposalRejected(Dispute dispute, String reason, Profile clientProfile) {
        log.debug("Client {} rejected proposal in the dispute: {}", clientProfile.getId(), dispute);
        val order = dispute.getOrder();
        createEvent(order, dispute, EventType.PROPOSAL_REJECTED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.PROPOSAL_REJECTED, reason, null, order.getService().getFreelancer().getId()));
    }

    public void recordProposalAccepted(Dispute dispute, Profile clientProfile) {
        log.debug("Client {} accepted proposal in the dispute: {}", clientProfile.getId(), dispute);
        val order = dispute.getOrder();
        createEvent(order, dispute, EventType.PROPOSAL_ACCEPTED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.PROPOSAL_ACCEPTED, null, null, order.getService().getFreelancer().getId()));
    }

    public void recordOrderCanceled(Order order, Profile freelancerProfile) {
        log.debug("Freelancer {} canceled the order: {}", freelancerProfile.getId(), order.getId());
        createEvent(order, EventType.ORDER_CANCELED);
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), EventType.ORDER_CANCELED, null, order.getClient().getId(), null));
    }

    public void recordOrderCanceledWithRefund(Order order, UserDetailsImpl userDetails) {
        log.debug("Admin {} canceled the order with refund: {}", userDetails.getUser().getId(), order.getId());
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
