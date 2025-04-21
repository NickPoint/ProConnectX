package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.DocumentType;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.OwnerType;
import com.nick1est.proconnectx.dto.employer.registration.FileResponseDto;
import com.nick1est.proconnectx.exception.FileStorageException;
import com.nick1est.proconnectx.mapper.FileMapper;
import com.nick1est.proconnectx.repository.FileRepository;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FileMapper fileMapper;
    private final FileStorageService fileStorageService;
    private final PrincipalRepository principalRepository;

    public List<FileResponseDto> getOwnerFiles(Long ownerId) {
        List<File> files = fileRepository.findAllByOwnerId(ownerId);
        //TODO: Not all files should be returned, only the ones that are needed for the account type (employer or employee)
        return fileMapper.toDtoList(files);
    }

    @Transactional
    public void uploadFiles(Long ownerId, List<MultipartFile> files, DocumentType documentType, OwnerType ownerType) {
        for (MultipartFile file : files) {
            uploadFile(ownerId, file, documentType, ownerType);
        }
    }

    @Transactional
    public Long uploadFile(Long ownerId, MultipartFile file, DocumentType type, OwnerType ownerType) {
        try {
            val path = fileStorageService.uploadFile(file, ownerId, ownerType);
            val fileEntity = new File();
            fileEntity.setOriginalFileName(file.getOriginalFilename());
            fileEntity.setDocumentType(type);
            fileEntity.setPath(path);
            fileEntity.setOwnerId(ownerId);
            fileEntity.setOwnerType(ownerType);

            return fileRepository.save(fileEntity).getId();
        } catch (IOException e) {
            log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
            throw new FileStorageException("Could not upload file: " + file.getOriginalFilename(), e);
        }
    }

    public Resource downloadFile(Long fileId, Long ownerId) throws IOException {
        val file = fileRepository.findByIdAndOwnerId(fileId, ownerId).orElseThrow(() -> new EntityNotFoundException("File not found"));
        return fileStorageService.loadFileAsResource(file.getPath());
    }

}
