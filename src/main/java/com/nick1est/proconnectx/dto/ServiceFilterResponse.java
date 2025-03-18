package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.ECategory;
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
    private FreelancerMainInfo freelancer;
    private ECategory category;
}
