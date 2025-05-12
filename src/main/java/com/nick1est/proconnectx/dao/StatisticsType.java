package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum StatisticsType {
    //Freelancer
    DAILY_TOTAL_EARNINGS,
    ORDERS_COMPLETED,
    ORDER_SUCCESS_RATE,
    ACTIVE_ORDERS,
    PENDING_PAYMENTS,

    //Client
    TOTAL_SERVICES_PURCHASED,

    //Common
    PROFILE_RATING
}
