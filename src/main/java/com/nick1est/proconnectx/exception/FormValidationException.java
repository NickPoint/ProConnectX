package com.nick1est.proconnectx.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class FormValidationException extends RuntimeException {
    private final Map<String, String> errors;
    private final Object[] args;

    public FormValidationException(Map<String, String> errors, Object[] ...args) {
        super("error.signup.general");
        this.errors = errors;
        this.args = args;
    }
}
