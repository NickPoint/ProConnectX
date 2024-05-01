package com.nick1est.proconnectx.exception;

import lombok.Data;
import lombok.Getter;
import org.springdoc.api.ErrorMessage;

@Getter
public class ErrorMessageEx extends ErrorMessage {
    private final Object stackTrace;
    public ErrorMessageEx(String message, Object stackTrace) {
        super(message);
        this.stackTrace = stackTrace;
    }
}
