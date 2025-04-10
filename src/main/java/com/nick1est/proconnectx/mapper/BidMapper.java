package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dto.BidDto;
import com.nick1est.proconnectx.dto.BidRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BidMapper {
    List<BidDto> toBidCardDto(List<Bid> bid);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "freelancer", source = "freelancer")
    @Mapping(target = "project", source = "project")
    Bid toDao(BidRequest bidRequest, Freelancer freelancer, Project project);
}
