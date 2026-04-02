package com.ppr.infra.sql;

public class SqlSecurityException extends RuntimeException {
    public SqlSecurityException(String message) {
        super(message);
    }

    public SqlSecurityException(String message, Throwable cause) {
        super(message, cause);
    }
}

