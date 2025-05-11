package com.nick1est.proconnectx.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Value;
import org.springframework.http.ResponseCookie;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Value
public class AuthResponse {
    @NotBlank
    String email;
    @NotEmpty
    Set<RoleType> roles;
    @NotNull
    ProfileInfo activeProfile;
    @NotNull
    List<ProfileInfo> allProfiles;
    String avatarUrl;
}