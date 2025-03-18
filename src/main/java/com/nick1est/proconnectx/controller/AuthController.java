package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.JwtUtils;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.LoginRequest;
import com.nick1est.proconnectx.dto.MessageResponse;
import com.nick1est.proconnectx.dto.SignupFormRequest;
import com.nick1est.proconnectx.dto.AuthResponse;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import com.nick1est.proconnectx.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final JwtUtils jwtUtils;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.noContent().build();
        }
        log.debug("Getting current user: {}", userDetails);
        val roles = authService.getUserRoles(userDetails);
        return ResponseEntity.ok()
                .body(new AuthResponse(userDetails.getFirstName(), userDetails.getLastName(),
                        roles, userDetails.getActiveRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        val authResponse = authService.signInUser(loginRequest);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authResponse.getToken().toString())
                .body(authResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignupFormRequest signUpFormRequest) throws AccessDeniedException {
        val authResponse = authService.signupUser(signUpFormRequest);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authResponse.getToken().toString())
                .body(authResponse);
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
    public ResponseEntity<?> switchRole(@RequestParam String role, @AuthenticationPrincipal UserDetailsImpl userDetails) throws AccessDeniedException {
        val authResponse = authService.switchRole(userDetails, role);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authResponse.toString())
                .body(authResponse);
    }


}