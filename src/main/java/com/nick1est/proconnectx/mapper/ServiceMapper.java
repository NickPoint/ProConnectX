package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.Service;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.dto.employer.registration.FileResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ReviewMapper.class, CategoryMapper.class, FileMapper.class})
public abstract class ServiceMapper {

    @Autowired
    private FileMapper fileMapper;

    public abstract Service toDao(ServiceCreateDto serviceCreateDto, List<WorkflowStep> workflow, List<Faq> faqs);

    public abstract List<LightweightServiceDto> toDtoList(List<Service> services);

    // This method maps the first image from the list
    protected FileResponseDto mapFirstImage(List<File> images) {
        return (images != null && !images.isEmpty()) ? fileMapper.toDto(images.get(0)) : null;
    }

    // Use the helper method for the thumbnailMeta mapping
    @Mapping(target = "thumbnailMeta", source = "imagesMeta")
    public abstract LightweightServiceDto toLightDto(Service service);
    public abstract FullServiceDto toDto(Service service);
}
