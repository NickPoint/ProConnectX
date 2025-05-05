package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum NotificationStatus {
    READ,
    UNREAD,
    FAILED,
}
