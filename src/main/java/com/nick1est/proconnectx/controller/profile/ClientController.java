package com.nick1est.proconnectx.controller.profile;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.profile.ClientProfileDto;
import com.nick1est.proconnectx.dto.profile.ClientRegistrationRequest;
import com.nick1est.proconnectx.dto.profile.UserProfileUpdateDto;
import com.nick1est.proconnectx.service.profile.ClientProfileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Tag(name = "Client")
@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientProfileService profileService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientProfileDto createClient(@Valid @ModelAttribute ClientRegistrationRequest registrationRequest,
                                         @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return profileService.createProfile(registrationRequest, userDetails);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ClientProfileDto getClient(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return profileService.getDtoById(userDetails.getActiveProfile().getId());
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public void updateClient(@AuthenticationPrincipal UserDetailsImpl userDetails,
                             @Valid @RequestBody UserProfileUpdateDto userProfileUpdateDto) {
        profileService.updateProfile(userDetails.getActiveProfile().getId(), userProfileUpdateDto);
    }

    @PostMapping("/avatar")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> updateClientAvatar(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                @RequestPart("avatar") MultipartFile file) {
        profileService.updateAvatar(userDetails.getActiveProfile().getId(), file);
        return ResponseEntity.ok().build();
    }
}
