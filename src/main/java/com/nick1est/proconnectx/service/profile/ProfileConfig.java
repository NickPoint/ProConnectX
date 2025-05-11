package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.BaseProfile;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.dto.profile.BaseProfileDto;
import com.nick1est.proconnectx.dto.profile.BaseRegistrationRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class ProfileConfig {
    @Bean
    public Map<ProfileType, AbstractProfileService<? extends BaseProfile,
            ? extends BaseRegistrationRequest,
            ? extends BaseProfileDto>> profileServiceMap(
            ClientProfileService clientProfileService,
            FreelancerProfileService freelancerProfileService) {
        return Map.of(
                ProfileType.CLIENT,     clientProfileService,
                ProfileType.FREELANCER, freelancerProfileService
        );
    }

    @Bean
    public Map<ProfileType, RoleType> profileTypeRoleTypeMap() {
        return Map.of(
                ProfileType.CLIENT, RoleType.ROLE_CLIENT,
                ProfileType.FREELANCER, RoleType.ROLE_FREELANCER,
                ProfileType.ADMIN, RoleType.ROLE_ADMIN
        );
    }
}

