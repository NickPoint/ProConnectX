package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class ProjectOwnerDto extends ProjectPublicDto {
    @NotNull
    private List<BidDto> bids;
}
