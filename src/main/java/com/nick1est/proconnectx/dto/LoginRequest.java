package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    @Email
    private final String email;
    @NotBlank
    private final String password;
}