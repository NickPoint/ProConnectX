package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.dto.profile.BaseProfileDto;
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
    private BaseProfileDto freelancer;
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
    @NotEmpty
    private List<CategoryType> categories;
    @NotNull
    private BigDecimal rating;
    @NotNull
    private Long ratingCount;
    @NotEmpty
    private List<String> galleryUrls;
    @NotNull
    private Instant postedAt;
}
