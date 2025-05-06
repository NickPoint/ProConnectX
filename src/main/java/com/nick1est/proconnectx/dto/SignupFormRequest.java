package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.AccountType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupFormRequest {

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, max = 32)
    private String password;

    @NotNull
    private AccountType accountType;
}