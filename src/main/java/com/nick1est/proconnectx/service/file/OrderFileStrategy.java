package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.OwnerType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderFileStrategy implements FileAccessStrategy {
    private final OrderRepository orderRepo;

    @Override public OwnerType ownerType() { return OwnerType.ORDER; }

    @Override
    public boolean canAccess(File file, UserDetailsImpl user) {
        Long orderId = file.getOrder().getId();
        RoleType role = user.getActiveProfile().getRoleType();
        if (role == RoleType.ROLE_CLIENT) {
            return orderRepo.existsByIdAndClientId(orderId, user.getActiveProfile().getId());
        } else if (role == RoleType.ROLE_FREELANCER) {
            return orderRepo.existsByIdAndFreelancerId(orderId, user.getActiveProfile().getId());
        }
        return false;
    }
}
