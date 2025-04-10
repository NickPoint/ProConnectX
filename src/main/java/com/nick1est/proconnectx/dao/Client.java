package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.checkerframework.common.value.qual.IntRange;
import org.hibernate.validator.constraints.Range;

@Entity
@Getter
@Setter
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @OneToOne
    private Principal principal;

    @JoinColumn(nullable = false)
    @OneToOne
    private Address address;

    @Column(nullable = false)
    @NotEmpty
    private String firstName;

    @Column(nullable = false)
    @NotEmpty
    private String lastName;

    @Range(min = 0, max = 5)
    private Double rating;
}
