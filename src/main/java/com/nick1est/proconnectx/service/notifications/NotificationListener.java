package com.nick1est.proconnectx.service.notifications;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.events.NotificationEvent;
import com.nick1est.proconnectx.service.notifications.domain.DomainEventHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Slf4j
public class NotificationListener {
    private final Map<AppEventType, DomainEventHandler> domainHandlers;

    public NotificationListener(List<DomainEventHandler> handlers) {
        this.domainHandlers = handlers.stream()
                .flatMap(h -> h.eventType().stream()
                        .map(t -> Map.entry(t, h)))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @KafkaListener(topics = "notifications", groupId="notification-group")
    public void handle(NotificationEvent event) {
        log.debug("Received notification event {}", event);
        DomainEventHandler handler = domainHandlers.get(event.getEventType());
        if (handler != null) {
            handler.handle(event);
        } else {
            log.error("No handler for event type {}", event.getEventType());
        }
    }
}
