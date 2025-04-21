package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ServiceFilter {
    private String title;
    @NotNull
    private List<CategoryType> categories;
    private String location;
    @NotNull
    private Double rating;
    @NotNull
    private Double minBudget;
    @NotNull
    private Double maxBudget;
}
