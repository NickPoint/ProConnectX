package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.OwnerType;
import com.nick1est.proconnectx.exception.FileStorageException;
import lombok.val;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${upload.dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, Long ownerId, OwnerType ownerType) throws IOException {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String safeFileName = UUID.randomUUID() + "." + extension;

        val dir = generateFilePath(ownerId, ownerType);
        Files.createDirectories(dir);

        Path filePath = dir.resolve(safeFileName);
        file.transferTo(filePath);
        return filePath.toString();
    }

    public void deleteFile(String path) {
        try {
            Path filePath = Path.of(path).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + path, e);
        }
    }


    public Resource loadFileAsResource(String path) {
        try {
            Path filePath = Path.of(path).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found: " + path);
            }
        } catch (MalformedURLException | FileNotFoundException ex) {
            throw new RuntimeException("File not found", ex);
        }
    }

    private Path generateFilePath(Long ownerId, OwnerType ownerType) {
        return switch (ownerType) {
            case SERVICE -> Paths.get(uploadDir, "service", ownerId.toString());
            case FREELANCER -> Paths.get(uploadDir, "freelancer", ownerId.toString());
            case CLIENT -> Paths.get(uploadDir, "client", ownerId.toString());
            case ORDER -> Paths.get(uploadDir, "order", ownerId.toString());
            default -> Paths.get(uploadDir, "undefined", ownerId.toString());
        };
    }
}
