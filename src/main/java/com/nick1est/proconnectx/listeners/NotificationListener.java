package com.nick1est.proconnectx.listeners;

import com.nick1est.proconnectx.events.ServiceOrderEvent;
import com.nick1est.proconnectx.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationService notificationService;

    @EventListener
    public void handleNewEvent(ServiceOrderEvent event) {
        log.debug("Received service order event {}", event);
        if (event.freelancerId() != null) {
            notificationService.notifyFreelancer(event.type(), event.freelancerId());
        }
        if (event.clientId() != null) {
//            notificationService.notifyClient(event.type(), event.clientId());
        }
    }
}
