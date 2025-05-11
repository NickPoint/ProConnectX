package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.auth.UserDetailsServiceImpl;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dto.AuthResponse;
import com.nick1est.proconnectx.dto.LoginRequest;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.dto.SignupFormRequest;
import com.nick1est.proconnectx.exception.EmailAlreadyExistsException;
import com.nick1est.proconnectx.repository.UserRepository;
import com.nick1est.proconnectx.service.AuthCookieService;
import com.nick1est.proconnectx.service.UserService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
@Slf4j
public class AuthController {
    private final UserService userService;
    private final AuthCookieService authCookieService;
    private final UserRepository userRepository;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @GetMapping
    public ResponseEntity<AuthResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetailsImpl ud,
            @Parameter(hidden = true) @CookieValue(value = "${proConnectX.app.jwtCookieName}", required = false) String jwtCookie
    ) {
        if (ud == null) {
            return ResponseEntity.noContent().build();
        }

        AuthResponse body = userService.buildAuthResponse(ud);

        Optional<ResponseCookie> newCookie =
                authCookieService.refreshCookieIfNeeded(jwtCookie, ud.getActiveProfile().getProfileType(), ud.getUsername());

        ResponseEntity.BodyBuilder resp = ResponseEntity.ok();
        newCookie.ifPresent(cookie -> resp.header(HttpHeaders.SET_COOKIE, cookie.toString()));
        return resp.body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        val authResponse = userService.signInUser(loginRequest);
        return okWithCookie(authResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignupFormRequest signUpFormRequest) {
        val authResponse = userService.signupUser(signUpFormRequest);
        return okWithCookie(authResponse);
    }

    @PostMapping("/add-profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> addProfile(
            @AuthenticationPrincipal UserDetailsImpl ud,
            @RequestParam ProfileType profileType
    ) {
        userService.createProfile(ud.getUser().getId(), profileType);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @RequestMapping(path="/check-email", method = RequestMethod.HEAD)
    public ResponseEntity<Void> checkEmail(@RequestParam @Email String email) {
        if (userService.emailExists(email)) {
            throw new EmailAlreadyExistsException(email);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = authCookieService.clearCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }

    @PostMapping("/switch-profile")
    @Transactional
    public ResponseEntity<AuthResponse> switchProfile(
            @RequestParam ProfileType newProfileType,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        boolean hasProfile = userService.getAllActiveProfiles(userDetails.getUser().getId()).stream()
                .anyMatch(p -> p.getProfileType() == newProfileType);
        if (!hasProfile) {
            throw new AccessDeniedException("No access to profile: " + newProfileType);
        }

        userRepository.updateLastActiveProfile(userDetails.getUser().getId(), newProfileType);

        UserDetailsImpl updatedUd = userDetailsServiceImpl.loadUserByUsername(userDetails.getUsername());

        AuthResponse auth = userService.buildAuthResponse(updatedUd);

        ResponseCookie cookie = authCookieService.createCookie(
                auth.getEmail(),
                updatedUd.getActiveProfile().getProfileType());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(auth);
    }

    @GetMapping("/registration-requests")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public List<RegistrationRequestDto> getRegistrationRequests(@AuthenticationPrincipal UserDetailsImpl ud) {
        return userService.getRegistrationRequest(ud.getUser().getId());
    }

    private ResponseEntity<AuthResponse> okWithCookie(AuthResponse auth) {
        ResponseCookie cookie = authCookieService.createCookie(auth.getEmail(), auth.getActiveProfile().getProfileType());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(auth);
    }
}
