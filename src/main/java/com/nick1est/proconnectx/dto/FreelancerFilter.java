package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import lombok.Data;

import java.util.List;

@Data
public class FreelancerFilter {
    private String firstName;
    private String lastName;
    private List<CategoryType> categories;
    private String country;
    private String city;
    private Double rating;
}
