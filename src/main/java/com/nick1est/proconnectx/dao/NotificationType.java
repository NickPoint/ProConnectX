package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum NotificationType {
    NEW_ORDER,
    REGISTRATION_REQUEST,
    ORDER_APPROVED,
    ACCOUNT_APPROVED,
}
