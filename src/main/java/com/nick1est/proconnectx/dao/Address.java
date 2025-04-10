package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String country;

    @Column(nullable = false)
    @NotBlank
    private String city;

    @Column(nullable = false)
    @NotBlank
    private String street;

    @Column(nullable = false)
    @NotBlank
    private String postalCode;

    @Column(nullable = false)
    @NotBlank
    private String houseNumber;

    @Column(nullable = false)
    @NotBlank
    private String region;
}
