package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@RequiredArgsConstructor
@Getter
@ToString
public class Project {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Client owner;

    @OneToOne
    private Freelancer freelancer;

    private Integer budget;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Field field;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProjectStatus projectStatus;

    @Column(nullable = false)
    private String location;

    @OneToMany(mappedBy = "project")
    private List<Proposal> proposals;

    @Column(nullable = false)
    private OffsetDateTime datePosted;

    private OffsetDateTime dateDue;

}
