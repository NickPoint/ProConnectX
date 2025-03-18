package com.nick1est.proconnectx.dto.employer.registration;

import com.nick1est.proconnectx.dao.DocumentType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;


@Data
public class FileUploadRequest {
    @NotNull
    private DocumentType documentType;
    @NotNull
    private MultipartFile file;
}
