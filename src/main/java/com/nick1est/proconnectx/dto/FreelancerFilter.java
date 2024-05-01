package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Category;
import lombok.Data;

import java.util.List;

@Data
public class FreelancerFilter {
    private List<Category> categories;
    private String location;
    private Double rating;
}
