package com.ppr.infra.sql;

import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.Statements;
import net.sf.jsqlparser.statement.select.Select;

import java.util.regex.Pattern;

public class SqlSecurityValidator {
    private static final Pattern SELECT_STAR_PATTERN = Pattern.compile("(?i)(\\bselect\\s+(?:distinct\\s+)?)\\*\\b");
    private static final Pattern COMMA_STAR_PATTERN = Pattern.compile("(?i)(,\\s*)\\*\\b");
    private static final Pattern TABLE_STAR_PATTERN = Pattern.compile("(?i)(\\b[a-zA-Z_][a-zA-Z0-9_]*\\.)\\*\\b");

    public void validateSelectOnly(String sql) {
        String sqlForParse = normalizeForParser(sql);

        Statements statements;
        try {
            statements = CCJSqlParserUtil.parseStatements(sqlForParse);
        } catch (Exception e) {
            String detail = sanitizeParserMessage(e.getMessage());
            if (detail == null || detail.isBlank()) {
                throw new SqlSecurityException("SQL 解析失败", e);
            }
            throw new SqlSecurityException("SQL 解析失败: " + detail, e);
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

    private static String normalizeForParser(String sql) {
        if (sql == null) {
            return null;
        }
        String s = sql;
        s = TABLE_STAR_PATTERN.matcher(s).replaceAll("$1__ppr_all__");
        s = SELECT_STAR_PATTERN.matcher(s).replaceAll("$1__ppr_all__");
        s = COMMA_STAR_PATTERN.matcher(s).replaceAll("$1__ppr_all__");
        return s;
    }

    private static String sanitizeParserMessage(String msg) {
        if (msg == null) {
            return null;
        }
        String s = msg.replace("\r", " ").replace("\n", " ").trim();
        if (s.length() > 200) {
            return s.substring(0, 200) + "...";
        }
        return s;
    }
}
