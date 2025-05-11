package com.nick1est.proconnectx.service.ownership;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.repository.DisputeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DisputeFreelancerOwnershipStrategy implements OwnershipStrategy {
    private final DisputeRepository disputeRepository;

    @Override public ResourceType getResourceType() { return ResourceType.DISPUTE; }
    @Override public RoleType getRoleType()     { return RoleType.ROLE_FREELANCER; }

    @Override
    public boolean owns(Long id, UserDetailsImpl user) {
        return disputeRepository.existsByIdAndOrder_FreelancerId(id, user.getActiveProfile().getId());
    }
}

