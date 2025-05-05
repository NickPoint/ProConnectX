package com.nick1est.proconnectx.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.http.ResponseCookie;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class AuthResponse {
    @NotNull
    @JsonIgnore
    private ResponseCookie token;
    private String firstName;
    private String lastName;
    @NotBlank
    private String email;
    @NotNull
    private List<Account> accounts = new ArrayList<>();
    @NotNull
    private Set<RoleType> roles;
    @NotBlank
    private RoleType activeRole;
    private String avatarImageUrl;

    @Data
    public static class Account<T extends AbstractUser> {
        private final Long userId;
        private final AccountStatus accountStatus;
        private final AccountType accountType;

        public Account(T user) {
            this.userId = user.getId();
            this.accountStatus = user.getAccountStatus();
            if (user instanceof Freelancer) {
                this.accountType = AccountType.FREELANCER;
            } else {
                this.accountType = AccountType.CLIENT;
            }
        }
    }

    public AuthResponse(UserDetailsImpl userDetails, String avatarImageUrl) {
        this.email = userDetails.getEmail();
        this.firstName = userDetails.getFirstName();
        this.lastName = userDetails.getLastName();
        this.roles = getUserRoles(userDetails);
        this.activeRole = userDetails.getActiveRole();
        this.avatarImageUrl = avatarImageUrl;
        if (userDetails.getFreelancer() != null) {
            this.accounts.add(new Account<>(userDetails.getFreelancer()));
        }
        if (userDetails.getClient() != null) {
            this.accounts.add(new Account<>(userDetails.getClient()));
        }
    }

    public AuthResponse(ResponseCookie token, UserDetailsImpl userDetails, String avatarImageUrl) {
        this(userDetails, avatarImageUrl);
        this.token = token;
    }

    private Set<RoleType> getUserRoles(UserDetailsImpl userDetails) {
        return userDetails.getAuthorities().stream().map(grantedAuthority -> RoleType.valueOf(grantedAuthority.getAuthority())).collect(Collectors.toSet());
    }
}