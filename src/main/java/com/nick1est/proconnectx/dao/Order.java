package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "orders")
@Getter
@Setter
public class Order implements FileOwner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

/*    @JoinColumn
    @OneToOne
    private Bid acceptedBid;*/

    @OneToMany(mappedBy = "order", cascade = CascadeType.PERSIST)
    private List<Event> events;

    @OneToOne(mappedBy = "order", cascade = CascadeType.PERSIST)
    @NotNull
    private Transaction transaction;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> files = new ArrayList<>();

    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    private Service service;

    @JoinColumn(nullable = false)
    @ManyToOne
    @NotNull
    private Client client;

    @JoinColumn(nullable = false)
    @ManyToOne
    @NotNull
    private Freelancer freelancer;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private OrderStatus status =  OrderStatus.CREATED;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private OrderType type;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant createdAt;

    @Column
    private LocalDate deadlineDate;

    @LastModifiedDate
    @Column(nullable = false)
    @NotNull
    private Instant updatedAt;

    @Override
    public OwnerType getOwnerType() {
        return OwnerType.ORDER;
    }
}
