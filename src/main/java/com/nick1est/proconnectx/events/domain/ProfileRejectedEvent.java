package com.nick1est.proconnectx.events.domain;

import com.nick1est.proconnectx.dao.ProfileType;
import lombok.Data;

import java.util.Map;

@Data
public class ProfileRejectedEvent implements DomainEvent {
    private final Long profileId;
    private final ProfileType profileType;
    private final String reason;

    @Override
    public String getType() {
        return this.getClass().getSimpleName();
    }

    @Override
    public Map<String, Object> getPayload() {
        return Map.of("reason", reason);
    }
}
