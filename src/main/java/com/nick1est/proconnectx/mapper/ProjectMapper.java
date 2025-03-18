package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.BidStatus;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dto.ProjectCreateDto;
import com.nick1est.proconnectx.dto.ProjectOwnerDto;
import com.nick1est.proconnectx.dto.ProjectPublicDto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ProjectMapper extends CommonMapper {

    public abstract Project projectCreateDtoToProject(ProjectCreateDto projectCreateDto);

    @IterableMapping(qualifiedByName = "projectToProjectPublicDto")
    public abstract List<ProjectPublicDto> projectsToProjectPublicDtos(List<Project> projects);

    @Named("projectToProjectPublicDto")
    @Mapping(target = "maxBid", source = "bids", qualifiedByName = "mapLastBid")
    @Mapping(target = "bidCount", source = "bids", qualifiedByName = "mapBidCount")
    public abstract ProjectPublicDto projectToProjectPublicDto(Project project);

    @Mapping(target = "maxBid", source = "bids", qualifiedByName = "mapLastBid")
    @Mapping(target = "bidCount", source = "bids", qualifiedByName = "mapBidCount")
    public abstract ProjectOwnerDto projectToProjectOwnerDto(Project projects);

    @Named("mapBidCount")
    public Integer mapBidCount(List<Bid> bids) {
        return bids.size();
    }

    @Named("mapLastBid")
    public Double mapMaxBid(List<Bid> bids) {
        return bids.stream().filter(bid -> !bid.getStatus().equals(BidStatus.DECLINED))
                .map(Bid::getAmount).max(Double::compareTo).orElse(null);
    }

}
