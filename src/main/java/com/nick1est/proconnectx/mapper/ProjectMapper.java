package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ECategory;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dto.ProjectCreateDto;
import com.nick1est.proconnectx.dto.ProjectFilterResponse;
import com.nick1est.proconnectx.service.CategoryService;
import jdk.jfr.Name;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ProjectMapper {

    @Autowired
    protected CategoryService categoryService;

    public abstract Project projectCreateDtoToProject(ProjectCreateDto projectCreateDto);
    public abstract ProjectCreateDto projectToProjectCreateDto(Project project);

    @Mapping(target = "lastBid", source = "bids", qualifiedByName = "mapLastBid")
    @Mapping(target = "bidCount", source = "bids", qualifiedByName = "mapBidCount")
    public abstract ProjectFilterResponse projectToProjectFilterResponse(Project project);
    public abstract List<ProjectFilterResponse> projectsToProjectFilterResponse(List<Project> projects);

    public Category mapCategory(ECategory category) {
        return categoryService.findByName(category);
    }
    public ECategory mapCategory(Category category) {
        return category.getName();
    }
    public List<Category> mapCategories(List<ECategory> categories) {
        return categories.stream().map(this::mapCategory).collect(Collectors.toList());
    }

    @Named("mapBidCount")
    public Integer mapBidCount(List<Bid> bids) {
        return bids.size();
    }

    @Named("mapLastBid")
    public Integer mapLastBid(List<Bid> bids) {
        return bids.stream().map(Bid::getAmount).max(Integer::compareTo).orElse(0);
    }

}
