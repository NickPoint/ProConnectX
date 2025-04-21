package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.dto.employer.registration.FileResponseDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class FullServiceDto {
    @NotNull
    private Long id;
    @NotNull
    private LightWeightFreelancerDto freelancer;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private Double price;
    private List<WorkflowStep> workflow;
    private List<Faq> faqs;
    private AddressDto address;
    private List<ReviewDto> reviews;
    @NotEmpty
    private List<CategoryType> categories;
    @NotNull
    private Double rating;
    @NotNull
    private Integer ratingCount;
    @NotEmpty
    private List<FileResponseDto> imagesMeta;
    @NotNull
    private OffsetDateTime postedAt;
}
