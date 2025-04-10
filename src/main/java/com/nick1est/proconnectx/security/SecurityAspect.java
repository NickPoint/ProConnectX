package com.nick1est.proconnectx.security;

import com.nick1est.proconnectx.annotations.CheckOrderOwner;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityAspect {

    private final OrderRepository orderRepository;

    @Before("@annotation(checkOrderOwner) && args(orderId, userDetails,..)")
    public void checkOrderOwnership(CheckOrderOwner checkOrderOwner, Long orderId, UserDetailsImpl userDetails) {
        log.debug("checkOrderOwnership");
        val activeRole = userDetails.getActiveRole();
        switch (activeRole) {
            case ROLE_CLIENT -> orderRepository.existsByIdAndClient(orderId, userDetails.getClient());
            case ROLE_FREELANCER -> orderRepository.existsByIdAndServiceFreelancer(orderId, userDetails.getFreelancer());
            default -> throw new AccessDeniedException("You do not have permission to access this order.");
        }
    }
}