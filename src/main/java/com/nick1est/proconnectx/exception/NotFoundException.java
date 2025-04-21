package com.nick1est.proconnectx.exception;

import lombok.Getter;

@Getter
public class NotFoundException extends RuntimeException {
    private Object[] args;

    public NotFoundException(String message, Object... args) {
        super(message);
        this.args = args;
    }
}
