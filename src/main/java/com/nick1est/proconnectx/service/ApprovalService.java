package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Profile;

public interface ApprovalService<T extends Profile> {
    void approve(T entity, UserDetailsImpl userDetails);
    void reject(T entity, String reason, UserDetailsImpl userDetails);
}