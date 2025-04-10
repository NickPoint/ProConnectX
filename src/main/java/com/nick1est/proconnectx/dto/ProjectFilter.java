package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.dao.ProjectType;
import lombok.Data;

import java.util.List;

@Data
public class ProjectFilter {
    private String title;
    private List<CategoryType> categories;
    private String location;
    private Double minBudget;
    private Double maxBudget;
    private ProjectType type;
}
