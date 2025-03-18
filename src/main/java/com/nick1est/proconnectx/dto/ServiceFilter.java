package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ECategory;
import lombok.Data;
import org.springframework.data.domain.Range;

import java.util.List;

@Data
public class ServiceFilter {
    private String title;
    private List<ECategory> categories;
    private String location;
    private Double rating;
    private Double minBudget;
    private Double maxBudget;
}
