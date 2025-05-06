package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class BidRequest {
    @NotNull
    private Double amount;
    private String coverLetter;
    private Instant estimatedCompletionDate;
}