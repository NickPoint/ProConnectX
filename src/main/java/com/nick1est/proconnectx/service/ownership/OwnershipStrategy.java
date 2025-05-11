package com.nick1est.proconnectx.service.ownership;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dao.RoleType;

public interface OwnershipStrategy {
    ResourceType getResourceType();

    RoleType getRoleType();

    boolean owns(Long resourceId, UserDetailsImpl userDetails);
}
