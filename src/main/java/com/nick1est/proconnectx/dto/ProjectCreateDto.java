package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.ECategory;
import com.nick1est.proconnectx.dao.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProjectCreateDto {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String shortDescription;
    @NotEmpty
    private List<ECategory> categories;
    @NotBlank
    private String location;
    @NotNull
    private ProjectType projectType;
    private Integer budget;
    private Double minSatisfyingBid;
    private Double bidStep;
}
