package com.nick1est.proconnectx.listeners;

import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.events.NotificationEvent;
import com.nick1est.proconnectx.events.domain.ProfileCreatedEvent;
import com.nick1est.proconnectx.events.domain.ProfileInitiatedEvent;
import com.nick1est.proconnectx.events.domain.ProfileRejectedEvent;
import com.nick1est.proconnectx.events.domain.ProfileVerifiedEvent;
import com.nick1est.proconnectx.repository.UserRepository;
import com.nick1est.proconnectx.service.notifications.NotificationProducer;
import com.nick1est.proconnectx.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Collections;
import java.util.List;

import static com.nick1est.proconnectx.dto.ChannelType.EMAIL;
import static com.nick1est.proconnectx.dto.ChannelType.IN_APP;

@Async
@Component
@RequiredArgsConstructor
public class OnBoardingEventListener {
    private final NotificationProducer notificationProducer;
    private final UserRepository userRepository;

    //TODO: blocking http threads when kafka is down
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProfileInitiated(ProfileInitiatedEvent e) {
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(e.getProfileId())
                .profileType(e.getProfileType())
                .eventType(e.getType())
                .channels(List.of(EMAIL))
                .build());

        val admins = userRepository.findAllByLastActiveProfile(ProfileType.ADMIN);
        admins.forEach(admin -> {
            notificationProducer.send(NotificationEvent.builder()
                    .recipientId(admin.getId())
                    .profileType(ProfileType.ADMIN)
                    .eventType(AppEventType.PROFILE_INITIATED)
                    .channels(List.of(EMAIL, IN_APP))
                    .build());
        });
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProfileCreated(ProfileCreatedEvent e) {
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(e.getProfileId())
                .profileType(e.getProfileType())
                .eventType(e.getType())
                .channels(List.of(EMAIL, IN_APP))
                .build());

        val admins = userRepository.findAllByLastActiveProfile(ProfileType.ADMIN);
        admins.forEach(admin -> {
            notificationProducer.send(NotificationEvent.builder()
                    .recipientId(admin.getId())
                    .profileType(ProfileType.ADMIN)
                    .eventType(e.getType())
                    .channels(List.of(EMAIL, IN_APP))
                    .build());
        });
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProfileVerified(ProfileVerifiedEvent e) {
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(e.getProfileId())
                .profileType(e.getProfileType())
                .eventType(e.getType())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProfileVerified(ProfileRejectedEvent e) {
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(e.getProfileId())
                .profileType(e.getProfileType())
                .eventType(e.getType())
                .payload(e.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }
}
