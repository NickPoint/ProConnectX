package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.util.Map;

@Value
public class OrderCanceledEvent implements OrderEvent {
    Order order;
    Profile profile;
    String reason;

    @Override
    public AppEventType getType() {
        return AppEventType.ORDER_CANCELED;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("orderId", getOrder().getId(), "reason", getReason());
    }
}
