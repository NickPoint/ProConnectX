package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Event;
import com.nick1est.proconnectx.dto.EventDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EventMapper {
    @Mapping(target = "disputeId", source = "event.dispute.id")
    public EventDto toDto(Event event);
    public List<EventDto> toDto(List<Event> events);
}
