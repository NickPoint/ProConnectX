package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Employer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @NotNull
    @OneToOne
    private Address address;

    @Column
    @NotBlank
    private String companyName;

    @Column
    @NotBlank
    private String description;

    @Column
    @NotBlank
    private String registrationCode;

    @Column(nullable = false)
    @Email
    @NotBlank
    private String email;

    @Column(nullable = false)
    @NotBlank
    private String phoneNumber;

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

    @OneToMany(mappedBy = "ownerId", cascade = CascadeType.ALL)
    private List<File> files;

    @JoinColumn(nullable = false)
    @OneToOne
    @NotNull
    private Principal principal;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime registrationDate;

    @Column(nullable = false)
    private OffsetDateTime activationDate;

    @PrePersist
    private void prePersist() {
        this.accountStatus = AccountStatus.UNVERIFIED;
        this.registrationDate = OffsetDateTime.now();
        this.rating = 0.0;
        this.ratingCount = 0;
    }
}
