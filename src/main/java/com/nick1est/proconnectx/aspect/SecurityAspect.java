package com.nick1est.proconnectx.aspect;

import com.nick1est.proconnectx.annotations.CheckOwnership;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.service.ownership.OwnershipStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.data.util.Pair;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.util.Map;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityAspect {
    private final Map<Pair<ResourceType, RoleType>, OwnershipStrategy> strategies;

    @Before("@annotation(check) && args(id, userDetails, ..)")
    public void checkOwnership(CheckOwnership check, Long id, UserDetailsImpl userDetails) {
        RoleType role = userDetails.getActiveProfile().getRoleType();
        if (role == RoleType.ROLE_ADMIN) {
            return;
        }

        Pair<ResourceType,RoleType> key = Pair.of(check.type(), role);
        OwnershipStrategy strategy = strategies.get(key);
        if (strategy == null || !strategy.owns(id, userDetails)) {
            throw new AccessDeniedException("You do not own this resource");
        }
    }
}