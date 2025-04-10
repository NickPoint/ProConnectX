package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn
    @OneToOne
    private Bid acceptedBid;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> events;

    @JoinColumn
    @ManyToOne
    private Service service;

    @JoinColumn
    @ManyToOne
    private Client client;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderType type;

    @Column
    @Lob
    private String additionalNotes;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime completedAt;

    @OneToMany
    private List<Transaction> transaction;

    @PrePersist
    public void prePersist() {
        status = OrderStatus.CREATED;
        createdAt = OffsetDateTime.now();
    }
}
