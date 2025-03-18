package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.ECategory;
import lombok.Data;

import java.util.List;

@Data
public class FreelancerFilter {
    private String firstName;
    private String lastName;
    private List<ECategory> categories;
    private String location;
    private Double rating;
}
