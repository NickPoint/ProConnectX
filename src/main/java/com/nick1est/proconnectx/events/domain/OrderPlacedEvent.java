package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.util.Map;

@Value
public class OrderPlacedEvent implements OrderEvent {
    Order order;
    Profile profile;

    @Override
    public AppEventType getType() {
        return AppEventType.ORDER_PLACED;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("orderId", order.getId(),
                "clientName", profile.getDisplayName(),
                "serviceName", order.getService().getTitle());
    }
}
