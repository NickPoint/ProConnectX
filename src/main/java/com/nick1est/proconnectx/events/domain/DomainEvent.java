package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;

import java.util.Map;

public interface DomainEvent {
    AppEventType getType();
    Long getProfileId();
    Map<String,Object> getPayload();
}
