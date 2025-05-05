package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.EntityType;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class NotificationPayload {
    private Long entityId;
    private EntityType entityType;
    private Map<String, Object> data;  // Extra details (e.g., username, avatar URL)
}
