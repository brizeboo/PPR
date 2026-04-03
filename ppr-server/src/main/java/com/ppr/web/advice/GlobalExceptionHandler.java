package com.ppr.web.advice;

import com.ppr.infra.sql.SqlSecurityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
/**
 * 全局异常处理
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

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

    @ExceptionHandler(DataAccessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleDataAccess(DataAccessException e) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "SQL 执行失败: " + sanitizeThrowableMessage(e));
        return resp;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleError(Exception e) {
        log.error("Unhandled exception", e);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "服务器内部错误");
        return resp;
    }

    private static String sanitizeThrowableMessage(Throwable e) {
        Throwable root = e;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        String msg = root.getMessage();
        if (msg == null || msg.isBlank()) {
            msg = root.getClass().getSimpleName();
        }
        String s = msg.replace("\r", " ").replace("\n", " ").trim();
        if (s.length() > 300) {
            s = s.substring(0, 300) + "...";
        }
        return s;
    }
}
