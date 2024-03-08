package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Proposal;
import com.nick1est.proconnectx.dao.ProposalStatus;
import com.nick1est.proconnectx.repository.ClientRepository;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.repository.ProjectRepository;
import com.nick1est.proconnectx.repository.ProposalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class ProposalService {
    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final FreelancerRepository freelancerRepository;

    @Autowired
    public ProposalService(ProposalRepository proposalRepository,
                           ClientRepository clientRepository,
                           ProjectRepository projectRepository, FreelancerRepository freelancerRepository) {
        this.proposalRepository = proposalRepository;
        this.projectRepository = projectRepository;
        this.freelancerRepository = freelancerRepository;
    }

    public Proposal approveProposal(Long proposalId) {
        log.info("Approving proposal with id {}", proposalId);
        val proposal = proposalRepository.findById(proposalId).orElseThrow(
                () -> new EntityNotFoundException("Proposal with id " + proposalId + " not found"));

        proposal.setProposalStatus(ProposalStatus.APPROVED);
        return proposal;
    }

    public Proposal declineProposal(Long proposalId) {
        log.info("Decline proposal with id {}", proposalId);
        val proposal = proposalRepository.findById(proposalId).orElseThrow(
                () -> new EntityNotFoundException("Proposal with id " + proposalId + " not found"));

        proposal.setProposalStatus(ProposalStatus.DECLINED);
        return proposal;
    }

    public Proposal reviewProposal(Long proposalId) {
        log.info("Review proposal with id {}", proposalId);
        val proposal = proposalRepository.findById(proposalId).orElseThrow(
                () -> new EntityNotFoundException("Proposal with id " + proposalId + " not found"));

        proposal.setProposalStatus(ProposalStatus.IN_REVIEW);
        return proposal;
    }

    public Proposal makeProposal(Long freelancerId, Long projectId, String description, Integer price) {
        log.info("Making proposal for freelancer with id {} for project with id {}", freelancerId, projectId);
        val freelancer = freelancerRepository.findById(freelancerId).orElseThrow(
                () -> new EntityNotFoundException("Freelancer with id " + freelancerId + " not found"));
        val project = projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("Project with id " + projectId + " not found"));

        val proposal = new Proposal();
        proposal.setFreelancer(freelancer);
        proposal.setProject(project);

        return proposalRepository.save(proposal);
    }

}
