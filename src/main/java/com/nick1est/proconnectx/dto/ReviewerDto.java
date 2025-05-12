package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.ProfileType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Value;


@Value
public class ReviewerDto {
    @NotNull
    Long id;
    @NotBlank
    String firstName;
    String lastName;
    @NotNull
    Double rating;
    @NotNull
    ProfileType profileType;
    String avatarImageUrl;

}
