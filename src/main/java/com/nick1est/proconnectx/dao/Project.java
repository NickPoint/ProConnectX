package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
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
    private String description;

    @Column(nullable = false)
    private String shortDescription;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Client owner;

    @OneToOne
    private Client freelancer;

    private Integer budget;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Category category;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Column(nullable = false)
    private String location;

    @OneToMany(mappedBy = "project")
    private List<Bid> bids;

    @Column(nullable = false)
    private OffsetDateTime datePosted;

    private OffsetDateTime dueDate;

}
