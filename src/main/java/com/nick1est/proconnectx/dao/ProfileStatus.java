package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum ProfileStatus {
    UNVERIFIED,
    PENDING,
    ACTIVE,
    REJECTED;


    public boolean canTransitionTo(ProfileStatus target) {
        return switch (this) {
            case UNVERIFIED -> target == PENDING;
            case PENDING -> target == ACTIVE || target == REJECTED;
            default -> false;
        };
    }
}
