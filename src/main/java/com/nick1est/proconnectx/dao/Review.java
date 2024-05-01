package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@RequiredArgsConstructor
public class Review {

    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Client client;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Project projectId;

    private String review;

    private Integer rating;

    private OffsetDateTime datePosted;
}
