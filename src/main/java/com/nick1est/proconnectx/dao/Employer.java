package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
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
    private String companyName;

    @Column
    private String firstName;

    @Column
    String lastName;

    @Column
    private String description;

    @Column
    private String registrationCode;

    @Column(nullable = false)
    @Email
    @NonNull
    private String email;

    @Column(nullable = false)
    @NotBlank
    private String phoneNumber;

    @Column
    private String profilePicture;

    @Range(min = 0, max = 5)
    private Double rating;

    @Range(min = 0)
    private Integer ratingCount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private AccountStatus accountStatus;

    @OneToMany(mappedBy = "employer", fetch = FetchType.LAZY)
    private List<Document> documents;

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
    }
}
