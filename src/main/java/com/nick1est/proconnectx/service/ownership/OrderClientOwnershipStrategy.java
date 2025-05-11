package com.nick1est.proconnectx.service.ownership;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class OrderClientOwnershipStrategy implements OwnershipStrategy {
    private final OrderRepository orderRepo;

    public OrderClientOwnershipStrategy(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    @Override public ResourceType getResourceType() { return ResourceType.ORDER; }
    @Override public RoleType getRoleType()     { return RoleType.ROLE_CLIENT; }

    @Override
    public boolean owns(Long id, UserDetailsImpl user) {
        return orderRepo.existsByIdAndClientId(id, user.getActiveProfile().getId());
    }
}

