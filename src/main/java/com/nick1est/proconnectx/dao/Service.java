package com.nick1est.proconnectx.dao;

import com.nick1est.proconnectx.dto.Faq;
import com.nick1est.proconnectx.dto.WorkflowStep;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;
import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Service implements Statistic, FileOwner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Freelancer freelancer;

    @Column(nullable = false)
    @NotNull
    private String title;

    @Column(nullable = false)
    @NotNull
    @Lob
    private String description;

    @Column(nullable = false)
    @NotNull
    @Lob
    private String shortDescription;

    @Column(precision = 10, scale = 2, nullable = false)
    @NotNull
    private BigDecimal price;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<WorkflowStep> workflow;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Faq> faqs;

    @JoinColumn
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Address address;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> gallery;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "service_categories",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @Column(nullable = false)
    @Range(min = 0, max = 5)
    private Double rating = 0.0;

    @Column(nullable = false)
    @Range(min = 0)
    private Integer ratingCount = 0;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant postedAt;

    @Column(nullable = false)
    @Range(min = 0)
    private Integer visitCounter = 0;

    @Override
    public void incrementVisitorCounter() {
        this.visitCounter++;
    }

    @Override
    public OwnerType getOwnerType() {
        return OwnerType.SERVICE;
    }
}
