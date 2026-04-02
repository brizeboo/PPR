package com.ppr.web.advice;

import com.ppr.infra.sql.SqlSecurityException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException e) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", e.getBindingResult().getAllErrors().isEmpty() ? "参数校验失败" : e.getBindingResult().getAllErrors().get(0).getDefaultMessage());
        return resp;
    }

    @ExceptionHandler({IllegalArgumentException.class, SqlSecurityException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBadRequest(RuntimeException e) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", e.getMessage());
        return resp;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleError(Exception e) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "服务器内部错误");
        return resp;
    }
}

