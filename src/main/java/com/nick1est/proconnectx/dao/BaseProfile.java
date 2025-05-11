package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class BaseProfile implements Profile, FileOwner {

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

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    @NotNull
    protected Double rating = 0.0;

    @Column(nullable = false)
    @Range(min = 0)
    @NotNull
    protected Integer ratingCount = 0;

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