package com.nick1est.proconnectx.service.notifications.channels;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dto.ChannelType;
import com.nick1est.proconnectx.events.NotificationEvent;

public interface ChannelHandler {
    ChannelType channelType();
    void send(Profile profile, NotificationEvent event);
}
