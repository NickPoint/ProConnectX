package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.BidStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

@Data
public class BidFilter {
    @NotNull
    private Long projectId;

    @Range(min = 0, max = 5)
    private Integer rating;

    private String search;
    private String firstName;
    private String lastName;
    private Integer minPrice;
    private Integer maxPrice;
    private BidStatus status;
}
