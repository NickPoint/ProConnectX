package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.CategoryType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class FreelancerFilterResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String description;
    private List<CategoryType> categories;
    private AddressDto addressDto;
    private BigDecimal rating;
    private Long ratingCount;
}
