package com.nick1est.proconnectx.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nick1est.proconnectx.dao.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
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
    private final Freelancer freelancer;

    @Getter
    private final Employer employer;

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
    private ERole activeRole;

    @NotNull
    private final Collection<? extends GrantedAuthority> authorities;

    public void setActiveRole(ERole activeRole) {
        if (ERole.ROLE_CLIENT.equals(activeRole)) {
            this.firstName = client.getFirstName();
            this.lastName = client.getLastName();
        } else if (ERole.ROLE_FREELANCER.equals(activeRole)) {
            this.firstName = freelancer.getFirstName();
            this.lastName = freelancer.getLastName();
        } else if (ERole.ROLE_EMPLOYER.equals(activeRole)) {
            this.firstName = employer.getFirstName();
            this.lastName = employer.getLastName();
        } else {
            throw new IllegalArgumentException("Invalid role: " + activeRole);
        }
        this.activeRole = activeRole;
    }

    public static UserDetailsImpl build(Principal principal) {
        List<GrantedAuthority> authorities = principal.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        val freelancerId = principal.getFreelancer() != null ? principal.getFreelancer().getId() : null;
        val employerId = principal.getEmployer() != null ? principal.getEmployer().getId() : null;
        val clientId = principal.getClient() != null ? principal.getClient().getId() : null;
        return new UserDetailsImpl(principal.getId(), principal.getFreelancer(), principal.getEmployer(),
                principal.getClient(), principal.getEmail(), principal.getPassword(), authorities);
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
