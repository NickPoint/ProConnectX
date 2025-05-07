package com.nick1est.proconnectx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class BookServiceDto {
    private String additionalNotes;

    @Schema(type = "array", format = "binary", description = "List of files to upload")
    private List<MultipartFile> files;
}
