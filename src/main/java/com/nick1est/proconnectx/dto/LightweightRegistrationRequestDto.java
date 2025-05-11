package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.ProfileStatus;
import com.nick1est.proconnectx.dao.ProfileType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class LightweightRegistrationRequestDto {
    @NotNull
    private Long id;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String email;
    @NotBlank
    private String phoneNumber;
    @NotNull
    private ProfileStatus profileStatus;
    private String rejectionReason;
    @NotNull
    private Instant registrationDate;
    @NotNull
    private ProfileType profileType;
}

