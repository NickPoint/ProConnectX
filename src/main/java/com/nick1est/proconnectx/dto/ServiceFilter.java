package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import lombok.Data;

import java.util.List;

@Data
public class ServiceFilter {
    private String title;
    private List<CategoryType> categories;
    private String location;
    private Double rating;
    private Double minBudget;
    private Double maxBudget;
}
