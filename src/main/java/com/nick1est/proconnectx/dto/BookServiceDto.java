package com.nick1est.proconnectx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Value;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Value
public class BookServiceDto {
    String additionalNotes;

    @Schema(type = "array", format = "binary", description = "List of files to upload")
    List<MultipartFile> files;
}
