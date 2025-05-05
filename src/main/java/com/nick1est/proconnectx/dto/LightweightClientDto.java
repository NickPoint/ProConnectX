package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LightweightClientDto {
    @NotNull
    private Long id;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotNull
    private Double rating;
    @NotNull
    private Integer ratingCount;
    @NotNull
    private String email;
    @NotNull
    private String phoneNumber;
    private String avatarImageUrl;
}
