package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.service.FileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "File")
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

//    @GetMapping
//    public ResponseEntity<List<FileResponseDto>> getPrincipalFiles(
//            @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        List<FileResponseDto> documents = fileService.getOwnerFiles(userDetails);
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

//    @GetMapping("/download/{fileId}")
//    public ResponseEntity<Resource> downloadFile(
//            @PathVariable Long fileId,
//            @AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
//        val fileResource = fileService.downloadFile(fileId, userDetails);
//        return ResponseEntity.ok()
//                .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
//                .body(fileResource);
//    }

}
