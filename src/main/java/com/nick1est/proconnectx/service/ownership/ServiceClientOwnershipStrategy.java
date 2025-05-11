package com.nick1est.proconnectx.service.ownership;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServiceClientOwnershipStrategy implements OwnershipStrategy {
    private final ServiceRepository serviceRepository;

    @Override public ResourceType getResourceType() { return ResourceType.SERVICE; }
    @Override public RoleType getRoleType()     { return RoleType.ROLE_FREELANCER; }

    @Override
    public boolean owns(Long id, UserDetailsImpl user) {
        return serviceRepository.existsByIdAndFreelancerId(id, user.getActiveProfile().getId());
    }
}

