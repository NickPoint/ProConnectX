package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dto.employer.registration.FileResponseDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FileMapper {
    List<FileResponseDto> toDto(List<File> files);
}
