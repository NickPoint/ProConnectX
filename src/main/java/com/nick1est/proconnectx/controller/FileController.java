package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.service.FileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Tag(name = "File")
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

//    @GetMapping
//    public ResponseEntity<List<FileDto>> getPrincipalFiles(
//            @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        List<FileDto> documents = fileService.getOwnerFiles(userDetails);
//        return ResponseEntity.ok(documents);
//    }

//    TODO: There is no owner coming with request
//    @PostMapping(value = "/upload")
//    public ResponseEntity<MessageResponse> uploadFile(
//            @ModelAttribute FileUploadRequest fileUploadRequest,
//            @AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
//        val fileId = fileService.uploadFile(userDetails.getId(), fileUploadRequest.getFile(), fileUploadRequest.getDocumentType());
//        return ResponseEntity.ok(MessageResponse.builder()
//                .message("File has been successfully uploaded")
//                .entityId(fileId)
//                .build());
//    }

    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> getFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
        val fileResource = fileService.downloadFile(fileId, userDetails);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .eTag(generateETag(fileResource))
                .lastModified(fileResource.lastModified())
                .body(fileResource);
    }

    private String generateETag(Resource resource) throws IOException {
        String md5Hex = DigestUtils.md5DigestAsHex(resource.getInputStream());
        return "\"" + md5Hex + "\"";
    }

}
