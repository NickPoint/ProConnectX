package com.nick1est.proconnectx.service.notifications.email;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.events.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.function.BiConsumer;

import static com.nick1est.proconnectx.dao.AppEventType.*;

@Configuration
@RequiredArgsConstructor
public class EmailConfig {
    private final EmailChannelService emailChannelService;

    public Map<AppEventType, BiConsumer<Profile, NotificationEvent>> emailActions() {
        return Map.ofEntries(
                Map.entry(PROFILE_INITIATED, (p, e) -> emailChannelService.sendWelcomeEmail(p.getEmail(), p.getDisplayName())),

                Map.entry(PROFILE_CREATED, (p, e) -> emailChannelService.sendRegistrationRequestReceived(p.getEmail(), p.getDisplayName())),

                Map.entry(PROFILE_VERIFIED, (p, e) -> emailChannelService.sendProfileVerified(p.getEmail(), p.getDisplayName())),

                Map.entry(PROFILE_REJECTED, (p, e) -> emailChannelService.sendProfileRejected(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("reason").toString())),

                Map.entry(ORDER_PLACED, (p, e) -> emailChannelService.sendNewOrderEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("clientName").toString(),
                        e.getPayload().get("serviceName").toString(),
                        e.getPayload().get("orderId").toString())),

                Map.entry(ORDER_ACCEPTED, (p, e) -> emailChannelService.sendOrderAcceptedEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("freelancerName").toString(),
                        e.getPayload().get("serviceName").toString(),
                        e.getPayload().get("orderId").toString(),
                        e.getPayload().get("deadline").toString())),

                Map.entry(ORDER_SUBMITTED_FOR_REVIEW, (p, e) -> emailChannelService.sendOrderSubmittedForReviewEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("freelancerName").toString(),
                        e.getPayload().get("orderId").toString())),

                Map.entry(ORDER_APPROVED, (p, e) -> emailChannelService.sendOrderApprovedEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString())),

                Map.entry(ORDER_COMPLETED, (p, e) -> emailChannelService.sendOrderCompletedEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString())),

                Map.entry(ORDER_DISPUTED, (p, e) -> emailChannelService.sendOrderDisputedEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString(),
                        e.getPayload().get("reason").toString())),

                Map.entry(ORDER_CANCELED, (p, e) -> emailChannelService.sendOrderCanceledEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString(),
                        e.getPayload().get("reason").toString())),

                Map.entry(PROPOSAL_CREATED, (p, e) -> emailChannelService.sendDisputeSolutionProposedEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString(),
                        e.getPayload().get("solution").toString())),

                Map.entry(PROPOSAL_ACCEPTED, (p, e) -> emailChannelService.sendDisputeSolutionAcceptedEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString())),

                Map.entry(PROPOSAL_ACCEPTED_BY_ADMIN, (p, e) -> emailChannelService.sendDisputeSolutionAcceptedByAdminEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString())),

                Map.entry(PROPOSAL_REJECTED, (p, e) -> emailChannelService.sendDisputeSolutionRejectedEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString(),
                        e.getPayload().get("reason").toString())),

                Map.entry(PROPOSAL_REJECTED_BY_ADMIN, (p, e) -> emailChannelService.sendDisputeSolutionRejectedByAdminEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString())),

                Map.entry(ADMIN_NOTIFY, (p, e) -> emailChannelService.sendDisputeAdminNotifyEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("orderId").toString()))
        );
    }
}
