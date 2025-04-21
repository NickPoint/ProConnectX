package com.nick1est.proconnectx.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class WorkflowStep {
    @NotNull
    private Integer stepNumber;
    @NotNull
    private String title;
    private String description;
}
