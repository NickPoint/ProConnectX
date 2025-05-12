package com.nick1est.proconnectx.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Range;


@Data
public class PostReviewDto {
    @NotNull
    @Range(min = 0, max = 5)
    private Double rating;
    private String body;

}
