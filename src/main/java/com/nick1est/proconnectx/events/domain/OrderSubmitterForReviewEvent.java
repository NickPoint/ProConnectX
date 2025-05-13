package com.nick1est.proconnectx.events.domain;


import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.util.Map;

@Value
public class OrderSubmitterForReviewEvent implements OrderEvent {
    Order order;
    Profile profile;

    @Override
    public AppEventType getType() {
        return AppEventType.ORDER_SUBMITTED_FOR_REVIEW;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("orderId", order.getId(), "freelancerName", profile.getDisplayName());
    }
}
