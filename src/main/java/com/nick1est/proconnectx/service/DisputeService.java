package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.DisputeDto;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.DisputeMapper;
import com.nick1est.proconnectx.repository.DisputeRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final OrderDisputeService orderDisputeService;
    private final EventService eventService;
    private final DisputeMapper disputeMapper;

    @Transactional(propagation = Propagation.MANDATORY)
    public void openDispute(Order order, String reason, Client client) {
        Dispute dispute = new Dispute();
        dispute.setOrder(order);
        dispute.setReason(reason);
        disputeRepository.save(dispute);
        eventService.recordOrderDisputed(order, dispute, reason, client);
    }

    @Transactional
    public void acceptProposal(Long disputeId, UserDetailsImpl userDetails) {
        val dispute = getById(disputeId);

        if (dispute.getProposalStatus() != ProposalStatus.PENDING) {
            throw new IllegalStateException("error.proposal.no_pending");
        }

        dispute.setProposalStatus(ProposalStatus.ACCEPTED);
        dispute.setStatus(DisputeStatus.RESOLVED_FREELANCER_PAID);

        eventService.recordProposalAccepted(dispute, userDetails.getClient());
        orderDisputeService.approveOrderFromDispute(dispute.getOrder(), userDetails, AccountType.CLIENT);
    }

    @Transactional
    public void rejectProposal(Long disputeId, String reason, UserDetailsImpl userDetails) {
        val dispute = getById(disputeId);

        if (dispute.getProposalStatus() != ProposalStatus.PENDING) {
            throw new IllegalStateException("error.proposal.no_pending");
        }

        dispute.setProposalStatus(ProposalStatus.REJECTED);
        dispute.setStatus(DisputeStatus.REJECTED);
        dispute.setProposalRejectionReason(reason);
        eventService.recordProposalRejected(dispute, reason, userDetails.getClient());
        openDispute(dispute.getOrder(), reason, userDetails.getClient());
    }

    @Transactional
    public void proposeSolution(Long disputeId, String proposal, UserDetailsImpl userDetails) {
        val dispute = getById(disputeId);

        if (dispute.getProposalStatus() == ProposalStatus.PENDING) {
            throw new IllegalStateException("error.proposal.already_pending");
        }

        dispute.setProposal(proposal);
        dispute.setProposalStatus(ProposalStatus.PENDING);
        dispute.setStatus(DisputeStatus.IN_REVIEW);
        eventService.recordProposalCreated(dispute, proposal, userDetails.getFreelancer());
    }

    @Transactional
    public void forceRefund(Long disputeId, UserDetailsImpl userDetails) {
        val dispute = getById(disputeId);

        if (!dispute.getStatus().equals(DisputeStatus.OPEN)) {
            throw new IllegalStateException("error.dispute.force_refund");
        }

        dispute.setStatus(DisputeStatus.RESOLVED_REFUNDED);

        Order order = dispute.getOrder();
//      TODO: eventService.recordDisputeRefunded(dispute, userDetails);
        orderDisputeService.cancelOrderAndRefundFromDispute(order, userDetails);
    }

    @Transactional
    public void forceRelease(Long disputeId, UserDetailsImpl userDetails) {
        val dispute = getById(disputeId);

        if (!dispute.getStatus().equals(DisputeStatus.OPEN)) {
            throw new IllegalStateException("error.dispute.force_release");
        }

        dispute.setStatus(DisputeStatus.RESOLVED_FREELANCER_PAID);

        Order order = dispute.getOrder();
//      TODO: eventService.recordDisputeReleased(dispute, userDetails);
        orderDisputeService.approveOrderFromDispute(order, userDetails, AccountType.ADMIN);
    }

    public DisputeDto getDtoById(Long disputeId) {
        val dispute = getById(disputeId);
        return disputeMapper.toDto(dispute);
    }

    public Dispute getById(Long disputeId) {
        return disputeRepository.findById(disputeId)
                .orElseThrow(() -> new NotFoundException("error.dispute.not_found",  disputeId));
    }
}
