package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Range;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Service {
    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Freelancer freelancer;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column

    @Column(nullable = false)
    @OneToMany(mappedBy = "service")
    private List<Comment> comments;

    @JoinColumn(nullable = false)
    @Enumerated(EnumType.STRING)
    private CategoryType category;

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    private Double rating;

    @Column(nullable = false)
    @Range(min = 0)
    private Integer ratingCount;

    @Column(nullable = false)
    private OffsetDateTime postedAt;

    @PrePersist
    private void prePersist() {
        postedAt = OffsetDateTime.now();
    }
}
