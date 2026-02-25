package org.hackathon2026.backend.exceptions;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler
    public List<ValidationErrorResponse.FieldViolation> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        List<ValidationErrorResponse.FieldViolation> violations = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::toFieldViolation)
                .toList();

        return violations;
    }

    private ValidationErrorResponse.FieldViolation toFieldViolation(FieldError error) {
        String field = error.getField();
        String message = error.getDefaultMessage();

        if (message == null || message.isBlank()) {
            message = "Invalid value";
        }

        return new ValidationErrorResponse.FieldViolation(field, message);
    }

    public record ValidationErrorResponse(
            String message,
            List<FieldViolation> errors
    ) {
        public record FieldViolation(String field, String message) {}
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadRequestException.class)
    public ErrorResponse handleBadRequest(BadRequestException ex) {
        return new ErrorResponse(ex.getMessage());
    }

    public record ErrorResponse(String message) {}

}