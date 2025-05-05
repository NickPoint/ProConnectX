package com.nick1est.proconnectx.security;

import com.nick1est.proconnectx.annotations.CheckDisputeOwner;
import com.nick1est.proconnectx.annotations.CheckOrderOwner;
import com.nick1est.proconnectx.annotations.CheckOwnership;
import com.nick1est.proconnectx.annotations.CheckServiceOwner;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.repository.DisputeRepository;
import com.nick1est.proconnectx.repository.OrderRepository;
import com.nick1est.proconnectx.repository.ServiceRepository;
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
    private final ServiceRepository serviceRepository;
    private final DisputeRepository disputeRepository;

    @Before("@annotation(checkOwnership) && args(id, userDetails, ..)")
    public void checkGenericOwnership(CheckOwnership checkOwnership, Long id, UserDetailsImpl userDetails) {
        log.debug("Checking ownership for type: {}", checkOwnership.type());

        RoleType activeRole = userDetails.getActiveRole();

        if (activeRole == RoleType.ROLE_ADMIN) {
            return;
        }

        boolean ownsResource = switch (checkOwnership.type()) {
            case ORDER -> switch (activeRole) {
                case ROLE_CLIENT -> orderRepository.existsByIdAndClient(id, userDetails.getClient());
                case ROLE_FREELANCER -> orderRepository.existsByIdAndServiceFreelancer(id, userDetails.getFreelancer());
                default -> false;
            };
            case SERVICE -> switch (activeRole) {
                case ROLE_FREELANCER -> serviceRepository.existsByIdAndFreelancer(id, userDetails.getFreelancer());
                default -> false;
            };
            case DISPUTE -> switch (activeRole) {
                case ROLE_CLIENT -> disputeRepository.existsByIdAndOrder_Client(id, userDetails.getClient());
                case ROLE_FREELANCER -> disputeRepository.existsByIdAndOrder_Service_Freelancer(id, userDetails.getFreelancer());
                default -> false;
            };
        };

        if (!ownsResource) {
            throw new AccessDeniedException("error.ownership.not_allowed");
        }
    }

}