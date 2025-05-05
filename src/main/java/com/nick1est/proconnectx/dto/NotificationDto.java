package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.NotificationStatus;
import com.nick1est.proconnectx.dao.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private Long id;
    private NotificationType type;
    private NotificationPayload payload;
    private Instant createdAt;
    private NotificationStatus status;
}
