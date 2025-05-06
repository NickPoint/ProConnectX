package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Address;
import com.nick1est.proconnectx.dto.AddressDto;
import com.nick1est.proconnectx.dto.LightweightAddressDto;
import com.nick1est.proconnectx.dto.ServiceAddressDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class AddressMapper {
    public abstract AddressDto toDto(Address address);
    public abstract Address toDao(AddressDto addressDto);
    public abstract Address toDao(ServiceAddressDto addressDto);
    public abstract Address toDao(LightweightAddressDto addressDto);
}
