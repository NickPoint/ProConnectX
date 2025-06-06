package com.nick1est.proconnectx.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.service.ServiceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Service")
@RestController
@RequestMapping("/service")
@Slf4j
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ServiceDto getService(@PathVariable Long id) {
        return serviceService.getServiceDtoById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Long createService(@Valid @ModelAttribute ServiceCreateDto service,
                              @AuthenticationPrincipal UserDetailsImpl userDetails) throws JsonProcessingException {

        val mapper = new ObjectMapper();

        List<WorkflowStep> workflow = mapper.readValue(
                service.getWorkflowJson(), new TypeReference<List<WorkflowStep>>() {
                });
        List<Faq> faqs = mapper.readValue(
                service.getFaqsJson(), new TypeReference<List<Faq>>() {
                });
        return serviceService.createService(service, workflow, faqs, userDetails.getActiveProfile().getId());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<LightweightServiceDto> getServices(@ParameterObject ServiceFilter serviceFilter,
                                                   @ParameterObject Pageable pageable) {
        return serviceService.getServices(serviceFilter, pageable);
    }

    @GetMapping("user-services")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('FREELANCER','ADMIN')")
    public Page<LightweightServiceDto> getUserServices(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                       @ParameterObject Pageable pageable) {
        return serviceService.getUserServices(userDetails, pageable);
    }
}
