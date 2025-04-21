package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum RoleType {
    ROLE_EMPLOYER,
    ROLE_FREELANCER,
    ROLE_ADMIN,
    ROLE_UNVERIFIED,
    ROLE_CLIENT
}
