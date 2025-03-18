package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Range;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "services")
public class ServiceDao {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer price;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Freelancer freelancer;

    @Column(nullable = false)
    @OneToMany(mappedBy = "service")
    private List<Comment> comments;

    private String location;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Category category;

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    private Double rating;

    @Column(nullable = false)
    @Range(min = 0)
    private Integer ratingCount;

    @Column(nullable = false)
    private OffsetDateTime datePosted;

    @PrePersist
    private void prePersist() {
        datePosted = OffsetDateTime.now();
    }

}
