package com.nick1est.proconnectx.dao;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    @NotNull
    private Project project;

    @JoinColumn(nullable = false)
    @ManyToOne
    @NotNull
    private Freelancer freelancer;

    @Column(nullable = false)
    @NotNull
    private Double amount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BidStatus status;

    @Column(nullable = false)
    @NotBlank
    @Lob
    private String coverLetter;

    @Column(nullable = false)
    @NotNull
    private OffsetDateTime submittedAt;

    @Column
    private OffsetDateTime estimatedCompletionDate;

    @JoinColumn
    @OneToMany
    private List<File> attachments;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> milestones;

    @PrePersist
    public void prePersist() {
        status = BidStatus.NEW;
        submittedAt = OffsetDateTime.now();
    }

}
