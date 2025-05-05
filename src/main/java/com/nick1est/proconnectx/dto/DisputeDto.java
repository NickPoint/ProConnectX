package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.DisputeStatus;
import com.nick1est.proconnectx.dao.ProposalStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DisputeDto {
    @NotNull
    private Long id;

    @NotNull
    private DisputeStatus status;

    @NotEmpty
    private String reason;

    private ProposalStatus proposalStatus;
    private String proposal;
    private String proposalRejectionReason;
}
