package com.nick1est.proconnectx.events;

import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.AppEventType;
import com.nick1est.proconnectx.dto.ChannelType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    @NotNull
    private AppEventType eventType;
    @NotNull
    private ProfileType profileType;
    @NotEmpty
    private Long recipientId;
    private List<ChannelType> channels;
    private Map<String, Object> payload;
}
