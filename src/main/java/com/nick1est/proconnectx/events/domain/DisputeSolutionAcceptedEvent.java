package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.util.Map;

@Value
public class DisputeSolutionAcceptedEvent implements DisputeEvent {
    Dispute dispute;
    Profile profile;

    @Override
    public AppEventType getType() {
        return AppEventType.PROPOSAL_ACCEPTED;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("orderId", dispute.getOrder().getId(),
                "clientName", profile.getDisplayName());
    }
}
