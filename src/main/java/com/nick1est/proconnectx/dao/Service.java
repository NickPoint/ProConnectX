package com.nick1est.proconnectx.dao;

import com.nick1est.proconnectx.dto.Faq;
import com.nick1est.proconnectx.dto.WorkflowStep;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;
import org.hibernate.validator.constraints.Range;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Service {
    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Freelancer freelancer;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<WorkflowStep> workflow;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Faq> faqs;

    @JoinColumn
    @OneToOne
    private Address address;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "ownerId", cascade = CascadeType.ALL, orphanRemoval = true)
    @NotEmpty
    private List<File> imagesMeta;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "service_categories",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    @NotNull
    private Double rating;

    @Column(nullable = false)
    @Range(min = 0)
    @NotNull
    private Integer ratingCount;

    @Column(nullable = false)
    private OffsetDateTime postedAt;

    @PrePersist
    private void prePersist() {
        ratingCount = 0;
        rating = 0.0;
        postedAt = OffsetDateTime.now();
    }
}
