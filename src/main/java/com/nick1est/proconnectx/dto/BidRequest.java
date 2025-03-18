package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BidRequest {
    @NotNull
    private Double amount;
    private String coverLetter;
    private String shortCoverLetter;
    private LocalDate dueDate;
}