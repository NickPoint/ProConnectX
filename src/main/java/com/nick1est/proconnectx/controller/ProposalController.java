package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.Proposal;
import com.nick1est.proconnectx.service.ProposalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/proposal")
public class ProposalController {

    private final ProposalService proposalService;

    @Autowired
    public ProposalController(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    @PostMapping
    public ResponseEntity<Proposal> makeProposal(
            @RequestBody String description,
            @RequestParam Long freelancerId, //TODO: retrieve from session
            @RequestParam Long projectId,
            @RequestParam Integer price
    ) {
        return ResponseEntity.ok(proposalService.makeProposal(freelancerId, projectId, description, price));
    }

    @PutMapping("/approve")
    public Proposal approveProposal(Long proposalId) {
        return proposalService.approveProposal(proposalId);
    }

    @PutMapping("/decline")
    public Proposal declineProposal(Long proposalId) {
        return proposalService.declineProposal(proposalId);
    }

    @PutMapping("/review")
    public Proposal reviewProposal(Long proposalId) {
        return proposalService.reviewProposal(proposalId);
    }
}
