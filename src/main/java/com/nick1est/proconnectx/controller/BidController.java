/*
package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.BidStatus;
import com.nick1est.proconnectx.dto.BidDto;
import com.nick1est.proconnectx.dto.BidRequest;
import com.nick1est.proconnectx.dto.FormResponse;
import com.nick1est.proconnectx.service.ProjectService;
import com.nick1est.proconnectx.service.BidService;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bid")
public class BidController {

    private final ProjectService projectService;
    private final BidService bidService;

    @Autowired
    public BidController(ProjectService projectService, BidService bidService) {
        this.projectService = projectService;
        this.bidService = bidService;
    }

    @PostMapping("{projectId}")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public FormResponse makeBid(@PathVariable Long projectId, @RequestBody BidRequest bidRequest,
                                @AuthenticationPrincipal UserDetailsImpl userDetails) {
        bidService.makeBid(projectId, userDetails.getFreelancer(), bidRequest);
        return new FormResponse("Bid has been successfully made", true);
    }

    @PutMapping("/approve/{projectId}/{bidId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    public Bid approveBid(@PathVariable Long projectId, @PathVariable Long bidId) {
        checkOwnership(projectId);
        return bidService.approveBid(bidId);
    }
    @PutMapping("/decline/{projectId}/{bidId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    public Bid declineBid(@PathVariable Long projectId, @PathVariable Long bidId) {
        checkOwnership(projectId);
        return bidService.declineBid(bidId);
    }

    @PutMapping("/review/{projectId}/{bidId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    public Bid reviewBid(@PathVariable Long projectId, @PathVariable Long bidId) {
        checkOwnership(projectId);
        return bidService.reviewBid(bidId);
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<BidDto> getFilteredBids(@RequestParam Long projectId,
                                        @RequestParam(required = false) Integer rating,
                                        @RequestParam(required = false) String firstName,
                                        @RequestParam(required = false) String lastName,
                                        @RequestParam(required = false) Integer minPrice,
                                        @RequestParam(required = false) Integer maxPrice,
                                        @RequestParam(required = false) List<BidStatus> statuses) {
        checkOwnership(projectId);
        return bidService.findFilteredBids(projectId, rating, firstName, lastName, minPrice, maxPrice, statuses);
    }

    private void checkOwnership(Long projectId) {
        val user = SecurityContextHolder.getContext().getAuthentication().getUser();
        if (!(user instanceof UserDetailsImpl userDetails)) {
            throw new AccessDeniedException("You are not authorized to perform this operation");
        }
        Employer owner = projectService.findProjectOwner(projectId);
        if (!(owner.getId().equals(userDetails.getId()))
                && userDetails.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")))
        {
            throw new AccessDeniedException("You are not the owner of the projectId " + projectId.toString());
        }
    }

}
*/
