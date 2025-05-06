package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.ClientDto;
import com.nick1est.proconnectx.dto.employer.registration.ClientRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.UserProfileUpdateDto;
import com.nick1est.proconnectx.service.ClientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Client")
@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientDto createClient(@Valid @ModelAttribute ClientRegistrationRequest registrationRequest,
                                  @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return clientService.createClient(registrationRequest, userDetails);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ClientDto getClient(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return clientService.getDtoById(userDetails.getClient().getId());
    }

    @PutMapping("/profile")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public void updateClient(@AuthenticationPrincipal UserDetailsImpl userDetails,
                             @Valid @RequestBody UserProfileUpdateDto userProfileUpdateDto) {
        clientService.updateProfile(userDetails.getClient().getId(), userProfileUpdateDto);
    }
}
