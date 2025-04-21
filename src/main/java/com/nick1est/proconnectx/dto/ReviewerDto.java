package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewerDto {
    @NotNull
    private Long id;
    @NotBlank
    private String firstName;
    private String lastName;
    @NotNull
    private Double rating;
    @NotNull
    private ReviewerType type;
    private String avatarUrl;

    public enum ReviewerType {
        Employer,
        Client,
        Freelancer
    }
}
