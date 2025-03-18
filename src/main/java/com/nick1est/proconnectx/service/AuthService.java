package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.JwtUtils;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ERole;
import com.nick1est.proconnectx.dao.Principal;
import com.nick1est.proconnectx.dto.AuthResponse;
import com.nick1est.proconnectx.dto.LoginRequest;
import com.nick1est.proconnectx.dto.SignupFormRequest;
import com.nick1est.proconnectx.exception.FormValidationEx;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final PrincipalRepository principalRepository;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthResponse signInUser(LoginRequest loginRequest) {
        val authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        val userDetails = (UserDetailsImpl) authentication.getPrincipal();
        chooseActiveRole(userDetails);
        val jwtCookie = jwtUtils.generateJwtCookie(userDetails, userDetails.getActiveRole());
        val roles = getUserRoles(userDetails);
        return new AuthResponse(jwtCookie, userDetails.getFirstName(), userDetails.getLastName(), roles, userDetails.getActiveRole());
    }

    @Transactional
    public AuthResponse signupUser(SignupFormRequest signupFormRequest) {
        if (principalRepository.existsByEmail(signupFormRequest.getEmail())) {
            throw new FormValidationEx(Map.of("email", "Email is already in use."));
        }

        val principal = new Principal(signupFormRequest.getEmail(), signupFormRequest.getFirstName(),
                signupFormRequest.getLastName(), encoder.encode(signupFormRequest.getPassword()));
        principal.setRoles(Set.of(roleRepository.findByName(ERole.ROLE_UNVERIFIED).orElseThrow(() -> new RuntimeException("Error: Role is not found."))));
        principalRepository.save(principal);
        return signInUser(new LoginRequest(signupFormRequest.getEmail(), signupFormRequest.getPassword()));
    }

    public AuthResponse switchRole(UserDetailsImpl userDetails, String role) {
        if (!userDetails.getAuthorities().contains(new SimpleGrantedAuthority(role))) {
            throw new AccessDeniedException("You don't have access to this role: " + role);
        }
        val jwtCookie = jwtUtils.generateJwtCookie(userDetails, role);
        userDetails.setActiveRole(role);
        val roles = getUserRoles(userDetails);
        return new AuthResponse(jwtCookie, userDetails.getFirstName(), userDetails.getLastName(), roles, userDetails.getActiveRole());
    }

    private void chooseActiveRole(UserDetailsImpl userDetails) {
        val roles = getUserRoles(userDetails);
        if (roles.contains(ERole.ROLE_FREELANCER.toString())) {
            userDetails.setActiveRole(ERole.ROLE_FREELANCER.toString());
        } else if (roles.contains(ERole.ROLE_EMPLOYER.toString())) {
            userDetails.setActiveRole(ERole.ROLE_EMPLOYER.toString());
        } else if (roles.contains(ERole.ROLE_UNVERIFIED.toString())) {
            userDetails.setActiveRole(ERole.ROLE_UNVERIFIED.toString());
        } else {
            throw new RuntimeException("User has no role assigned!");
        }
    }

    public Set<String> getUserRoles(UserDetailsImpl userDetails) {
        return userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
    }

}
