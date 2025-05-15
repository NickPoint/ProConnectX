package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.annotations.CheckOwnership;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dto.DisputeDto;
import com.nick1est.proconnectx.service.DisputeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Dispute")
@RestController
@RequiredArgsConstructor
@RequestMapping("/dispute")
@Slf4j
public class DisputeController {

    private final DisputeService disputeService;

    @GetMapping("/{disputeId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('FREELANCER') or hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public ResponseEntity<DisputeDto> getDispute(@PathVariable Long disputeId,
                                                 @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(disputeService.getDtoById(disputeId));
    }

    @PutMapping("/{disputeId}/accept-proposal")
    @PreAuthorize("hasAnyRole('CLIENT','ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void acceptProposal(@PathVariable Long disputeId,
                               @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Accepting proposal for dispute {}, username: {}", disputeId, userDetails.getUsername());
        disputeService.acceptProposal(disputeId, userDetails.getActiveProfile());
    }

    @PutMapping("/{disputeId}/reject-proposal")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void rejectProposal(@PathVariable Long disputeId,
                               @RequestBody String reason,
                               @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Rejecting proposal for dispute {}, username: {}", disputeId, userDetails.getUsername());
        disputeService.rejectProposal(disputeId, reason, userDetails.getActiveProfile());
    }

    @PutMapping("/{disputeId}/propose")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void proposeSolution(@PathVariable Long disputeId,
                                @NotEmpty @RequestBody String proposal,
                                @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Received proposal  for dispute {}, username: {}", disputeId, userDetails.getUsername());
        disputeService.proposeSolution(disputeId, proposal, userDetails.getActiveProfile());
    }


    @PutMapping("/{disputeId}/force-refund")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void forceRefund(@PathVariable Long disputeId,
                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.debug("Admin making refund for dispute {}, usename: {}", disputeId,  userDetails.getUsername());
        disputeService.adminRejectProposal(disputeId, userDetails.getActiveProfile());
    }

    @PutMapping("/{disputeId}/force-release")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void forceRelease(@PathVariable Long disputeId,
                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.debug("Admin making release for  dispute {}, username: {}", disputeId, userDetails.getUsername());
        disputeService.adminAcceptProposal(disputeId, userDetails.getActiveProfile());
    }

    @PutMapping("/{disputeId}/notify-admin")
    @PreAuthorize("hasAnyRole('FREELANCER','CLIENT')")
    public void notifyAdmin(@PathVariable Long disputeId,
                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.debug("User requested admin attention for dispute {}, username: {}", disputeId, userDetails.getUsername());
        disputeService.notifyAdmin(disputeId, userDetails.getActiveProfile());
    }
}
