package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Event;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.events.domain.DisputeEvent;
import com.nick1est.proconnectx.events.domain.OrderEvent;
import com.nick1est.proconnectx.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(propagation = Propagation.MANDATORY)
public class EventService {
    private final EventRepository eventRepository;

    @EventListener
    public void orderEvent(OrderEvent event) {
        log.debug("Received Order Event: {}", event);
        createEvent(event.getOrder(), event.getType().toString());
    }

    @EventListener
    public void disputeEvent(DisputeEvent event) {
        log.debug("Received Order Event: {}", event);
        createEvent(event.getDispute().getOrder(), event.getDispute(), event.getType().toString());
    }

    private Event createEvent(Order order, String type) {
        val event = new Event();
        event.setOrder(order);
        event.setType(type);
        eventRepository.save(event);
        return event;
    }

    private Event createEvent(Order order, Dispute dispute, String type) {
        val event = new Event();
        event.setOrder(order);
        event.setDispute(dispute);
        event.setType(type);
        eventRepository.save(event);
        return event;
    }
}
