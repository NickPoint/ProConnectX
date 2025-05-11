package com.nick1est.proconnectx.mapper.profile;

import com.nick1est.proconnectx.dao.BaseProfile;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.dto.profile.PublicProfileDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    PublicProfileDto toPublicDto(BaseProfile profile);
    RegistrationRequestDto toRegistrationRequestDto(BaseProfile profile);
}
