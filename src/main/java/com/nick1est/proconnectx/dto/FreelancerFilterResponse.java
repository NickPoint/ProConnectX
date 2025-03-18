package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ECategory;
import lombok.Data;

import java.util.List;

@Data
public class FreelancerFilterResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String description;
    private List<ECategory> categories;
    private String location;
    private Double rating;
    private Integer ratingCount;
}
