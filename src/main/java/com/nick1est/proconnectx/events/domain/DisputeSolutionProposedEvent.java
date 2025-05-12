package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.time.LocalDate;
import java.util.Map;

@Value
public class DisputeSolutionProposedEvent implements DisputeEvent {
    Dispute dispute;
    Profile profile;

    @Override
    public AppEventType getType() {
        return AppEventType.PROPOSAL_CREATED;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("disputeId", dispute.getId(),
                "freelancerName", profile.getDisplayName());
    }
}
