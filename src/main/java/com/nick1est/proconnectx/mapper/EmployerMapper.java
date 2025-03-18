package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Employer;
import com.nick1est.proconnectx.dto.employer.registration.EmployerRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.EmployerResponseDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployerMapper {
    Employer toDao(EmployerRegistrationRequest request);

    EmployerResponseDto toDto(Employer employer);
}
