package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Event;
import com.nick1est.proconnectx.dao.EventType;
import com.nick1est.proconnectx.dao.Order;
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
        val eventType = EventType.ORDER_CREATED;
        applicationEventPublisher.publishEvent(
                new ServiceOrderEvent(order.getId(), eventType, order.getService().getFreelancer().getId(), null));
        saveEvent(order, eventType);
    }

    private void saveEvent(Order order, EventType type) {
        val event = new Event();
        event.setOrder(order);
        event.setType(type);
        eventRepository.save(event);
    }
}
