package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.util.Map;

@Value
public class DisputeSolutionRejectedByAdminEvent implements DisputeEvent {
    Dispute dispute;
    Profile profile;

    @Override
    public AppEventType getType() {
        return AppEventType.PROPOSAL_REJECTED_BY_ADMIN;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("disputeId", dispute.getId());
    }
}
