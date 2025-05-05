package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FreelancerDto {
    @NotNull
    private Long id;
    @NotNull
    private AddressDto address;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String email;
    @NotNull
    private Double rating;
    @NotNull
    private Integer ratingCount;
    private String avatarImageUrl;
}
