package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Role;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public Role getByName(RoleType roleType) {
        return roleRepository.findByName(roleType)
                .orElseThrow(() -> new NotFoundException("error.role.not_found"));
    }

}
