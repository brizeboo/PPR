package com.ppr;

import com.ppr.infra.sql.SqlSecurityException;
import com.ppr.infra.sql.SqlSecurityValidator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class SqlSecurityValidatorTest {
    @Test
    void allowSelect() {
        SqlSecurityValidator v = new SqlSecurityValidator();
        v.validateSelectOnly("SELECT * FROM users");
    }

    @Test
    void blockMultipleStatements() {
        SqlSecurityValidator v = new SqlSecurityValidator();
        Assertions.assertThrows(SqlSecurityException.class, () -> v.validateSelectOnly("SELECT * FROM users; DROP TABLE users;"));
    }
}

