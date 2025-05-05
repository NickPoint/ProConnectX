package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
public class MessageResponse {
    private String message;
    private Long id;
}

