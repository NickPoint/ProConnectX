package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Address;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.dto.employer.registration.FreelancerRegistrationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class AddressMapper {
    public abstract AddressDto toDto(Address address);
    public abstract Address toDao(AddressDto addressDto);
    public abstract Address toDao(ServiceAddressDto addressDto);
    public abstract Address toDao(LightweightAddressDto addressDto);
}
