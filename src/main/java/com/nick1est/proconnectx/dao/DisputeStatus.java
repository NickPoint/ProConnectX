package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum DisputeStatus {
    OPEN,
    IN_REVIEW,
    RESOLVED_REFUNDED,
    RESOLVED_FREELANCER_PAID,
    ADMIN_ACTION_REQUIRED,
    REJECTED;

    public boolean canTransitionTo(DisputeStatus target) {
        return switch (this) {
            case OPEN -> target == IN_REVIEW;
            case IN_REVIEW -> target == RESOLVED_REFUNDED || target == RESOLVED_FREELANCER_PAID || target == REJECTED || target == ADMIN_ACTION_REQUIRED;
            case ADMIN_ACTION_REQUIRED -> target == RESOLVED_REFUNDED || target == RESOLVED_FREELANCER_PAID;
            default -> false;
        };
    }
}
