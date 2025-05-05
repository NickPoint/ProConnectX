package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ServiceAddressDto {
    private String street;
    @NotEmpty
    private String city;
    @NotEmpty
    private String region;
    private String postalCode;
    @NotEmpty
    private String country;
    private String houseNumber;
}
