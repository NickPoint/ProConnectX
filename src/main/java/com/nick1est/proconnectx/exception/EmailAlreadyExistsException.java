package com.nick1est.proconnectx.exception;

import lombok.Getter;

@Getter
public class EmailAlreadyExistsException extends RuntimeException {
    private Object[] args;

    public EmailAlreadyExistsException(Object ...args) {
        super("error.signup.email_exists");
        this.args = args;
    }
}
