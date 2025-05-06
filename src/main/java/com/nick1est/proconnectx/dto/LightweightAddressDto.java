package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LightweightAddressDto {
    @NotBlank
    private String city;
    @NotBlank
    private String postalCode;
    @NotBlank
    private String country;
}
