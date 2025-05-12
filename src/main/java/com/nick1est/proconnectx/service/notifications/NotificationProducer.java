package com.nick1est.proconnectx.service.notifications;

import java.util.concurrent.CompletableFuture;

import com.nick1est.proconnectx.events.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {
    private final KafkaTemplate<String, NotificationEvent> kafkaTemplate;

    public void send(NotificationEvent event) {
        CompletableFuture<SendResult<String,NotificationEvent>> future =
                kafkaTemplate.send("notifications", event.getEventType().toString(), event);
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Send to kafka notifications topic failed", ex);
            }
        });
    }
}

