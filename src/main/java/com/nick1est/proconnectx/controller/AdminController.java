package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.service.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/freelancer-registrations")
    @PreAuthorize("hasRole('ADMIN')")
    @Tag(name = "Registration")
    public ResponseEntity<List<RegistrationRequestDto>> getFreelancersRegistrationRequests() {
        return ResponseEntity.ok().body(adminService.getFreelancersRegistrationRequests(null));
    }

    @GetMapping("/client-registrations")
    @PreAuthorize("hasRole('ADMIN')")
    @Tag(name = "Registration")
    public ResponseEntity<List<RegistrationRequestDto>> getClientsRegistrationRequests() {
        return ResponseEntity.ok().body(adminService.getClientsRegistrationRequests(null));
    }

    @PutMapping("registration/{type}/{id}/approve")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Tag(name = "Registration")
    public ResponseEntity<?> approveRegistrationRequest(@PathVariable @NotNull Long id,
                                                        @PathVariable @NotNull ProfileType type,
                                                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
        adminService.approveRegistrationRequest(id, type, userDetails);
        return ResponseEntity.ok().build();
    }

    @PutMapping("registration/{type}/{id}/reject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Tag(name = "Registration")
    public ResponseEntity<?> rejectRegistrationRequest(@PathVariable @NotNull Long id,
                                                       @PathVariable @NotNull ProfileType type,
                                                       @RequestBody @NotEmpty String reason,
                                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
        adminService.rejectRegistrationRequest(id, type, reason, userDetails);
        return ResponseEntity.ok().build();
    }
}
