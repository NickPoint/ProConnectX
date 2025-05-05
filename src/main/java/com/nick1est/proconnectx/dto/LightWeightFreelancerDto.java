package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LightWeightFreelancerDto {
    @NotNull
    private Long id;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotNull
    private Double rating;
    @NotNull
    private String email;
    @NotNull
    private String phoneNumber;
    private String avatarImageUrl;
}
