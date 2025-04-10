package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FreelancerDto {
    @NotNull
    private Long id;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    private String avatarUrl;
    private Double rating;
    private Integer ratingCount;
}
