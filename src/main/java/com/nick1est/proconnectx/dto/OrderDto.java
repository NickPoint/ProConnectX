package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.OrderStatus;
import com.nick1est.proconnectx.dto.employer.registration.FileDto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderDto {
    @NotNull
    private Long id;
//    private BidDto acceptedBid;
    @NotNull
    private LightweightServiceDto service;
    @NotNull
    private LightweightClientDto client;
    @NotNull
    private OrderStatus status;
    @NotNull
    private LightweightTransactionDto transaction;
    @NotNull
    private List<EventDto> events;
    private String additionalNotes;
    private List<FileDto> files;
    private String rejectionReason;
    @NotNull
    private Instant createdAt;
    private LocalDate deadlineDate;
    private Instant updatedAt;
}
