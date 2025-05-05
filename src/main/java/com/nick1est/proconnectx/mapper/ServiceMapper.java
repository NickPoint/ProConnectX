package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.Service;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.dto.employer.registration.FileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ReviewMapper.class, CategoryMapper.class, FileMapper.class, AddressMapper.class, FreelancerMapper.class})
public abstract class ServiceMapper {

    @Autowired
    private FileMapper fileMapper;

    public abstract Service toDao(ServiceCreateDto serviceCreateDto, List<WorkflowStep> workflow, List<Faq> faqs);

    public abstract List<LightweightServiceDto> toDtoList(List<Service> services);

    @Mapping(target = "thumbnailUrl", source = "service.gallery", qualifiedByName = "firstFileMapper")
    public abstract LightweightServiceDto toLightDto(Service service);

    @Mapping(target = "galleryUrls", source = "gallery")
    public abstract ServiceDto toDto(Service service);
}
