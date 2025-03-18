package com.nick1est.proconnectx.dto;

import lombok.Data;

@Data
public class FreelancerMainInfo {
    private Long id;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private Integer rating;
    private Integer ratingCount;
}
