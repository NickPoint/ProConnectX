package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class BaseProfile implements Profile, FileOwner, Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @JoinColumn(nullable = false)
    @ManyToOne(cascade = CascadeType.PERSIST)
    @NotNull
    protected User user;

    @JoinColumn
    @OneToOne(cascade = CascadeType.PERSIST)
    protected Address address;

    protected String firstName;
    protected String lastName;
    protected String phoneNumber;

    @Column(precision = 3, scale = 1, nullable = false)
    @NotNull
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false)
    @NotNull
    protected BigDecimal ratingSum = BigDecimal.ZERO;

    @Column(nullable = false)
    @NotNull
    protected Long ratingCount = 0L;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    protected ProfileStatus profileStatus = ProfileStatus.UNVERIFIED;

    @Column
    protected String rejectionReason;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    protected Instant registrationDate;

    @Column
    private Instant activationDate;

    @Override
    public String getEmail() {
        return user.getEmail();
    }
}