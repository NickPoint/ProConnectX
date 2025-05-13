package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.util.Map;

@Value
public class OrderDisputedEvent implements DisputeEvent {
    Dispute dispute;
    Profile profile;
    String reason;

    @Override
    public AppEventType getType() {
        return AppEventType.ORDER_DISPUTED;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("disputeId", getDispute().getId(),
                "orderId", getDispute().getOrder().getId(),
                "reason", getReason());
    }
}
