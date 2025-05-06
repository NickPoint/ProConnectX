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
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column
    private Long serviceId;

    @Column
    private Long clientId;

    @Column
    private Long freelancerId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private OwnerType ownerType;

    @Column
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    @Column(nullable = false)
    @NotBlank
    private String path;

    @Column(nullable = false)
    @NotBlank
    private String originalFileName;

    @Column
    private Boolean verified;

    @Column(nullable = false)
    @NotNull
    private Boolean isPublic = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant uploadedAt;

}
