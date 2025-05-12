package com.nick1est.proconnectx.dao;

public enum ProposalStatus {
    PENDING,
    ACCEPTED,
    REJECTED;

    public boolean canTransitionTo(ProposalStatus target) {
        return switch (this) {
            case PENDING -> target == ACCEPTED || target == REJECTED;
            default -> false;
        };
    }
}
