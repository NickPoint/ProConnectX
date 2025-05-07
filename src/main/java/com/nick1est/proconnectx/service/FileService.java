package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.exception.FileStorageException;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.FileMapper;
import com.nick1est.proconnectx.repository.FileRepository;
import com.nick1est.proconnectx.repository.OrderRepository;
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
    private final OrderRepository orderRepository;

//    public List<FileDto> getOwnerFiles(Long ownerId) {
//        List<File> files = fileRepository.findAllByOwnerId(ownerId);
//        //TODO: Not all files should be returned, only the ones that are needed for the account type (employer or employee)
//        return fileMapper.toDtoList(files);
//    }

    @Transactional
    public List<File> uploadFiles(FileOwner owner, List<MultipartFile> files, DocumentType documentType,
                                  OwnerType ownerType, Boolean isPublic) {
        val results = new ArrayList<File>();
        for (MultipartFile file : files) {
            results.add(uploadFile(owner, file, documentType, ownerType, isPublic));
        }
        return results;
    }

    @Transactional
    public File uploadFile(FileOwner owner, MultipartFile file, DocumentType type, OwnerType ownerType, Boolean isPublic) {
        try {
            val path = fileStorageService.uploadFile(file, owner.getId(), ownerType);
            val fileEntity = new File();
            fileEntity.setOriginalFileName(file.getOriginalFilename());
            fileEntity.setDocumentType(type);
            fileEntity.setPath(path.replace("\\", "/"));
            fileEntity.setOwnerType(ownerType);
            if (owner instanceof Freelancer freelancer) {
                fileEntity.setFreelancer(freelancer);
            } else if (owner instanceof Client client) {
                fileEntity.setClient(client);
            } else if (owner instanceof com.nick1est.proconnectx.dao.Service service) {
                fileEntity.setService(service);
            } else if (owner instanceof Order order) {
                fileEntity.setOrder(order);
            }
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

        if (OwnerType.ORDER.equals(file.getOwnerType())) {
            if (userDetails.getActiveRole().equals(RoleType.ROLE_FREELANCER)) {
                val exists = orderRepository.existsByIdAndFreelancer(file.getOrder().getId(), userDetails.getFreelancer());
                if (!exists) {
                    throw new AccessDeniedException(errorMessage);
                }
            } else if (userDetails.getActiveRole().equals(RoleType.ROLE_CLIENT)) {
                val exists = orderRepository.existsByIdAndClient(file.getOrder().getId(), userDetails.getClient());
                if (!exists) {
                    throw new AccessDeniedException(errorMessage);
                }
            }
        }

        if (file.getOwnerType().equals(OwnerType.FREELANCER)) {
            if (!userDetails.getActiveRole().equals(RoleType.ROLE_FREELANCER)
                    || !file.getFreelancer().equals(userDetails.getFreelancer())) {
                throw new AccessDeniedException(errorMessage);
            }
        } else if (file.getOwnerType().equals(OwnerType.CLIENT)) {
            if (!userDetails.getActiveRole().equals(RoleType.ROLE_CLIENT)
                    || !file.getClient().equals(userDetails.getClient())) {
                throw new AccessDeniedException(errorMessage);
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
        Freelancer freelancer = userDetails.getFreelancer();
        List<File> existingAvatars = fileRepository.findByFreelancerAndDocumentType(freelancer, DocumentType.AVATAR);

        for (File oldAvatar : existingAvatars) {
            fileStorageService.deleteFile(oldAvatar.getPath());
            fileRepository.delete(oldAvatar);
        }

        uploadFile(freelancer, avatarFile, DocumentType.AVATAR, OwnerType.FREELANCER, true);
    }
}
