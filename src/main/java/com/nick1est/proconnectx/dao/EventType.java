package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum EventType {
    // Registration & Profile
    USER_REGISTERED,
    VERIFICATION_SUBMITTED,
    ACCOUNT_APPROVED,
    ACCOUNT_REJECTED,

    // Order lifecycle
    ORDER_CREATED,
    ORDER_ACCEPTED,
    ORDER_REJECTED,
    ORDER_SUBMITTED_FOR_REVIEW,
    ORDER_APPROVED,
    ORDER_COMPLETED,
    ORDER_APPROVED_BY_ADMIN,
    ORDER_DISPUTED,
    ORDER_CANCELED,
    ORDER_CANCELED_WITH_REFUND_BY_ADMIN,

    // Dispute lifecycle
    DISPUTE_CREATED,
    DISPUTE_RESOLVED,
    DISPUTE_REJECTED,
    PROPOSAL_CREATED,
    PROPOSAL_ACCEPTED,
    PROPOSAL_REJECTED,

    // Transaction state
    TRANSACTION_CREATED,
    TRANSACTION_ESCROWED,
    TRANSACTION_RELEASED,

    // Review
    REVIEW_SUBMITTED,

    // Other
    FILE_UPLOADED,
    ROLE_SWITCHED
}
