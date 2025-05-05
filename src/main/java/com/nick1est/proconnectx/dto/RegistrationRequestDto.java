package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.AccountStatus;
import com.nick1est.proconnectx.dao.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class RegistrationRequestDto {
    @NotNull
    private Long id;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String email;
    private String avatarImageUrl;
    @NotBlank
    private String phoneNumber;
    @NotNull
    private AccountStatus accountStatus;
    private String rejectionReason;
    @NotNull
    private Instant registrationDate;
    @NotNull
    private AccountType accountType;
}

