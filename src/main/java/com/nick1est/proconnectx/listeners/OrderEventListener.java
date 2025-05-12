package com.nick1est.proconnectx.listeners;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.events.NotificationEvent;
import com.nick1est.proconnectx.events.domain.*;
import com.nick1est.proconnectx.repository.UserRepository;
import com.nick1est.proconnectx.service.RoleService;
import com.nick1est.proconnectx.service.notifications.NotificationProducer;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

import static com.nick1est.proconnectx.dto.ChannelType.EMAIL;
import static com.nick1est.proconnectx.dto.ChannelType.IN_APP;

@Component
@RequiredArgsConstructor
public class OrderEventListener {
    private final NotificationProducer notificationProducer;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orderPlacedEvent(OrderPlacedEvent event) {
        val freelancer = event.getOrder().getFreelancer();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(freelancer.getId())
                .profileType(freelancer.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orderAcceptedEvent(OrderAcceptedEvent event) {
        val client = event.getOrder().getClient();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(client.getId())
                .profileType(client.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orderCompletedEvent(OrderCompletedEvent event) {
        val client = event.getOrder().getClient();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(client.getId())
                .profileType(client.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());

        val freelancer = event.getOrder().getFreelancer();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(freelancer.getId())
                .profileType(freelancer.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orderSubmitterForReviewEvent(OrderSubmitterForReviewEvent event) {
        val client = event.getOrder().getClient();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(client.getId())
                .profileType(client.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orderApprovedEvent(OrderApprovedEvent event) {
        val freelancer = event.getOrder().getFreelancer();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(freelancer.getId())
                .profileType(freelancer.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orderDisputedEvent(OrderDisputedEvent event) {
        val freelancer = event.getOrder().getFreelancer();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(freelancer.getId())
                .profileType(freelancer.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orderCanceledEvent(OrderCanceledEvent event) {
        val freelancer = event.getOrder().getFreelancer();
        notificationProducer.send(NotificationEvent.builder()
                .recipientId(freelancer.getId())
                .profileType(freelancer.getProfileType())
                .eventType(event.getType())
                .payload(event.getPayload())
                .channels(List.of(EMAIL, IN_APP))
                .build());
    }
}

/*@Component
@RequiredArgsConstructor
public class OrderEventListener {
    private final NotificationDispatcher dispatcher;

    @TransactionalEventListener(phase = AFTER_COMMIT)
    public void handle(OrderEvent event) {
        dispatcher.dispatch(event);
    }
}*/

/*public interface NotificationStrategy<E extends OrderEvent> {
    boolean supports(EventType type);
    NotificationEvent buildNotification(E event);
}*/

/*
@Component
public class NotificationDispatcher {
    private final Map<EventType, NotificationStrategy<?>> strategies;

    public NotificationDispatcher(List<NotificationStrategy<?>> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                        s -> s.getSupportedType(),
                        Function.identity()
                ));
    }

    public void dispatch(OrderEvent event) {
        NotificationStrategy<OrderEvent> strat =
                (NotificationStrategy<OrderEvent>) strategies.get(event.getType());
        if (strat != null) {
            notificationProducer.send(strat.buildNotification(event));
        } else {
            log.warn("No strategy for event {}", event.getType());
        }
    }
}*/
