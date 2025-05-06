package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Review {
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

/*    @JoinColumn
    @ManyToOne
    private Employer employer;*/

    @Column
    @Lob
    private String body;

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    @NotNull
    private Double rating;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant createdAt;
}
