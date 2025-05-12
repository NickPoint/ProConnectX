package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;

import java.util.Map;

public interface OrderEvent extends DomainEvent {
    Order getOrder();
    Profile getProfile();

    @Override
    default Map<String, Object> getPayload() {
        return Map.of("orderId", getOrder().getId());
    }

    @Override
    default Long getProfileId() {
        return getProfile().getId();
    }
}
