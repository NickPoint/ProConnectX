package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.DocumentType;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dto.employer.registration.FileResponseDto;
import com.nick1est.proconnectx.mapper.FileMapper;
import com.nick1est.proconnectx.repository.FileRepository;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FileMapper fileMapper;
    private final FileStorageService fileStorageService;
    private final PrincipalRepository principalRepository;

    public List<FileResponseDto> getUserFiles(UserDetailsImpl userDetails) {
        val principal = principalRepository.getReferenceById(userDetails.getId());
        List<File> files = fileRepository.findAllByPrincipal(principal);
        //TODO: Not all files should be returned, only the ones that are needed for the account type (employer or employee)
        return fileMapper.toDto(files);
    }

    public Long uploadFile(Long principalId, MultipartFile file, DocumentType type) throws IOException {
        val fileEntity = new File();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setType(file.getContentType());
        fileEntity.setDocumentType(type);

        val path = fileStorageService.uploadFile(file);
        fileEntity.setPath(path);

        val principal = principalRepository.getReferenceById(principalId);
        fileEntity.setPrincipal(principal);

        return fileRepository.save(fileEntity).getId();
    }

    public Resource downloadFile(Long fileId, UserDetailsImpl userDetails) throws IOException {
        val file = fileRepository.findById(fileId).orElseThrow(() -> new EntityNotFoundException("File not found"));
        if (!file.getPrincipal().getId().equals(userDetails.getId())) {
            throw new AccessDeniedException("You are not authorized to download this file.");
        }
        return fileStorageService.loadFileAsResource(file.getPath());
    }

}
