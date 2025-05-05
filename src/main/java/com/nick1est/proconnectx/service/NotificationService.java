package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.NotificationDto;
import com.nick1est.proconnectx.dto.NotificationPayload;
import com.nick1est.proconnectx.mapper.NotificationMapper;
import com.nick1est.proconnectx.repository.NotificationRepository;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final PrincipalRepository principalRepository;
    private final NotificationMapper notificationMapper;

    public Notification sendNotificationToFreelancer(Freelancer freelancer, NotificationType type, NotificationPayload payload) {
        Notification notification = new Notification();
        notification.setFreelancer(freelancer);
        notification.setType(type);
        notification.setPayload(payload);
        notification = notificationRepository.save(notification);

        sendNotification(freelancer.getPrincipal().getEmail(), notification);

        return notification;
    }

    public Notification sendNotificationToAdmin(NotificationType type, NotificationPayload payload) {
        val admin = principalRepository.findByEmail("admin@gmail.com").orElseThrow(()-> new UsernameNotFoundException("admin@gmail.com"));
        Notification notification = new Notification();
        notification.setPrincipal(admin);
        notification.setType(type);
        notification.setPayload(payload);
        notification = notificationRepository.save(notification);

        sendNotification(admin.getEmail(), notification);

        return notification;
    }

    public void markAsRead(Long id, Principal principal) {
        Notification notif = notificationRepository.findByIdAndPrincipal(id, principal)
                .orElseThrow(() -> new AccessDeniedException("Not yours"));
        notif.setStatus(NotificationStatus.READ);
        notif.setReadAt(Instant.now());
        notificationRepository.save(notif);
    }

    @Scheduled(fixedRate = 60000)
    public void retryFailedNotifications() {
        log.debug("Retrying failed notifications");
        List<Notification> failed = notificationRepository.findByStatus(NotificationStatus.FAILED);
        for (Notification notification : failed) {
            if (notification.getPrincipal() != null) {
                sendNotification(notification.getPrincipal().getEmail(), notification);
            }
        }
    }

    public void sendNotification(String username, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/notifications",
                    notificationMapper.toDto(notification));
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            notificationRepository.save(notification);
        }
    }

}

