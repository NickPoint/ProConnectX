package com.nick1est.proconnectx.auth;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.dao.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Getter
public class UserDetailsImpl implements UserDetails {
    private final User user;
    private final Profile activeProfile; //TODO: Save full profile here? What about memory
    private final Collection<GrantedAuthority> authorities;

    public UserDetailsImpl(User user, Profile activeProfile) {
        this.user = user;
        this.activeProfile = activeProfile;
        this.authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getName().name()))
                .collect(Collectors.toList());
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    @Override public String getPassword() {
        return user.getPassword();
    }
    @Override public String getUsername() {
        return user.getEmail();
    }
    @Override public boolean isAccountNonExpired() {
        return true;
    }
    @Override public boolean isAccountNonLocked() {
        return true;
    }
    @Override public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override public boolean isEnabled() {
        return true;
    }

    public String getDisplayName() {
        return activeProfile.getDisplayName();
    }

    public boolean hasRole(RoleType roleType) {
        return user.getRoles().stream().anyMatch(r -> r.getName() == roleType);
    }
}
