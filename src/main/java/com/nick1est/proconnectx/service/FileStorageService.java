package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.OwnerType;
import lombok.val;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Transactional
    public String uploadFile(MultipartFile file, Long ownerId, OwnerType ownerType) throws IOException {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String safeFileName = UUID.randomUUID() + "." + extension;

        val dir = generateFilePath(ownerId, ownerType);
        Files.createDirectories(dir);

        Path filePath = dir.resolve(safeFileName);
        file.transferTo(filePath);
        return filePath.toString();
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
            case SERVICE -> Paths.get("uploads", "service", ownerId.toString());
            default -> Paths.get("uploads", "undefined", ownerId.toString());
        };
    }

}
