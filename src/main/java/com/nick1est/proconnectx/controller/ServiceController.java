package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.ServiceDao;
import com.nick1est.proconnectx.dto.ServiceCreateDto;
import com.nick1est.proconnectx.dto.ServiceFilter;
import com.nick1est.proconnectx.dto.ServiceFilterResponse;
import com.nick1est.proconnectx.service.ServiceService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service")
@Slf4j
public class ServiceController {

    private final ServiceService serviceService;

    @Autowired
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ServiceDao getService(@PathVariable Long id) {
        return serviceService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public ServiceDao createService(@Valid @RequestBody ServiceCreateDto service) {
        return serviceService.createService(service);
    }

    @PostMapping("/filter")
    @ResponseStatus(HttpStatus.OK)
    public List<ServiceFilterResponse> getFilteredServices(
            @RequestBody ServiceFilter serviceFilter) {
        return serviceService.findFilteredServices(serviceFilter);
    }
}
