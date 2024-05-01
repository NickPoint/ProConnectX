package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.*;

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
    private Client freelancer;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BidStatus bidStatus;

    private String description;

    @Column(nullable = false)
    private OffsetDateTime datePosted;
    private OffsetDateTime dateSubmitted;

}
