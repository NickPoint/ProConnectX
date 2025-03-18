package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class FormValidationResponse {
    @NotNull
    private final String message;
    @NotNull
    private final Map<String, String> errors;
}
