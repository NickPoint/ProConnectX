package com.nick1est.proconnectx.events.domain;


import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

@Value
public class OrderCompletedEvent implements OrderEvent {
    Order order;

    @Override
    public AppEventType getType() {
        return AppEventType.ORDER_COMPLETED;
    }

    @Override
    public Profile getProfile() {
        return null;
    }

    @Override
    public Long getProfileId() {
        return null;
    }
}
