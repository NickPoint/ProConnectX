package com.nick1est.proconnectx.mapper.profile;

import com.nick1est.proconnectx.dao.BaseProfile;
import com.nick1est.proconnectx.dto.profile.BaseProfileDto;
import com.nick1est.proconnectx.dto.profile.BaseRegistrationRequest;
import com.nick1est.proconnectx.dto.profile.UserProfileUpdateDto;
import org.mapstruct.MappingTarget;

public interface GenericProfileMapper<P extends BaseProfile, Req extends BaseRegistrationRequest, Dto extends BaseProfileDto> {
    void updateFromRegistration(Req req, @MappingTarget P profile);
    void updateFromProfileUpdate(UserProfileUpdateDto dto, @MappingTarget P profile);
    Dto toDto(P profile);
}