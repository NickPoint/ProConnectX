package com.nick1est.proconnectx.listeners;

import com.nick1est.proconnectx.dao.EntityType;
import com.nick1est.proconnectx.dao.NotificationType;
import com.nick1est.proconnectx.dto.NotificationPayload;
import com.nick1est.proconnectx.events.FreelancerRegisteredEvent;
import com.nick1est.proconnectx.events.ServiceOrderEvent;
import com.nick1est.proconnectx.events.UserApprovedEvent;
import com.nick1est.proconnectx.mapper.ClientMapper;
import com.nick1est.proconnectx.mapper.FreelancerMapper;
import com.nick1est.proconnectx.service.FreelancerService;
import com.nick1est.proconnectx.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationService notificationService;
    private final FreelancerMapper freelancerMapper;
    private final ClientMapper clientMapper;
    private final FreelancerService freelancerService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleServiceOrderCreated(ServiceOrderEvent event) {
        log.debug("Received service order event {}", event);
        if (event.freelancerId() != null) {
//            notificationService.notifyFreelancer(event.type(), event.freelancerId());
        }
        if (event.clientId() != null) {
//            notificationService.notifyClient(event.type(), event.clientId());
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUserApprovedEvent(UserApprovedEvent event) {
        log.debug("Received user approval event {}", event);
//        notificationService.notifyPrincipalAboutApproval(event.getUser().getPrincipal());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleFreelancerRegistered(FreelancerRegisteredEvent event) {
        log.debug("Received freelancer registered event {}", event);
        val payload = NotificationPayload.builder()
                .entityId(event.freelancerId())
                .entityType(EntityType.FREELANCER)
                .data(Map.of("name", event.fullName(), "avatarImageUrl", event.avatarImageUrl()))
                .build();

        notificationService.sendNotificationToAdmin(NotificationType.REGISTRATION_REQUEST, payload);
    }

}
