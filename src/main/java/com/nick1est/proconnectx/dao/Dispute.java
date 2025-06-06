package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    @NotNull
    private Order order;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private DisputeStatus status = DisputeStatus.OPEN;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotEmpty
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String proposal;

    @Column(columnDefinition = "TEXT")
    private String proposalRejectionReason;

    @Column
    @Enumerated(EnumType.STRING)
    private ProposalStatus proposalStatus;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    @NotNull
    private Instant updatedAt;
}
