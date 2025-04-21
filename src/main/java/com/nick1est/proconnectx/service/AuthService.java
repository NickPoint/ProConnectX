package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.JwtUtils;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.dao.Principal;
import com.nick1est.proconnectx.dto.AuthResponse;
import com.nick1est.proconnectx.dto.LoginRequest;
import com.nick1est.proconnectx.dto.SignupFormRequest;
import com.nick1est.proconnectx.exception.EmailAlreadyExistsException;
import com.nick1est.proconnectx.exception.FormValidationException;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private final ClientService clientService;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final FreelancerService freelancerService;

    public AuthResponse signInUser(LoginRequest loginRequest) {
        val authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        val userDetails = (UserDetailsImpl) authentication.getPrincipal();
        chooseActiveRole(userDetails);
        val jwtCookie = jwtUtils.generateJwtCookie(userDetails, userDetails.getActiveRoleType());
        val roles = getUserRoles(userDetails);
        return new AuthResponse(jwtCookie, userDetails.getFirstName(), userDetails.getLastName(),
                roles, userDetails.getActiveRoleType());
    }

    public boolean checkEmailExists(String email) {
        return principalRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public AuthResponse signupUser(SignupFormRequest signupFormRequest) {
        if (principalRepository.existsByEmail(signupFormRequest.getEmail())) {
            throw new EmailAlreadyExistsException("error.signup.email_exists", signupFormRequest.getEmail());
        }

        val principal = new Principal();
        principal.setEmail(signupFormRequest.getEmail());
        principal.setPassword(encoder.encode(signupFormRequest.getPassword()));
        val roleUnverified = roleRepository.findByName(RoleType.ROLE_UNVERIFIED)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        val roleFromRequest = roleRepository.findByName(signupFormRequest.getRole())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        principal.setRoles(Set.of(roleUnverified));

        if (RoleType.ROLE_CLIENT.equals(roleFromRequest)) {
            clientService.initClient(principal);
        } else {
            freelancerService.initFreelancer(principal);
        }

        return signInUser(new LoginRequest(signupFormRequest.getEmail(), signupFormRequest.getPassword()));
    }

    public AuthResponse switchRole(UserDetailsImpl userDetails, RoleType role) {
        if (!userDetails.getAuthorities().contains(new SimpleGrantedAuthority(role.toString()))) {
            throw new AccessDeniedException("You don't have access to this role: " + role);
        }
        val jwtCookie = jwtUtils.generateJwtCookie(userDetails, role);
        userDetails.setActiveRoleType(role);
        val roles = getUserRoles(userDetails);
        return new AuthResponse(jwtCookie, userDetails.getFirstName(), userDetails.getLastName(),
                roles, userDetails.getActiveRoleType());
    }

    private void chooseActiveRole(UserDetailsImpl userDetails) {
        val roles = getUserRoles(userDetails);
        if (roles.contains(RoleType.ROLE_UNVERIFIED)) {
            userDetails.setActiveRoleType(RoleType.ROLE_UNVERIFIED);
        } else if (roles.contains(RoleType.ROLE_FREELANCER)) {
            userDetails.setFirstName(userDetails.getFreelancer().getFirstName());
            userDetails.setLastName(userDetails.getFreelancer().getLastName());
            userDetails.setActiveRoleType(RoleType.ROLE_FREELANCER);
        } else if (roles.contains(RoleType.ROLE_EMPLOYER)) {
            userDetails.setFirstName(userDetails.getEmployer().getCompanyName());
            userDetails.setActiveRoleType(RoleType.ROLE_EMPLOYER);
        } else if (roles.contains(RoleType.ROLE_CLIENT)) {
            userDetails.setFirstName(userDetails.getClient().getFirstName());
            userDetails.setLastName(userDetails.getClient().getLastName());
            userDetails.setActiveRoleType(RoleType.ROLE_CLIENT);
        } else {
            throw new RuntimeException("User has no role assigned!");
        }
    }

    public Set<RoleType> getUserRoles(UserDetailsImpl userDetails) {
        return userDetails.getAuthorities().stream().map(grantedAuthority -> RoleType.valueOf(grantedAuthority.getAuthority())).collect(Collectors.toSet());
    }

}
