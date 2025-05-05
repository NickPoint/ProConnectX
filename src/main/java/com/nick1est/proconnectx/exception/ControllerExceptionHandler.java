package com.nick1est.proconnectx.exception;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springdoc.api.ErrorMessage;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class ControllerExceptionHandler {

    private final MessageSource messageSource;

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

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorMessage notFoundException(NotFoundException ex) {
        String message = messageSource.getMessage(ex.getMessage(), ex.getArgs(), LocaleContextHolder.getLocale());
        val errorMessage = new ErrorMessage(message);
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                message,
                ex);
        return errorMessage;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        log.error(ex.getMessage(), errors);
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Map<String, String>> handleBindErrors(BindException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        log.error(ex.getMessage(), errors);
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage globalExceptionHandler(Exception ex) {
        val errorMessage = new ErrorMessage(ex.getMessage());
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                errorMessage.getMessage(),
                ex);
        return errorMessage;
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorMessage handleAuthenticationException(Exception ex) {
        String message = messageSource.getMessage("error.signin.bad_credentials", null, LocaleContextHolder.getLocale());
        val errorMessage = new ErrorMessage(message);
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                message,
                ex);
        return errorMessage;
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorMessage handleAccessDeniedException(Exception ex) {
        val errorMessage = new ErrorMessage(ex.getMessage());
        log.error("ErrorId: {}, ErrorMessage: {}",
                errorMessage.getId(),
                ex.getMessage());
        return errorMessage;
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessage emailAlreadyExistsException(EmailAlreadyExistsException ex) {
        String message = messageSource.getMessage(ex.getMessage(), ex.getArgs(), LocaleContextHolder.getLocale());
        val errorMessage = new ErrorMessage(message);
        log.error("ErrorId: {}, ErrorMessage: {}, Error: ",
                errorMessage.getId(),
                message,
                ex);
        return errorMessage;
    }

/*    @ExceptionHandler(FormValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public FormValidationResponse handleFieldValidationException(FormValidationException ex) {
        val message = messageSource.getMessage(ex.getMessage(), null, LocaleContextHolder.getLocale());
        Map<String, String> errorsWithTranslation =  new HashMap<>();
        ex.getErrors().forEach((key, value) ->
                errorsWithTranslation.put(key, messageSource.getMessage(key, ex.getArgs(), LocaleContextHolder.getLocale())));
        return new FormValidationResponse(message, ex.getErrors());
    }*/

    @ExceptionHandler(FileStorageException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleFileStorageException(FileStorageException ex) {
        return "File upload failed: " + ex.getMessage();
    }
}