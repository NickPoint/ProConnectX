package com.nick1est.proconnectx.dao;

public interface Approvable {
    void approve();
    void reject(String reason);
    boolean isApproved();
    Long getId();
    AccountStatus getAccountStatus();
    void setAccountStatus(AccountStatus status);
    void setRejectionReason(String reason);
    String getFullName();
}
