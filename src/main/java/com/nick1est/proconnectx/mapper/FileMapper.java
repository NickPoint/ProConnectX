package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.DocumentType;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dto.employer.registration.FileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class FileMapper {
    @Value("${app.server.url}")
    private String serverUrl;


    public abstract List<FileDto> toDtoList(List<File> files);
    public abstract FileDto toDto(File file);

    public String mapFileToUrl(File file) {
        if (file == null) {
            return null;
        }
        return serverUrl + "files/" + file.getId();
    }

    public List<String> mapFileToUrl(List<File> files) {
        ArrayList<String> urls = new ArrayList<>();
        for (File file : files) {
            urls.add(mapFileToUrl(file));
        }
        return urls;
    }

    @Named("avatarImageMapper")
    public String mapAvatarFile(List<File> files) {
        if (files == null) {
            return null;
        }

        return files.stream()
                .filter(file -> DocumentType.AVATAR.equals(file.getDocumentType()))
                .findFirst()
                .map(this::mapFileToUrl)
                .orElse(null);
    }

    @Named("firstFileMapper")
    public String mapFirstFile(List<File> files) {
        if (files == null) {
            return null;
        }

        return files.stream()
                .findFirst()
                .map(this::mapFileToUrl)
                .orElse(null);
    }
}
