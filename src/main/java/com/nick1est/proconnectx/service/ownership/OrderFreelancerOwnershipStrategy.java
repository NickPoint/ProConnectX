package com.nick1est.proconnectx.service.ownership;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class OrderFreelancerOwnershipStrategy implements OwnershipStrategy {
    private final OrderRepository orderRepo;

    public OrderFreelancerOwnershipStrategy(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    @Override public ResourceType getResourceType() { return ResourceType.ORDER; }
    @Override public RoleType getRoleType()     { return RoleType.ROLE_FREELANCER; }

    @Override
    public boolean owns(Long id, UserDetailsImpl user) {
        return orderRepo.existsByIdAndFreelancerId(id, user.getActiveProfile().getId());
    }
}

