package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.ClientDto;
import com.nick1est.proconnectx.dto.FreelancerDto;
import com.nick1est.proconnectx.dto.FreelancerFilter;
import com.nick1est.proconnectx.dto.FreelancerFilterResponse;
import com.nick1est.proconnectx.dto.employer.registration.ClientRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.service.ClientService;
import com.nick1est.proconnectx.service.FreelancerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
