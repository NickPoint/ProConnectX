package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.DisputeDto;
import com.nick1est.proconnectx.events.domain.*;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.DisputeMapper;
import com.nick1est.proconnectx.repository.DisputeRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final AdminOrderService adminOrderService;
    private final ApplicationEventPublisher events;
    private final DisputeMapper disputeMapper;

    @Transactional(propagation = Propagation.MANDATORY)
    public void openDispute(Order order, String reason, Profile client) {
        Dispute dispute = new Dispute();
        dispute.setOrder(order);
        dispute.setReason(reason);
        val savedDispute = disputeRepository.save(dispute);
        events.publishEvent(new OrderDisputedEvent(savedDispute, client));
    }

    @Transactional
    public void acceptProposal(Long disputeId, Profile client) {
        val dispute = getById(disputeId);

        dispute.setProposalStatus(ProposalStatus.ACCEPTED);
        changeStatus(dispute, DisputeStatus.RESOLVED_FREELANCER_PAID);
        events.publishEvent(new DisputeSolutionAcceptedEvent(dispute, client));
    }

    @Transactional
    public void adminAcceptProposal(Long disputeId, Profile admin) {
        val dispute = getById(disputeId);

        dispute.setProposalStatus(ProposalStatus.ACCEPTED);
        changeStatus(dispute, DisputeStatus.RESOLVED_FREELANCER_PAID);
        events.publishEvent(new DisputeSolutionAccepteByAdminEvent(dispute, admin));
        adminOrderService.approveOrderFromDispute(dispute.getOrder(), admin);
    }

    @Transactional
    public void rejectProposal(Long disputeId, String reason, Profile client) {
        val dispute = getById(disputeId);

        dispute.setProposalStatus(ProposalStatus.REJECTED);
        changeStatus(dispute, DisputeStatus.RESOLVED_REFUNDED);
        dispute.setProposalRejectionReason(reason);
        events.publishEvent(new DisputeSolutionRejectedEvent(dispute, client));
        openDispute(dispute.getOrder(), reason, client);
    }

    @Transactional
    public void adminRejectProposal(Long disputeId, Profile admin) {
        val dispute = getById(disputeId);

        dispute.setProposalStatus(ProposalStatus.REJECTED);
        changeStatus(dispute, DisputeStatus.REJECTED);
        events.publishEvent(new DisputeSolutionRejectedByAdminEvent(dispute, admin));
        adminOrderService.cancelOrderAndRefundFromDispute(dispute.getOrder(), admin);
    }

    @Transactional
    public void proposeSolution(Long disputeId, String proposal, Profile freelancer) {
        val dispute = getById(disputeId);
        dispute.setProposal(proposal);
        dispute.setProposalStatus(ProposalStatus.PENDING);
        changeStatus(dispute, DisputeStatus.IN_REVIEW);
        events.publishEvent(new DisputeSolutionProposedEvent(dispute, freelancer));
    }

    @Transactional
    public void notifyAdmin(Long disputeId, Profile user) {
        val dispute = getById(disputeId);
        changeStatus(dispute, DisputeStatus.ADMIN_ACTION_REQUIRED);
        events.publishEvent(new DisputeAdminNotifyEvent(dispute, user));
    }

    private void changeStatus(Dispute dispute, DisputeStatus newStatus) {
        if (!dispute.getStatus().canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                    "Invalid transition: " + dispute.getStatus() + " → " + newStatus
            );
        }
        dispute.setStatus(newStatus);
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
