/*
package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

import java.time.Instant;
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
    private ProfileStatus profileStatus;

    @OneToMany(mappedBy = "ownerId", cascade = CascadeType.ALL)
    private List<File> files;

    @JoinColumn(nullable = false)
    @OneToOne
    @NotNull
    private User user;

    @Column(nullable = false)
    @NotNull
    private Instant registrationDate;

    @Column(nullable = false)
    private Instant activationDate;

    @PrePersist
    private void prePersist() {
        this.profileStatus = ProfileStatus.UNVERIFIED;
        this.registrationDate = Instant.now();
        this.ratingSum = 0.0;
        this.ratingCount = 0;
    }
}
*/
