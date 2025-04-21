package com.nick1est.proconnectx.dto.employer.registration;

import com.nick1est.proconnectx.dto.AddressDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class EmployerRegistrationRequest {
    @NotBlank
    private String companyName;
    @NotBlank
    private String registrationCode;
    @NotBlank
    private String email;
    @NotNull
    private AddressDto address;
    @NotBlank
    private String phoneNumber;
    private String description;
}
