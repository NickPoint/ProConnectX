package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.EventType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventDto {
    @NotNull
    private Long id;

    private Long clientId;
    private Long freelancerId;

    @NotNull
    private EventType type;

    @NotNull
    private OffsetDateTime createdAt;
}