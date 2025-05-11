package com.nick1est.proconnectx.dao;

public enum ProposalStatus {
    NONE,
    PENDING,
    ACCEPTED,
    REJECTED;

    public boolean canTransitionTo(ProposalStatus target) {
        return switch (this) {
            case NONE -> target == PENDING;
            case PENDING -> target == ACCEPTED || target == REJECTED;
            default -> false;
        };
    }
}
