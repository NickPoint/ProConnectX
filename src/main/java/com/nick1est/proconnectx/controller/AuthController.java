package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.JwtUtils;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.AccountType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.exception.EmailAlreadyExistsException;
import com.nick1est.proconnectx.service.AuthService;
import com.nick1est.proconnectx.service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final JwtUtils jwtUtils;
    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.debug("Getting active session user: {}", userDetails);
        if (userDetails == null) {
            return ResponseEntity.noContent().build();
        }
        val activeRole = roleService.getByName(userDetails.getActiveRole());
        val authResponse = new AuthResponse(userDetails, authService.getAvatarUrl(userDetails));
        if (!userDetails.getPrincipal().getRoles().contains(activeRole)) {
            userDetails.chooseActiveRole();
            val jwtCookie = jwtUtils.generateJwtCookie(userDetails, userDetails.getActiveRole());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(authResponse);
        }
        return ResponseEntity.ok().body(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        val authResponse = authService.signInUser(loginRequest);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authResponse.getToken().toString())
                .body(authResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignupFormRequest signUpFormRequest) {
        val authResponse = authService.signupUser(signUpFormRequest);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authResponse.getToken().toString())
                .body(authResponse);
    }

    @PostMapping("/add-account")
    @PreAuthorize("hasAnyRole('CLIENT','FREELANCER','UNVERIFIED')")
    public ResponseEntity<?> addAccount(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                        @NotNull AccountType accountType) {
        authService.addAccount(userDetails.getPrincipal().getId(), accountType);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/check-email")
    public ResponseEntity<Void> checkEmail(@RequestParam @NotBlank @Email String email) {
        boolean exists = authService.checkEmailExists(email);
        if (exists) {
            throw new EmailAlreadyExistsException(email);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        val cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(MessageResponse.builder().message("You've been signed out!").build());
    }

    @PostMapping("/switch-role")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> switchRole(@RequestParam RoleType role, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        val authResponse = authService.switchRole(userDetails, role);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authResponse.getToken().toString())
                .body(authResponse);
    }

    @GetMapping("/freelancer-registrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LightweightRegistrationRequestDto>> getFreelancerRegistrationRequests(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        val registrations = authService.getFreelancerRegistrationRequests(userDetails);
        return ResponseEntity.ok().body(registrations);
    }

    @GetMapping("/client-registrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LightweightRegistrationRequestDto>> getClientRegistrationRequests(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        val registrations = authService.getClientRegistrationRequests(userDetails);
        return ResponseEntity.ok().body(registrations);
    }

}