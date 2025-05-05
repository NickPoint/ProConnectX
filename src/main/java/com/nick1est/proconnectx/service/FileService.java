package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.DocumentType;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.OwnerType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.exception.FileStorageException;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.FileMapper;
import com.nick1est.proconnectx.repository.FileRepository;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FileMapper fileMapper;
    private final FileStorageService fileStorageService;
    private final PrincipalRepository principalRepository;
    private final MessageSource messageSource;

//    public List<FileDto> getOwnerFiles(Long ownerId) {
//        List<File> files = fileRepository.findAllByOwnerId(ownerId);
//        //TODO: Not all files should be returned, only the ones that are needed for the account type (employer or employee)
//        return fileMapper.toDtoList(files);
//    }

    @Transactional
    public List<File> uploadFiles(Long ownerId, List<MultipartFile> files, DocumentType documentType,
                                  OwnerType ownerType, Boolean isPublic) {
        val results = new ArrayList<File>();
        for (MultipartFile file : files) {
            results.add(uploadFile(ownerId, file, documentType, ownerType, isPublic));
        }
        return results;
    }

    @Transactional
    public File uploadFile(Long ownerId, MultipartFile file, DocumentType type, OwnerType ownerType, Boolean isPublic) {
        try {
            val path = fileStorageService.uploadFile(file, ownerId, ownerType);
            val fileEntity = new File();
            fileEntity.setOriginalFileName(file.getOriginalFilename());
            fileEntity.setDocumentType(type);
            fileEntity.setPath(path.replace("\\", "/"));
            if (OwnerType.FREELANCER.equals(ownerType)) {
                fileEntity.setFreelancerId(ownerId);
            } else if (OwnerType.CLIENT.equals(ownerType)) {
                fileEntity.setClientId(ownerId);
            } else if (OwnerType.SERVICE.equals(ownerType)) {
                fileEntity.setServiceId(ownerId);
            }
            fileEntity.setOwnerType(ownerType);
            if (isPublic) {
                fileEntity.setIsPublic(true);
            }

            return fileRepository.save(fileEntity);
        } catch (IOException e) {
            log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
            throw new FileStorageException("Could not upload file: " + file.getOriginalFilename(), e);
        }
    }

    public Resource downloadFile(Long fileId, UserDetailsImpl userDetails) {
        val file = getById(fileId);

        if (file.getIsPublic()) {
            return fileStorageService.loadFileAsResource(file.getPath());
        }

        val errorMessage = messageSource.getMessage("error.ownership.not_allowed", null, LocaleContextHolder.getLocale());
        if (userDetails == null) {
            throw new AccessDeniedException(errorMessage);
        }

        if (RoleType.ROLE_ADMIN.equals(userDetails.getActiveRole())) {
            return fileStorageService.loadFileAsResource(file.getPath());
        }

        if (file.getOwnerType().equals(OwnerType.FREELANCER)) {
            if (!userDetails.getActiveRole().equals(RoleType.ROLE_FREELANCER)
                    || !file.getFreelancerId().equals(userDetails.getFreelancer().getId())) {
                throw new AccessDeniedException(
                        errorMessage);
            }
        } else if (file.getOwnerType().equals(OwnerType.CLIENT)) {
            if (!userDetails.getActiveRole().equals(RoleType.ROLE_CLIENT)
                    || !file.getClientId().equals(userDetails.getClient().getId())) {
                throw new AccessDeniedException(
                        errorMessage);
            }
        }

        return fileStorageService.loadFileAsResource(file.getPath());
    }

    public File getById(Long fileId) {
        return fileRepository.findById(fileId).orElseThrow(() -> new NotFoundException("error.file.not_found", fileId));
    }

    @Transactional
    public void deleteFileById(Long fileId, UserDetailsImpl userDetails) {
        File file = getById(fileId);

        // Optional: Add access check logic here like in `downloadFile`
        fileStorageService.deleteFile(file.getPath());
        fileRepository.delete(file);
    }

    @Transactional
    public void updateAvatar(MultipartFile avatarFile, UserDetailsImpl userDetails) {
        Long freelancerId = userDetails.getFreelancer().getId();
        List<File> existingAvatars = fileRepository.findByFreelancerIdAndDocumentType(freelancerId, DocumentType.AVATAR);

        for (File oldAvatar : existingAvatars) {
            fileStorageService.deleteFile(oldAvatar.getPath());
            fileRepository.delete(oldAvatar);
        }

        uploadFile(freelancerId, avatarFile, DocumentType.AVATAR, OwnerType.FREELANCER, true);
    }
}
