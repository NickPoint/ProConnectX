package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ServiceCreateDto {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String shortDescription;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    private BigDecimal price;

    private ServiceAddressDto address;

    @NotEmpty
    private List<CategoryType> categories;

    @NotEmpty
    private List<MultipartFile> images;

    private String workflowJson;
    private String faqsJson;
}
