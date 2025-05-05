package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class ReviewDto {
    @NotNull
    private Long id;
    @NotNull
    private ReviewerDto reviewer; //TODO: maybe it's better to use a oneOf because there is UserCard in frontend
    private String body;
    @NotNull
    private Double rating;
    //TODO: Avatar url
    @NotNull
    private Instant createdAt;
}
