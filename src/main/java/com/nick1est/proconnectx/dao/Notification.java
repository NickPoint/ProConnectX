package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn
    @ManyToOne
    private Freelancer freelancer;

    @JoinColumn
    @ManyToOne
    private Employer employer;

    @JoinColumn
    @ManyToOne
    private Client client;

    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private NotificationStatus status;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime createdAt;

    @PrePersist
    private void prePersist() {
        createdAt = OffsetDateTime.now();
    }

}
