package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.time.LocalDate;
import java.util.Map;

@Value
public class OrderAcceptedEvent implements OrderEvent {
    Order order;
    Profile profile;
    LocalDate deadline;

    @Override
    public AppEventType getType() {
        return AppEventType.ORDER_ACCEPTED;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("orderId", order.getId(),
                "deadline", deadline);
    }
}
