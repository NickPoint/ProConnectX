package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AddressDto {
    @NotEmpty
    private String street;
    @NotEmpty
    private String city;
    @NotEmpty
    private String region;
    @NotEmpty
    private String postalCode;
    @NotEmpty
    private String country;
    @NotEmpty
    private String houseNumber;
}
