package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.AbstractUser;
import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.events.UserApprovedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeneralApprovalService implements ApprovalService<AbstractUser> {

    private final ApplicationEventPublisher eventPublisher;
    private final RoleService roleService;

    @Transactional(propagation = Propagation.MANDATORY)
    public void approve(AbstractUser entity, UserDetailsImpl adminWhoApproved) {
        log.debug("Approving {} by admin {}", entity.getId(), adminWhoApproved.getId());

        val roles = entity.getPrincipal().getRoles();
        roles.removeIf(role -> role.getName().equals(RoleType.ROLE_UNVERIFIED));
        if (entity instanceof Freelancer) {
            roles.add(roleService.getByName(RoleType.ROLE_FREELANCER));
        } else if (entity instanceof Client) {
            roles.add(roleService.getByName(RoleType.ROLE_CLIENT));
        }

        entity.approve();

        eventPublisher.publishEvent(new UserApprovedEvent(this, entity));
    }

    @Override
    public void reject(AbstractUser entity, String reason, UserDetailsImpl userDetails) {
        log.debug("Rejecting registration request for {}: {} by admin: {}", entity.getClass(), entity.getId(),
                userDetails.getId());
        entity.reject(reason);
    }
}
