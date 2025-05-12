package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.ProfileType;
import lombok.Data;

import java.util.Map;

@Data
public class ProfileVerifiedEvent implements DomainEvent {
    private final Long profileId;
    private final ProfileType profileType;

    @Override
    public AppEventType getType() {
        return AppEventType.PROFILE_VERIFIED;
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of();
    }
}
