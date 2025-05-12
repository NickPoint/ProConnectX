package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @NotNull
    @ManyToOne
    private Order order;

    @JoinColumn
    @ManyToOne
    private Dispute dispute;

    @Column(nullable = false)
    @NotBlank
    private String type;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant createdAt;
}
