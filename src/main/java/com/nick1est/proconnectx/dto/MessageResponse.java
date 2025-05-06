package com.nick1est.proconnectx.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageResponse {
    private String message;
    private Long id;
}

