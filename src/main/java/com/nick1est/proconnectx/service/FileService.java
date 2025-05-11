package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.exception.FileStorageException;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.repository.FileRepository;
import com.nick1est.proconnectx.service.file.FileAccessStrategy;
import com.nick1est.proconnectx.service.file.FileOwnerStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class FileService {
    private final Map<OwnerType, FileOwnerStrategy> fileOwnerStrategies;
    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final Map<OwnerType, FileAccessStrategy> fileAccessStrategies;

    public List<File> uploadFiles(FileOwner owner, List<MultipartFile> files,
                                  DocumentType type, boolean isPublic) {
        return files.stream()
                .map(file -> uploadSingle(owner, file, type, isPublic))
                .toList();
    }

    public File uploadSingle(FileOwner owner, MultipartFile multipart,
                             DocumentType type, boolean isPublic) {
        try {
            val ownerType = owner.getOwnerType();
            val path = fileStorageService.uploadFile(multipart, owner.getId(), ownerType);
            val file = new File();
            file.setOriginalFileName(multipart.getOriginalFilename());
            file.setDocumentType(type);
            file.setPath(path.replace("\\","/"));
            file.setOwnerType(ownerType);
            file.setIsPublic(isPublic);

            val strategy = fileOwnerStrategies.get(ownerType);
            strategy.applyOwner(file, owner);

            return fileRepository.save(file);
        } catch (IOException e) {
            throw new FileStorageException("Failed to upload", e);
        }
    }

    public Resource downloadFile(Long fileId, UserDetailsImpl user) {
        File file = getById(fileId);

        if (user.hasRole(RoleType.ROLE_ADMIN)) {
            return fileStorageService.loadFileAsResource(file.getPath());
        }

        FileAccessStrategy strat = fileAccessStrategies.get(file.getOwnerType());
        if (strat == null || !strat.canAccess(file, user)) {
            throw new AccessDeniedException("You do not have permission to access this file");
        }

        return fileStorageService.loadFileAsResource(file.getPath());
    }


    public File getById(Long fileId) {
        return fileRepository.findById(fileId).orElseThrow(() -> new NotFoundException("error.file.not_found", fileId));
    }

    @Transactional
    public void deleteFileById(Long fileId) {
        File file = getById(fileId);

        fileStorageService.deleteFile(file.getPath());
        fileRepository.delete(file);
    }
}
