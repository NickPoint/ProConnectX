package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Schema(enumAsRef = true)
@RequiredArgsConstructor
public enum ChannelType {
    ADMIN("admin"),
    CLIENT("client"),
    FREELANCER("freelancer");

    public final String name;
}
