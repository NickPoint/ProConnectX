package com.nick1est.proconnectx.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nick1est.proconnectx.dao.ERole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.http.ResponseCookie;

import java.util.Set;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    @NotNull
    @JsonIgnore
    private ResponseCookie token;
    @NotBlank
    private final String firstName;
    @NotBlank
    private final String lastName;
    @NotNull
    private final Set<ERole> roles;
    @NotBlank
    private final ERole activeRole;
}