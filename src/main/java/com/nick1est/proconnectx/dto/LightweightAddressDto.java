package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LightweightAddressDto {
    @NotEmpty
    private String city;
    @NotEmpty
    private String postalCode;
    @NotEmpty
    private String country;
}
