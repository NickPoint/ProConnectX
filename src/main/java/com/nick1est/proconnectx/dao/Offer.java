package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import org.checkerframework.common.value.qual.IntRange;

import java.util.List;

@Entity
public class Offer {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    @OneToMany(mappedBy = "offer")
    private List<Comment> comments;

    private String location;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Category category;

    @IntRange(from = 0, to = 5)
    private Integer rating;

}
