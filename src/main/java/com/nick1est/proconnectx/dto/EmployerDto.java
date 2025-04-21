package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployerDto {
    @NotNull
    private Long id;
    @NotBlank
    private String companyName;
    @NotNull
    private Double rating;
    private String avatarUrl;
}
