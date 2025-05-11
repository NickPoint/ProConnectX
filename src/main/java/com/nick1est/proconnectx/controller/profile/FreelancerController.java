package com.nick1est.proconnectx.controller.profile;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.profile.FreelancerProfileDto;
import com.nick1est.proconnectx.dto.profile.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.dto.profile.UserProfileUpdateDto;
import com.nick1est.proconnectx.service.profile.FreelancerProfileService;
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
@Tag(name = "Freelancer")
@RestController
@RequestMapping("/freelancer")
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerProfileService freelancerProfileService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FreelancerProfileDto createFreelancer(@Valid @ModelAttribute FreelancerRegistrationRequest registrationRequest,
                                                 @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return freelancerProfileService.createProfile(registrationRequest, userDetails);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public FreelancerProfileDto getFreelancer(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return freelancerProfileService.getDtoById(userDetails.getActiveProfile().getId());
    }

    @PutMapping("/profile")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public void updateFreelancer(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                 @Valid @RequestBody UserProfileUpdateDto userProfileUpdateDto) {
        freelancerProfileService.updateProfile(userDetails.getActiveProfile().getId(), userProfileUpdateDto);
    }

    @PostMapping("/avatar")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> updateFreelancerAvatar(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                    @RequestPart("avatar") MultipartFile file) {
        freelancerProfileService.updateAvatar(userDetails.getActiveProfile().getId(), file);
        return ResponseEntity.ok().build();
    }

//    @PostMapping("/filter")
//    @ResponseStatus(HttpStatus.OK)
//    public List<FreelancerFilterResponse> getFilteredFreelancers(
//            @RequestBody FreelancerFilter freelancerFilter) {
//        return freelancerService.findFilteredFreelancers(freelancerFilter);
//    }
}
