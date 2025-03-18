package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.ECategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ServiceCreateDto {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Integer price;

    @NotBlank
    private String location;
    //TODO: Might be better to use Category id instead of ECategory

    @NotNull
    private ECategory category;
}
