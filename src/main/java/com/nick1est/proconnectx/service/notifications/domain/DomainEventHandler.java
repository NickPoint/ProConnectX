package com.nick1est.proconnectx.service.notifications.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.events.NotificationEvent;

import java.util.Set;

public interface DomainEventHandler {
    Set<AppEventType> eventType();
    void handle(NotificationEvent event);
}
