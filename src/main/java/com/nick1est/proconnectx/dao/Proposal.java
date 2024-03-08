package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Proposal {

    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Project project;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Freelancer freelancer;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProposalStatus proposalStatus;

    private String description;

    @Column(nullable = false)
    private OffsetDateTime datePosted;
    private OffsetDateTime dateSubmitted;

}
