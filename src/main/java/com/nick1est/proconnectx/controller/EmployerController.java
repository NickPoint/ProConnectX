/*
package com.nick1est.proconnectx.controller;


import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.MessageResponse;
import com.nick1est.proconnectx.dto.employer.registration.EmployerRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.EmployerResponseDto;
//import com.nick1est.proconnectx.service.EmployerService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employer")
@RequiredArgsConstructor
public class EmployerController {
    private final EmployerService employerService;

    @GetMapping
    public ResponseEntity<EmployerResponseDto> getEmployer(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        val employer = employerService.getEmployerByPrincipal(userDetails);
        return ResponseEntity.ok().body(employer);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.OK)
    public MessageResponse registerEmployer(@RequestBody EmployerRegistrationRequest request) {
        val employer = employerService.createNewEmployer(request);
        return MessageResponse.builder()
                .message("Employer registered")
                .entityId(employer.getId()).build();
    }
}
*/
