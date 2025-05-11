package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum OrderStatus {
    /**
     * Order has been created by the client but not yet accepted by the freelancer.
     */
    CREATED,

    /**
     * Order has been accepted and work is ongoing.
     */
    IN_PROGRESS,

    /**
     * Freelancer has marked the work as complete and it's pending client review.
     */
    SUBMITTED_FOR_REVIEW,

    /**
     * Client has reviewed and accepted the submitted work.
     */
    APPROVED,

    /**
     * Order has been marked as completed (either manually or automatically after approval).
     */
    COMPLETED,

    /**
     * Either party initiated a dispute (e.g. about payment or quality).
     */
    DISPUTED,

    /**
     * Order was canceled (by client, freelancer, or system).
     */
    CANCELED;

    public boolean canTransitionTo(OrderStatus target) {
        return switch (this) {
            case CREATED -> target == IN_PROGRESS || target == CANCELED;
            case IN_PROGRESS -> target == SUBMITTED_FOR_REVIEW;
            case SUBMITTED_FOR_REVIEW -> target == APPROVED || target == DISPUTED;
            case DISPUTED -> target == APPROVED || target == CANCELED;
            case APPROVED -> target == COMPLETED;
            default -> false;
        };
    }
}
