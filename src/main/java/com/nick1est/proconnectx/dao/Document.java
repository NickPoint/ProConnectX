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
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    @NotNull
    private Freelancer freelancer;

    @JoinColumn(nullable = false)
    @ManyToOne
    @NotNull
    private Employer employer;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private DocumentType documentName;

    @Column(nullable = false)
    @NotBlank
    private String documentPath;

    @Column(nullable = false)
    @NotNull
    private Boolean verified;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime uploadedDate;

    @PrePersist
    public void prePersist() {
        this.uploadedDate = OffsetDateTime.now();
        this.verified = false;
    }
}
