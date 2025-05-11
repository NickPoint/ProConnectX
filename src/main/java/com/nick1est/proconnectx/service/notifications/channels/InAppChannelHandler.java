/*package com.nick1est.proconnectx.service.notifications.channels;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dto.ChannelType;
import com.nick1est.proconnectx.events.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InAppChannelHandler implements ChannelHandler {
    private final InAppNotificationService inAppService;

    @Override public ChannelType channelType() { return ChannelType.IN_APP; }

    @Override
    public void send(Profile profile, NotificationEvent event) {
        switch (event.getEventType()) {
            case PROFILE_INITIATED:
                inAppService.sendNotification(
                        profile.getId(),
                        "Welcome, " + profile.getDisplayName() + "!"
                );
                break;
            // …other eventTypes…
        }
    }
}*/
