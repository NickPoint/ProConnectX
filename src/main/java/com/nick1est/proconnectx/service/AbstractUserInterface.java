package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.AbstractUser;
import com.nick1est.proconnectx.dao.AccountStatus;
import com.nick1est.proconnectx.dao.Principal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public interface AbstractUserInterface<T extends AbstractUser> {
    @Transactional(propagation = Propagation.MANDATORY)
    void initUser(Principal principal);

    T getById(Long id);
    T getReferenceById(Long id);
    List<T> getByAccountStatus(AccountStatus accountStatus);
    @Transactional
    String getAvatarUrl(T user);
}
