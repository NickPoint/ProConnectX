package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dto.DisputeDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DisputeMapper {
    DisputeDto toDto(Dispute dispute);
}
