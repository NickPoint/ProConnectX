package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClientDto {
    @NotNull
    private Long id;
    @NotNull
    private AddressDto address;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotNull
    private Double rating;
}
