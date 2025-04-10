package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.Range;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @NotNull
    @OneToOne
    private Address address;

    @Column
    private String description;

    @Column(nullable = false)
    @NotBlank
    private String firstName;

    @Column(nullable = false)
    @NotBlank
    private String lastName;

    @Column(nullable = false)
    @NotBlank
    private String phoneNumber;

    @Column
    private String profilePicture;

    @Range(min = 0, max = 5)
    private Double rating;

    @Range(min = 0)
    private Integer ratingCount;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "freelancer_categories",
            joinColumns = @JoinColumn(name = "freelancer_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private AccountStatus accountStatus;

    @OneToMany(mappedBy = "freelancer", fetch = FetchType.LAZY)
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
    public void prePersist() {
        this.accountStatus = AccountStatus.UNVERIFIED;
        this.registrationDate = OffsetDateTime.now();
    }
}
