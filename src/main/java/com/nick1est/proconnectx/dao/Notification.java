package com.nick1est.proconnectx.dao;

import com.nick1est.proconnectx.dto.NotificationPayload;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn
    private Principal principal;

    @ManyToOne
    @JoinColumn
    private Client client;

    @ManyToOne
    @JoinColumn
    private Freelancer freelancer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private NotificationStatus status = NotificationStatus.UNREAD;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    @NotNull
    private NotificationPayload payload;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @NotNull
    private Instant createdAt;

    @Column
    private Instant readAt;
}

