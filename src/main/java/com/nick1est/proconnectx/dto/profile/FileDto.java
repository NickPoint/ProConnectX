package com.nick1est.proconnectx.dto.profile;

import com.nick1est.proconnectx.dao.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class FileDto {
    @NotNull
    private Long id;
    @NotBlank
    private String originalFileName;
    @NotNull
    private Instant uploadedAt;
}
