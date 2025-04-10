package com.nick1est.proconnectx.events;

import com.nick1est.proconnectx.dao.EventType;
import jakarta.validation.constraints.NotNull;

public record ServiceOrderEvent(@NotNull Long orderId, @NotNull EventType type, Long freelancerId, Long clientId) {
}
