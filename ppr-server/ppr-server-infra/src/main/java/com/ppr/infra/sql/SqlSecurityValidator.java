package com.ppr.infra.sql;

import com.github.jsqlparser.parser.CCJSqlParserUtil;
import com.github.jsqlparser.statement.Statement;
import com.github.jsqlparser.statement.Statements;
import com.github.jsqlparser.statement.select.Select;

public class SqlSecurityValidator {
    public void validateSelectOnly(String sql) {
        Statements statements;
        try {
            statements = CCJSqlParserUtil.parseStatements(sql);
        } catch (Exception e) {
            throw new SqlSecurityException("SQL 解析失败", e);
        }

        if (statements == null || statements.getStatements() == null || statements.getStatements().isEmpty()) {
            throw new SqlSecurityException("SQL 不能为空");
        }

        for (Statement statement : statements.getStatements()) {
            if (!(statement instanceof Select)) {
                throw new SqlSecurityException("仅允许执行查询类 SQL");
            }
        }
    }
}

