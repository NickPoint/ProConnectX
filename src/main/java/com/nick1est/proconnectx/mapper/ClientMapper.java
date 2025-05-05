package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.AccountType;
import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dto.ClientDto;
import com.nick1est.proconnectx.dto.LightweightClientDto;
import com.nick1est.proconnectx.dto.LightweightRegistrationRequestDto;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.dto.employer.registration.ClientRegistrationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", imports = AccountType.class, uses = {OrderMapper.class, AddressMapper.class, FileMapper.class})
public abstract class ClientMapper {
    @Mapping(target = "avatarImageUrl", source = "client.files", qualifiedByName = "avatarImageMapper")
    @Mapping(target = "email", source = "principal.email")
    public abstract ClientDto toDto(Client client);
    @Mapping(target = "avatarImageUrl", source = "client.files", qualifiedByName = "avatarImageMapper")
    @Mapping(target = "email", source = "principal.email")
    public abstract LightweightClientDto toLightweightDto(Client client);

    @Mapping(target = "accountType", expression = "java(AccountType.CLIENT)")
    @Mapping(target = "email", source = "principal.email")
    @Mapping(target = "avatarImageUrl", source = "client.files", qualifiedByName = "avatarImageMapper")
    public abstract RegistrationRequestDto toRegistrationRequestDto(Client client);
    public abstract List<RegistrationRequestDto> toRegistrationRequestDto(List<Client> clients);

    @Mapping(target = "accountType", expression = "java(AccountType.CLIENT)")
    @Mapping(target = "email", source = "principal.email")
    public abstract LightweightRegistrationRequestDto toLightweightRegistrationRequestDto(Client client);
    public abstract List<LightweightRegistrationRequestDto> toLightweightRegistrationRequestDto(List<Client> clients);

    public abstract void updateClientFromDto(ClientRegistrationRequest dto, @MappingTarget Client client);
}
