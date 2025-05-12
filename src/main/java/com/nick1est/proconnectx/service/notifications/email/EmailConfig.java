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

    @Bean
    public Map<AppEventType, BiConsumer<Profile, NotificationEvent>> emailActions() {
        return Map.of(
                PROFILE_INITIATED, (p,e) -> emailChannelService.sendWelcomeEmail(p.getEmail(), p.getDisplayName()),
                PROFILE_CREATED,  (p,e) -> emailChannelService.sendRegistrationRequestReceived(p.getEmail(), p.getDisplayName()),
                PROFILE_VERIFIED, (p,e) -> emailChannelService.sendProfileVerified(p.getEmail(), p.getDisplayName()),
                PROFILE_REJECTED, (p, e) -> emailChannelService.sendProfileRejected(p.getEmail(), p.getDisplayName(), e.getPayload().get("reason").toString()),
                ORDER_PLACED, (p, e) -> emailChannelService.sendNewOrderEmail(p.getEmail(), p.getDisplayName(),
                        e.getPayload().get("clientName").toString(), e.getPayload().get("serviceName").toString(), e.getPayload().get("orderId").toString())
        );
    }
}
