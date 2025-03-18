package com.nick1est.proconnectx.exception;

import com.nick1est.proconnectx.dto.FormValidationResponse;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springdoc.api.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.Map;

@Slf4j
@RestControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorMessage resourceNotFoundException(Exception ex) {
        val errorMessage = new ErrorMessage(ex.getMessage());
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                "Resource not found",
                ex);

        return errorMessage;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage globalExceptionHandler(Exception ex) {
        val errorMessage = new ErrorMessage(ex.getMessage());
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                "Internal server error",
                ex);

        return errorMessage;
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorMessage handleAuthenticationException(Exception ex) {
        val errorMessage = new ErrorMessage(ex.getMessage());
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                "Authentication failed at controller advice",
                ex);

        return errorMessage;
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorMessage handleAccessDeniedException(Exception ex) {
        val errorMessage = new ErrorMessage(ex.getMessage());
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                "Access denied at controller advice",
                ex);

        return errorMessage;
    }

    @ExceptionHandler(FormValidationEx.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public FormValidationResponse handleFieldValidationException(FormValidationEx ex) {
        return new FormValidationResponse(ex.getMessage(), ex.getErrors());
    }
}