package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
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
public abstract class AbstractUser implements Approvable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @JoinColumn(nullable = false)
    @ManyToOne(cascade = CascadeType.PERSIST)
    @NotNull
    protected Principal principal;

    @JoinColumn
    @OneToOne(cascade = CascadeType.PERSIST)
    protected Address address;

    protected String firstName;
    protected String lastName;
    protected String phoneNumber;

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    protected Double rating = 0.0;

    @Column(nullable = false)
    @Range(min = 0)
    protected Integer ratingCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    protected AccountStatus accountStatus = AccountStatus.UNVERIFIED;

    protected String rejectionReason;

    @CreatedDate
    @NotNull
    @Column(nullable = false, updatable = false)
    protected Instant registrationDate;

    private Instant activationDate;

    @Override
    public void approve() {
        this.accountStatus = AccountStatus.ACTIVE;
        this.rejectionReason = null;
    }

    @Override
    public void reject(String reason) {
        this.accountStatus = AccountStatus.REJECTED;
        this.rejectionReason = reason;
    }

    @Override
    public boolean isApproved() {
        return AccountStatus.ACTIVE.equals(this.accountStatus);
    }

    @Override
    public String getFullName() {
        return firstName + " " + lastName;
    }
}