package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Bid;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class ProjectOwnerDto extends ProjectPublicDto {
    @NotNull
    private List<BidCardDto> bids;
}
