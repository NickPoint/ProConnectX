package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
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
    @OneToOne(cascade = CascadeType.PERSIST)
    @NotNull
    private Principal principal;

    @JoinColumn
    @OneToOne
    private Address address;

    @Column
    private String description;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String phoneNumber;

    @Column
    private String avatarUrl;

    @Range(min = 0, max = 5)
    @NotNull
    private Double rating;

    @Range(min = 0)
    @NotNull
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

    @OneToMany(mappedBy = "ownerId", fetch = FetchType.LAZY)
    private List<File> files;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime registrationDate;

    @Column
    private OffsetDateTime activationDate;

    @PrePersist
    public void prePersist() {
        if (accountStatus == null) {
            accountStatus = AccountStatus.UNVERIFIED;
        }
        this.rating = 0.0;
        this.ratingCount = 0;
        this.registrationDate = OffsetDateTime.now();
    }
}
