package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.EventType;
import com.nick1est.proconnectx.dao.Freelancer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public void notifyFreelancer(EventType eventType, Long freelancerId) {
        log.debug("Sending notification to freelancer {} about event {}", freelancerId, eventType);
        simpMessagingTemplate.convertAndSend("/topic/notifications/freelancer/" + freelancerId,
                "You received new orde!");
    }
}
