package com.nick1est.proconnectx.dto.employer.registration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployerResponseDto {
    @NotNull
    private Long id;
    @NotBlank
    private String companyName;
    @NotBlank
    private String registrationCode;
    @NotBlank
    private String email;
    @NotBlank
    private String address;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String country;
    private String description;
}
