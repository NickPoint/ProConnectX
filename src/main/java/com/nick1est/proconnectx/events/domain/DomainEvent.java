package com.nick1est.proconnectx.events.domain;

import java.util.Map;

public interface DomainEvent {
    String getType();
    Long getProfileId();
    Map<String,Object> getPayload();
}
