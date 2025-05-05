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
    private Order order;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DisputeStatus status = DisputeStatus.OPEN;

    @Column(nullable = false)
    @NotEmpty
    @Lob
    private String reason;

    @Column
    @Lob
    private String proposal;

    @Column
    @Lob
    private String proposalRejectionReason;

    @Column
    @Enumerated(EnumType.STRING)
    private ProposalStatus proposalStatus = ProposalStatus.NONE;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    @NotNull
    private Instant updatedAt;
}
