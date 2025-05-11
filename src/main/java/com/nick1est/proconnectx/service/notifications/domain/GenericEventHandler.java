package com.nick1est.proconnectx.service.notifications.domain;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.events.NotificationEvent;
import com.nick1est.proconnectx.service.notifications.channels.ChannelHandler;
import com.nick1est.proconnectx.service.profile.ProfileResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

import static com.nick1est.proconnectx.dao.AppEventType.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class GenericEventHandler implements DomainEventHandler {
    private final ProfileResolver resolver;
    private final List<ChannelHandler> channelHandlers;

    @Override
    public Set<AppEventType> eventType() {
        return Set.of(PROFILE_INITIATED, PROFILE_CREATED, PROFILE_VERIFIED, PROFILE_REJECTED);
    }

    @Override
    public void handle(NotificationEvent event) {
        Profile profile = resolver.resolve(event.getRecipientId(), event.getProfileType());
        channelHandlers.stream()
                .filter(ch -> event.getChannels().contains(ch.channelType()))
                .forEach(ch -> ch.send(profile, event));
    }
}
