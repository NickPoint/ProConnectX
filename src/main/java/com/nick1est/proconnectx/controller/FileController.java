package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.MessageResponse;
import com.nick1est.proconnectx.dto.employer.registration.FileResponseDto;
import com.nick1est.proconnectx.dto.employer.registration.FileUploadRequest;
import com.nick1est.proconnectx.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping
    public ResponseEntity<List<FileResponseDto>> getPrincipalFiles(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<FileResponseDto> documents = fileService.getUserFiles(userDetails);
        return ResponseEntity.ok(documents);
    }

    @PostMapping(value = "/upload")
    public ResponseEntity<MessageResponse> uploadFile(
            @ModelAttribute FileUploadRequest fileUploadRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
        val fileId = fileService.uploadFile(userDetails.getId(), fileUploadRequest.getFile(), fileUploadRequest.getDocumentType());
        return ResponseEntity.ok(MessageResponse.builder()
                .message("File has been successfully uploaded")
                .entityId(fileId)
                .build());
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
        val fileResource = fileService.downloadFile(fileId, userDetails);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                .body(fileResource);
    }

}
