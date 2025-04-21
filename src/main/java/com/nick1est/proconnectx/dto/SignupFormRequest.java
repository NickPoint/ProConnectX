package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.RoleType;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    private RoleType role;
}