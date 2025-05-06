package com.nick1est.proconnectx.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Principal;
import com.nick1est.proconnectx.dao.RoleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class UserDetailsImpl implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;

    @Getter
    @NotNull
    private final Long id;

    @Getter
    private final Principal principal;

    @Getter
    private final Freelancer freelancer;

/*    @Getter
    private final Employer employer;*/

    @Getter
    private final Client client;

    @Getter
    @NotBlank
    private final String email;

    @JsonIgnore
    @NotBlank
    private final String password;

    @Getter
    @Setter
    private String firstName;

    @Getter
    @Setter
    private String lastName;

    @Getter
    private RoleType activeRole;

    @NotNull
    private final Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(Principal principal) {
        List<GrantedAuthority> authorities = principal.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        UserDetailsImpl userDetails = new UserDetailsImpl(
                principal.getId(),
                principal,
                principal.getFreelancerAccounts().stream().findFirst().orElse(null), //TODO: Maybe wrong sorting
                principal.getClientAccounts().stream().findFirst().orElse(null),
                principal.getEmail(),
                principal.getPassword(),
                authorities
        );

        userDetails.chooseActiveRole();
        return userDetails;
    }

    public void chooseActiveRole() {
        RoleType lastActiveRole = principal.getLastActiveRole();

        if (lastActiveRole != null && hasRole(lastActiveRole)) {
            setActiveRole(lastActiveRole);
            return;
        }

        if (hasRole(RoleType.ROLE_UNVERIFIED)) {
            setActiveRole(RoleType.ROLE_UNVERIFIED);
        } else if (hasRole(RoleType.ROLE_FREELANCER)) {
            setActiveRole(RoleType.ROLE_FREELANCER);
        } else if (hasRole(RoleType.ROLE_EMPLOYER)) {
            setActiveRole(RoleType.ROLE_EMPLOYER);
        } else if (hasRole(RoleType.ROLE_CLIENT)) {
            setActiveRole(RoleType.ROLE_CLIENT);
        } else if (hasRole(RoleType.ROLE_ADMIN)) {
            setActiveRole(RoleType.ROLE_ADMIN);
        } else {
            throw new RuntimeException("User has no valid roles");
        }
    }

    public boolean hasRole(RoleType roleType) {
        return principal.getRoles().stream().anyMatch(r -> r.getName() == roleType);
    }

    public void setActiveRole(RoleType role) {
        this.activeRole = role;
        this.getPrincipal().setLastActiveRole(role);

        switch (role) {
            case ROLE_CLIENT -> {
                this.firstName = client != null ? client.getFirstName() : null;
                this.lastName = client != null ? client.getLastName() : null;
            }
            case ROLE_FREELANCER -> {
                this.firstName = freelancer != null ? freelancer.getFirstName() : null;
                this.lastName = freelancer != null ? freelancer.getLastName() : null;
            }
            case ROLE_ADMIN -> this.firstName = "Admin";
            case ROLE_UNVERIFIED -> {
                this.firstName = null;
                this.lastName = null;
            }
            default -> throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    @NonNull
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
