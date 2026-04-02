package com.ppr.infra.sql;

import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.Statements;
import net.sf.jsqlparser.statement.select.Select;

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

