package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

@Value
public class OrderCanceledByAdminEvent implements OrderEvent {
    Order order;
    Profile profile;

    @Override
    public AppEventType getType() {
        return AppEventType.ORDER_CANCELED_BY_ADMIN;
    }
}
