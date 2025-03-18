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
public class Project {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    @NotBlank
    @NotNull
    private String description;

    private String shortDescription;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Employer employer;

    @ManyToOne
    private Freelancer freelancer;

    private Double budget;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "project_categories",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Column(nullable = false)
    private String location;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project")
    private List<Bid> bids;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private ProjectType projectType;

    private Double minSatisfyingBid;

    private Double bidStep;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime datePosted;

    private OffsetDateTime dueDate;

    @PrePersist
    public void prePersist() {
        status = ProjectStatus.OPEN;
        datePosted = OffsetDateTime.now();
    }

}
