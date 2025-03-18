package com.nick1est.proconnectx.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nick1est.proconnectx.dao.Principal;
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
    @NotBlank
    private final String email;

    @JsonIgnore
    @NotBlank
    private final String password;

    @NotBlank
    @Getter
    private final String firstName;

    @NotBlank
    @Getter
    private final String lastName;

    @Getter
    @Setter
    private String activeRole;

    @NotNull
    private final Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(Principal principal) {
        List<GrantedAuthority> authorities = principal.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(principal.getId(), principal.getEmail(), principal.getPassword(),
                principal.getFirstName(), principal.getLastName(), authorities);
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
