package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.employer.registration.EmployerResponseDto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
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
    private List<ECategory> categories;
    @NotNull
    private ProjectStatus status;
    @NotEmpty
    private String location;
    @NotNull
    private ProjectType projectType;
    private Integer bidCount;
    private Double maxBid;
    private OffsetDateTime dueDate;
}
