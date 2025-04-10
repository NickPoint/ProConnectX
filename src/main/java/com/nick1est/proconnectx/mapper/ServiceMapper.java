package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Service;
import com.nick1est.proconnectx.dto.ServiceCreateDto;
import com.nick1est.proconnectx.dto.ServiceDto;
import com.nick1est.proconnectx.dto.ServiceFilterResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ServiceMapper extends CommonMapper {

    public abstract Service serviceCreateDtoToService(ServiceCreateDto serviceCreateDto);

    public abstract List<ServiceFilterResponse> servicesToServiceFilterResponses(List<Service> services);

    public abstract ServiceDto toServiceDto(Service service);
}
