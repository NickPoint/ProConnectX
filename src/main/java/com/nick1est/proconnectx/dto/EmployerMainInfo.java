package com.nick1est.proconnectx.dto;

import lombok.Data;

@Data
public class EmployerMainInfo {
    private Long id;
    private String companyName;
    private String profilePicture;
    private Integer rating;
    private Integer ratingCount;
}
