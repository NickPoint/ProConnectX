package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ECategory;
import com.nick1est.proconnectx.dao.ProjectType;
import lombok.Data;
import org.springframework.data.domain.Range;

import java.util.List;

@Data
public class ProjectFilter {
    private String title;
    private List<ECategory> categories;
    private String location;
    private Double minBudget;
    private Double maxBudget;
    private ProjectType type;
}
