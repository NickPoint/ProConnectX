package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn
    @ManyToOne
    private Order order;

    @JoinColumn
    @ManyToOne
    private Employer employer;

    @JoinColumn
    @ManyToOne
    private Freelancer freelancer;

    @JoinColumn
    @ManyToOne
    private Client client;

    @Column(nullable = false)
    private Double amount;

    @Column
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = OffsetDateTime.now();
    }
}
