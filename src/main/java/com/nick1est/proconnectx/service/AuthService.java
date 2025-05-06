package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.JwtUtils;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.AccountType;
import com.nick1est.proconnectx.dao.Principal;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.dto.AuthResponse;
import com.nick1est.proconnectx.dto.LightweightRegistrationRequestDto;
import com.nick1est.proconnectx.dto.LoginRequest;
import com.nick1est.proconnectx.dto.SignupFormRequest;
import com.nick1est.proconnectx.exception.EmailAlreadyExistsException;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.ClientMapper;
import com.nick1est.proconnectx.mapper.FreelancerMapper;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.context.MessageSource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

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
    private final ClientMapper clientMapper;
    private final FreelancerMapper freelancerMapper;
    private final MessageSource messageSource;

    public AuthResponse signInUser(LoginRequest loginRequest) {
        val authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        val userDetails = (UserDetailsImpl) authentication.getPrincipal();
        val jwtCookie = jwtUtils.generateJwtCookie(userDetails, userDetails.getActiveRole());
        return new AuthResponse(jwtCookie, userDetails, getAvatarUrl(userDetails));
    }

    public boolean checkEmailExists(String email) {
        return principalRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public AuthResponse signupUser(SignupFormRequest signupFormRequest) {
        if (principalRepository.existsByEmail(signupFormRequest.getEmail())) {
            throw new EmailAlreadyExistsException(signupFormRequest.getEmail());
        }

        val principal = new Principal();
        principal.setEmail(signupFormRequest.getEmail());
        principal.setPassword(encoder.encode(signupFormRequest.getPassword()));
        val roleUnverified = roleRepository.findByName(RoleType.ROLE_UNVERIFIED)
                .orElseThrow(() -> new NotFoundException("error.role.not_found"));
        principal.setRoles(Set.of(roleUnverified));
        addAccount(principal, signupFormRequest.getAccountType());

        return signInUser(new LoginRequest(signupFormRequest.getEmail(), signupFormRequest.getPassword()));
    }

    @Transactional
    public void addAccount(Long principalId, AccountType accountType) {
        val principal = getById(principalId);
        addAccount(principal, accountType);
    }

    public void addAccount(Principal principal, AccountType accountType) {
        if (AccountType.CLIENT.equals(accountType)) {
            clientService.initUser(principal);
        } else if (AccountType.FREELANCER.equals(accountType)) {
            freelancerService.initUser(principal);
        } else {
            throw new NotFoundException("error.account.not_allowed", accountType);
        }
    }

    public AuthResponse switchRole(UserDetailsImpl userDetails, RoleType role) {
        if (!userDetails.hasRole(role)) {
            throw new AccessDeniedException("You don't have access to this role: " + role);
        }
        val jwtCookie = jwtUtils.generateJwtCookie(userDetails, role);
        userDetails.setActiveRole(role);
        return new AuthResponse(jwtCookie, userDetails, getAvatarUrl(userDetails));
    }

    public List<LightweightRegistrationRequestDto> getFreelancerRegistrationRequests(UserDetailsImpl userDetails) {
        return freelancerMapper.toLightweightRegistrationRequestDto(userDetails.getPrincipal().getFreelancerAccounts());
    }

    public List<LightweightRegistrationRequestDto> getClientRegistrationRequests(UserDetailsImpl userDetails) {
        return clientMapper.toLightweightRegistrationRequestDto(userDetails.getPrincipal().getClientAccounts());
    }

    public String getAvatarUrl(UserDetailsImpl userDetails) {

        return switch (userDetails.getActiveRole()) {
            case ROLE_FREELANCER -> freelancerService
                    .getAvatarUrl(freelancerService.getById(userDetails.getFreelancer().getId()));
            case ROLE_CLIENT -> clientService
                    .getAvatarUrl(clientService.getById(userDetails.getClient().getId()));
            default -> null;
        };
    }

    public Principal getById(Long principalId) {
        return principalRepository.findById(principalId)
                .orElseThrow(() -> new NotFoundException("error.principal.not_found", principalId));
    }

}
