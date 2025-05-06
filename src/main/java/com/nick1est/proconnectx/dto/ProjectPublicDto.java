package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.dao.ProjectStatus;
import com.nick1est.proconnectx.dao.ProjectType;
import com.nick1est.proconnectx.dto.employer.registration.EmployerResponseDto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class ProjectPublicDto {
    @NotNull
    private Long id;
    @NotEmpty
    private String title;
    @NotEmpty
    private String description;
    private String shortDescription;
    @NotNull
    private EmployerResponseDto employer;
    private Double budget;
    @NotNull
    private List<CategoryType> categories;
    @NotNull
    private ProjectStatus status;
    @NotEmpty
    private String location;
    @NotNull
    private ProjectType projectType;
    private Integer bidCount;
    private Double maxBid;
    private Instant dueDate;
}
