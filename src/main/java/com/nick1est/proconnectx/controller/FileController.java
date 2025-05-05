package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.service.FileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        val fileResource = fileService.downloadFile(fileId, userDetails);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                .body(fileResource);
    }

    @PostMapping("/avatar")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<?> updateAvatar(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                          @RequestPart("avatar") MultipartFile file) {
        fileService.updateAvatar(file, userDetails);
        return ResponseEntity.ok().build();
    }

}
