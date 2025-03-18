package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Schema(enumAsRef = true)
public enum ServiceType {
    FIXED("Fixed"),
    HOURLY("Hourly");

    private final String type;
}
