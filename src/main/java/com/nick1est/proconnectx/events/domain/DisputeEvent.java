package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;

import java.util.Map;

public interface DisputeEvent extends DomainEvent {
    Dispute getDispute();
    Profile getProfile();

    @Override
    default Map<String, Object> getPayload() {
        return Map.of("disputeId", getDispute().getId());
    }

    @Override
    default Long getProfileId() {
        return getProfile().getId();
    }
}
