package com.nick1est.proconnectx.service.notifications.channels;

import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dto.ChannelType;
import com.nick1est.proconnectx.events.NotificationEvent;
import com.nick1est.proconnectx.service.notifications.email.EmailChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.function.BiConsumer;

@Component
@RequiredArgsConstructor
public class EmailChannelHandler implements ChannelHandler {
    private final Map<AppEventType, BiConsumer<Profile, NotificationEvent>> emailActions;

    @Override public ChannelType channelType() { return ChannelType.EMAIL; }

    @Override
    public void send(Profile profile, NotificationEvent event) {
        emailActions.get(event.getEventType()).accept(profile, event);
    }
}
