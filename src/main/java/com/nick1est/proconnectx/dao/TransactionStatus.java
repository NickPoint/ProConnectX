package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum TransactionStatus {
    /** Transaction created but not funded yet */
    PENDING,

    /** Funds received and held in escrow */
    ESCROWED,

    /** Payment has been released to the freelancer */
    RELEASED,

    /** Transaction was canceled before escrowed */
    CANCELED,

    /** Funds were refunded to client */
    REFUNDED;

    public boolean canTransitionTo(TransactionStatus target) {
        return switch (this) {
            case PENDING -> target == CANCELED || target == ESCROWED;
            case ESCROWED -> target == RELEASED || target == REFUNDED;
            default -> false;
        };
    }
}
