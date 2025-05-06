package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.FreelancerDto;
import com.nick1est.proconnectx.dto.employer.registration.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.UserProfileUpdateDto;
import com.nick1est.proconnectx.service.FreelancerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Freelancer")
@RestController
@RequestMapping("/freelancer")
public class FreelancerController {

    private final FreelancerService freelancerService;

    @Autowired
    public FreelancerController(FreelancerService freelancerService) {
        this.freelancerService = freelancerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FreelancerDto createFreelancer(@Valid @ModelAttribute FreelancerRegistrationRequest registrationRequest,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return freelancerService.registerFreelancer(registrationRequest, userDetails);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public FreelancerDto getFreelancer(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return freelancerService.getDtoById(userDetails.getFreelancer().getId());
    }

    @PutMapping("/profile")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public void updateFreelancer(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                 @Valid @RequestBody UserProfileUpdateDto userProfileUpdateDto) {
        freelancerService.updateProfile(userDetails.getFreelancer().getId(), userProfileUpdateDto);
    }

//    @PostMapping("/filter")
//    @ResponseStatus(HttpStatus.OK)
//    public List<FreelancerFilterResponse> getFilteredFreelancers(
//            @RequestBody FreelancerFilter freelancerFilter) {
//        return freelancerService.findFilteredFreelancers(freelancerFilter);
//    }
}
