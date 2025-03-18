package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {

    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Project project;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Freelancer bidder;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BidStatus status;

    @Lob
    private String coverLetter;

    private String shortCoverLetter;

    @Column(nullable = false)
    private OffsetDateTime datePosted;
    private OffsetDateTime dateSubmitted;
    private LocalDate dueDate;

    @PrePersist
    public void prePersist() {
        status = BidStatus.NEW;
        datePosted = OffsetDateTime.now();
    }

}
