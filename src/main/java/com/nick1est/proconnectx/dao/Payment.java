package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@RequiredArgsConstructor
public class Payment {

    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    private Bid bid;
    private Integer amount;
    @Enumerated(EnumType.STRING)
    private ProjectStatus projectStatus;
    private OffsetDateTime dateDue;
    private OffsetDateTime datePaid;

}
