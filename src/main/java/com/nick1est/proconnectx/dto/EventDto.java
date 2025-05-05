package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.EventType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class EventDto {
    @NotNull
    private Long id;

    @NotNull
    private EventType type;

    @NotNull
    private Instant createdAt;

    private Long disputeId;
}