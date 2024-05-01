package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dto.BidRequest;
import com.nick1est.proconnectx.service.ProjectService;
import com.nick1est.proconnectx.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bid")
public class BidController {

    private final ProjectService projectService;
    private final BidService bid;

    @Autowired
    public BidController(ProjectService projectService, BidService bid) {
        this.projectService = projectService;
        this.bid = bid;
    }

    @PostMapping("{projectId}")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Bid> makeBid(
            @RequestBody BidRequest bidRequest,
            @PathVariable Long projectId
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(bid.makeBid(
                userDetails.getId(), 
                projectId, 
                bidRequest.getDescription(), 
                bidRequest.getPrice()));
    }

    @PutMapping("/approve/{projectId}/{bidId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    public Bid approveBid(@PathVariable Long projectId, @PathVariable Long bidId) {
        checkOwnership(projectId);
        return bid.approveBid(bidId);
    }
    @PutMapping("/decline/{projectId}/{bidId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    public Bid declineBid(@PathVariable Long projectId, @PathVariable Long bidId) {
        checkOwnership(projectId);
        return bid.declineBid(bidId);
    }

    @PutMapping("/review/{projectId}/{bidId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    public Bid reviewBid(@PathVariable Long projectId, @PathVariable Long bidId) {
        checkOwnership(projectId);
        return bid.reviewBid(bidId);
    }

    private void checkOwnership(Long projectId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Project project = projectService.findProject(projectId);
        if (!(project.getOwner().getId().equals(userDetails.getId()))) {
            throw new AccessDeniedException("You are not the owner of the project " + projectId.toString());
        }
    }

}
