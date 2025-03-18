package com.nick1est.proconnectx.dto.employer.registration;

import com.nick1est.proconnectx.dao.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class FileResponseDto {
    @NotNull
    private Long id;
    @NotBlank
    private String fileName;
    @NotNull
    private DocumentType documentType;
    @NotBlank
    private OffsetDateTime uploadDate;
    @NotNull
    private Boolean verified;

}
