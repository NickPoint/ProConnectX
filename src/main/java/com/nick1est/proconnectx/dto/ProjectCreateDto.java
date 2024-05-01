package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ECategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProjectCreateDto {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String shortDescription;
    @NotNull
    private Integer budget;
    @NotNull
    private ECategory category;
    @NotBlank
    private String location;
}
