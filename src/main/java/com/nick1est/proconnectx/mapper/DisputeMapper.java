package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Event;
import com.nick1est.proconnectx.dto.DisputeDto;
import com.nick1est.proconnectx.dto.EventDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DisputeMapper {
    DisputeDto toDto(Dispute dispute);
}
