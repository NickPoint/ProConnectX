package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum DisputeStatus {
    OPEN,
    IN_REVIEW,
    RESOLVED_REFUNDED,
    RESOLVED_FREELANCER_PAID,
    REJECTED
}
