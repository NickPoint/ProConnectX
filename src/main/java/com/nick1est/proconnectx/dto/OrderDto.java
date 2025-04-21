package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class OrderDto {
    @NotNull
    private Long id;
    private BidDto acceptedBid;
    private FullServiceDto service;
    private ClientDto client;
    @NotNull
    private OrderStatus status;
    @NotNull
    private List<EventDto> events;
    @NotNull
    private OffsetDateTime createdAt;
    private OffsetDateTime completedAt;
}
