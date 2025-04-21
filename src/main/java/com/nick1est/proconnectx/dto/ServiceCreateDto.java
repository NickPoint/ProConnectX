package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.converter.FaqConverter;
import com.nick1est.proconnectx.converter.WorkflowConverter;
import com.nick1est.proconnectx.dao.CategoryType;
import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @NotEmpty
    private List<CategoryType> categories;

    @NotEmpty
    private List<MultipartFile> images;

    private String workflowJson;
    private String faqsJson;
}
