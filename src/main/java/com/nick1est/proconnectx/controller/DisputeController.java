package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.annotations.CheckOwnership;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dto.DisputeDto;
import com.nick1est.proconnectx.service.DisputeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Dispute")
@RestController
@RequiredArgsConstructor
@RequestMapping("/dispute")
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
        disputeService.acceptProposal(disputeId, userDetails);
    }

    @PutMapping("/{disputeId}/reject-proposal")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void rejectProposal(@PathVariable Long disputeId,
                               @RequestBody String reason,
                               @AuthenticationPrincipal UserDetailsImpl userDetails) {
        disputeService.rejectProposal(disputeId, reason, userDetails);
    }

    @PutMapping("/{disputeId}/propose")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void proposeSolution(@PathVariable Long disputeId,
                                @NotEmpty @RequestBody String proposal,
                                @AuthenticationPrincipal UserDetailsImpl userDetails) {
        disputeService.proposeSolution(disputeId, proposal, userDetails);
    }


    @PutMapping("/{disputeId}/force-refund")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void forceRefund(@PathVariable Long disputeId,
                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        disputeService.forceRefund(disputeId, userDetails);
    }

    @PutMapping("/{disputeId}/force-release")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @CheckOwnership(type = ResourceType.DISPUTE)
    public void forceRelease(@PathVariable Long disputeId,
                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        disputeService.forceRelease(disputeId, userDetails);
    }
}
