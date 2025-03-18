package com.nick1est.proconnectx.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class FormValidationEx extends RuntimeException {
    private final Map<String, String> errors;

    public FormValidationEx(Map<String, String> errors) {
        super("Form validation failed");
        this.errors = errors;
    }
}
