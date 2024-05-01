package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import org.checkerframework.common.value.qual.IntRange;

@Entity
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Client client;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Offer offer;

    private String comment;

    @IntRange(from = 0, to = 5)
    private Integer rating;
}
