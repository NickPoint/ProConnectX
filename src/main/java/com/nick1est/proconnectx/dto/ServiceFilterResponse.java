package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import lombok.Data;

@Data
public class ServiceFilterResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Double rating;
    private Integer ratingCount;
    private Double price;
    private FreelancerDto freelancer;
    private CategoryType category;
}
