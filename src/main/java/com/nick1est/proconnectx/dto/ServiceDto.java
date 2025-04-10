package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class ServiceDto {
    @NotNull
    private Long id;
    @NotNull
    private FreelancerDto freelancer;
    @NotEmpty
    private String title;
    @NotEmpty
    private String description;
    @NotNull
    private Double price;
    @NotNull
    private List<CommentDto> comments;
    @NotEmpty
    private String location;
    @NotNull
    private CategoryType category;
    @NotNull
    private Double rating;
    @NotNull
    private Integer ratingCount;
    @NotNull
    private OffsetDateTime postedAt;
}
