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
    @NotBlank
    private String type;

    @Column
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    @Column(nullable = false)
    @NotBlank
    private String path;

    @Column(nullable = false)
    @NotBlank
    private String fileName;

    @Column(nullable = false)
    private boolean verified;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime uploadDate;

    @JoinColumn
    @ManyToOne(fetch = FetchType.LAZY)
    private Principal principal;

    @PrePersist
    public void prePersist() {
        uploadDate = OffsetDateTime.now();
    }

}
