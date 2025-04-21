package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

@Entity
@Getter
@Setter
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @OneToOne(cascade = CascadeType.PERSIST)
    @NotNull
    private Principal principal;

    @JoinColumn(nullable = false)
    @OneToOne
    private Address address;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String avatarUrl;

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    @NotNull
    private Double rating;

    @Column(nullable = false)
    @Range(min = 0)
    @NotNull
    private Integer ratingCount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private AccountStatus accountStatus;

    @PrePersist
    public void prePersist() {
        rating = 0.0;
        ratingCount = 0;
        if (accountStatus == null) {
            accountStatus = AccountStatus.UNVERIFIED;
        }
    }
}
