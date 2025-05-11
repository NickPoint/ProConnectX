package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dto.LightweightRegistrationRequestDto;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.dto.profile.ClientProfileDto;
import com.nick1est.proconnectx.dto.profile.ClientRegistrationRequest;
import com.nick1est.proconnectx.mapper.profile.GenericProfileMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", imports = ProfileType.class, uses = {OrderMapper.class, AddressMapper.class, FileMapper.class})
public interface ClientMapperGeneric extends GenericProfileMapper<Client, ClientRegistrationRequest, ClientProfileDto> {
    @Mapping(target = "avatarImageUrl", source = "client.files", qualifiedByName = "avatarImageMapper")
    @Mapping(target = "email", source = "user.email")
    ClientProfileDto toDto(Client client);

    @Mapping(target = "profileType", expression = "java(ProfileType.CLIENT)")
    @Mapping(target = "email", source = "user.email")
    RegistrationRequestDto toRegistrationRequestDto(Client client);
    List<RegistrationRequestDto> toRegistrationRequestDto(List<Client> clients);

    @Mapping(target = "profileType", expression = "java(ProfileType.CLIENT)")
    @Mapping(target = "email", source = "user.email")
    LightweightRegistrationRequestDto toLightweightRegistrationRequestDto(Client client);
    List<LightweightRegistrationRequestDto> toLightweightRegistrationRequestDto(List<Client> clients);
}
