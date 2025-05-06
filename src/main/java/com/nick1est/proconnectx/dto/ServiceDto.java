package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class ServiceDto {
    @NotNull
    private Long id;
    @NotNull
    private LightWeightFreelancerDto freelancer;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String shortDescription;
    @NotNull
    private BigDecimal price;
    private List<WorkflowStep> workflow;
    private List<Faq> faqs;
    private ServiceAddressDto address;
    private List<ReviewDto> reviews;
    @NotEmpty
    private List<CategoryType> categories;
    @NotNull
    private Double rating;
    @NotNull
    private Integer ratingCount;
    @NotEmpty
    private List<String> galleryUrls;
    @NotNull
    private Instant postedAt;
}
