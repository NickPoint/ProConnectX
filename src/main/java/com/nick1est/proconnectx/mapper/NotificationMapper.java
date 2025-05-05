package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Notification;
import com.nick1est.proconnectx.dto.NotificationDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class NotificationMapper {
    public abstract NotificationDto toDto(Notification notification);
}
