package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Profile;
import lombok.Value;

import java.util.Map;

@Value
public class DisputeSolutionAccepteByAdminEvent implements DisputeEvent {
    Dispute dispute;
    Profile profile;

    @Override
    public AppEventType getType() {
        return AppEventType.PROPOSAL_ACCEPTED_BY_ADMIN;
    }
}
