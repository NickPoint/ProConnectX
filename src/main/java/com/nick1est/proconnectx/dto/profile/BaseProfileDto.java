package com.nick1est.proconnectx.dto.profile;

import com.nick1est.proconnectx.dto.AddressDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BaseProfileDto {
    @NotNull
    private Long id;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String email;
    @NotNull
    private BigDecimal rating;
    @NotNull
    private Long ratingCount;
    private String avatarImageUrl;
}
