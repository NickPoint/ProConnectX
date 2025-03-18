package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
public class MessageResponse {
    @NotBlank
    private String message;
    private Long entityId;
}

