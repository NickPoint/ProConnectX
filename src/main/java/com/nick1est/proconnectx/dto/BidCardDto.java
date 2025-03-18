package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.BidStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
public class BidCardDto {
    @NotNull
    private Long id;
    @NotNull
    private Double amount;
    @NotNull
    private FreelancerMainInfo bidder;
    private String coverLetter;
    private String shortCoverLetter;
    @NotNull
    private BidStatus status;
    private LocalDate dueDate;
    @NotNull

    private OffsetDateTime datePosted;
}
