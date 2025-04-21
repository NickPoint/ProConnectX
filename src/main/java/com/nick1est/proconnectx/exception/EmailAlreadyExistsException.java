package com.nick1est.proconnectx.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class EmailAlreadyExistsException extends RuntimeException {
    private Object[] args;

    public EmailAlreadyExistsException(String message, Object ...args) {
        super(message);
        this.args = args;
    }
}
