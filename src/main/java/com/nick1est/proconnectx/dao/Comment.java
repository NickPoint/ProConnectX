package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import org.checkerframework.common.value.qual.IntRange;

@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn
    @ManyToOne
    private Freelancer freelancer;

    @JoinColumn
    @ManyToOne
    private Client client;

    @JoinColumn
    @ManyToOne
    private Service service;

    @JoinColumn
    @ManyToOne
    private Employer employer;

    @Column
    @Lob
    private String body;
}
