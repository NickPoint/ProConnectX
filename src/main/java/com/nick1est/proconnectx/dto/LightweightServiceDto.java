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
public class LightweightServiceDto {
    @NotNull
    private Long id;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private LightweightAddressDto address;
    @NotNull
    private Double rating;
    @NotNull
    private Integer ratingCount;
    @NotNull
    private Double price;
    @NotNull
    private LightWeightFreelancerDto freelancer;
    @NotEmpty
    private List<CategoryType> categories;
    @NotNull
    private OffsetDateTime postedAt;
    @NotNull
    private FileResponseDto thumbnailMeta;
}
