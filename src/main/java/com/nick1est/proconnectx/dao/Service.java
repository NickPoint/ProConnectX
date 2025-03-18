package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    @NotNull
    private String title;

    @Column(nullable = false)
    @NotBlank
    @NotNull
    private String description;

    private String shortDescription;

    @OneToOne
    private Freelancer freelancer;

    @NotNull
    private Double price;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "service_categories",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @Column
    private String location;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private ServiceType serviceType;

    private Double minSatisfyingBid;

    private Double bidStep;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime datePosted;

    @PrePersist
    public void prePersist() {
        datePosted = OffsetDateTime.now();
    }

}
