package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.BidStatus;
import com.nick1est.proconnectx.dto.profile.BaseProfileDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class BidDto {
    @NotNull
    private Long id;
    @NotNull
    private BaseProfileDto freelancerProfile;
    @NotNull
    private Double amount;
    @NotNull
    private BidStatus status;
    @NotBlank
    private String coverLetter;
    @NotNull
    private Instant submittedAt;
    @NotNull
    private Instant estimatedCompletionDate;
}
