package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false)
    @NotNull
    private Long ownerId;

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
    private OffsetDateTime uploadAt;

    @PrePersist
    public void prePersist() {
        if (verified == null) {
            verified = false;
        }
        uploadAt = OffsetDateTime.now();
    }

}
