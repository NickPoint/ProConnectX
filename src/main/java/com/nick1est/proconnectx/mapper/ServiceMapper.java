package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Service;
import com.nick1est.proconnectx.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ReviewMapper.class, CategoryMapper.class, FileMapper.class, AddressMapper.class, FreelancerMapperGeneric.class})
public abstract class ServiceMapper {

    public abstract Service toDao(ServiceCreateDto serviceCreateDto, List<WorkflowStep> workflow, List<Faq> faqs);

    public abstract List<LightweightServiceDto> toDtoList(List<Service> services);

    @Mapping(target = "thumbnailUrl", source = "service.files", qualifiedByName = "firstFileMapper")
    public abstract LightweightServiceDto toLightDto(Service service);

    @Mapping(target = "galleryUrls", source = "files")
    public abstract ServiceDto toDto(Service service);
}
