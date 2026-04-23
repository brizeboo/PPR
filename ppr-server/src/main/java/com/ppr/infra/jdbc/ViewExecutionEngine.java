package com.ppr.infra.jdbc;

import com.baomidou.dynamic.datasource.toolkit.DynamicDataSourceContextHolder;
import com.ppr.domain.enums.ParamType;
import com.ppr.infra.auth.AuthContextHolder;
import com.ppr.infra.auth.HostSystemAuthService;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.sql.SqlSecurityValidator;
import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.select.PlainSelect;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.expression.Expression;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSetMetaData;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ViewExecutionEngine {
    private static final Pattern TEMPLATE_PARAM_PATTERN = Pattern.compile("#\\{\\s*([a-zA-Z0-9_]+)\\s*\\}");

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final SqlSecurityValidator sqlSecurityValidator;

    public ViewExecutionEngine(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.sqlSecurityValidator = new SqlSecurityValidator();
    }

    public ViewExecutionResult execute(String datasourceId,
                                       String sqlContent,
                                       List<PprViewParamEntity> paramDefs,
                                       Map<String, Object> requestParams) {
        if (datasourceId == null || datasourceId.isBlank()) {
            throw new IllegalArgumentException("datasourceId 不能为空");
        }
        if (sqlContent == null || sqlContent.isBlank()) {
            throw new IllegalArgumentException("sqlContent 不能为空");
        }

        String sqlForParse = TEMPLATE_PARAM_PATTERN.matcher(sqlContent).replaceAll("?");
        //sqlSecurityValidator.validateSelectOnly(sqlForParse);

        Map<String, PprViewParamEntity> defMap = new HashMap<>();
        if (paramDefs != null) {
            for (PprViewParamEntity def : paramDefs) {
                if (def == null || def.getParamName() == null || def.getParamName().isBlank()) {
                    continue;
                }
                defMap.put(def.getParamName(), def);
            }
        }

        Map<String, Object> convertedParams = new HashMap<>();
        if (requestParams != null) {
            convertedParams.putAll(requestParams);
        }

        for (PprViewParamEntity def : defMap.values()) {
            boolean required = Boolean.TRUE.equals(def.getIsRequired());
            if (required && !convertedParams.containsKey(def.getParamName())) {
                throw new IllegalArgumentException("缺少必填参数: " + def.getParamName());
            }
            if (convertedParams.containsKey(def.getParamName())) {
                convertedParams.put(def.getParamName(), convertType(def, convertedParams.get(def.getParamName())));
            }
        }

        String executableSql = toNamedParameterSql(sqlContent, defMap);
        executableSql = appendDataScope(executableSql);

        MapSqlParameterSource parameterSource = new MapSqlParameterSource(convertedParams);

        DynamicDataSourceContextHolder.push(datasourceId);
        try {
            return namedParameterJdbcTemplate.query(executableSql, parameterSource, (ResultSetExtractor<ViewExecutionResult>) rs -> {
                ResultSetMetaData meta = rs.getMetaData();
                int colCount = meta.getColumnCount();
                List<String> columns = new ArrayList<>(colCount);
                for (int i = 1; i <= colCount; i++) {
                    String label = meta.getColumnLabel(i);
                    columns.add(label);
                }

                List<Map<String, Object>> rows = new ArrayList<>();
                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (int i = 1; i <= colCount; i++) {
                        String label = columns.get(i - 1);
                        row.put(label, rs.getObject(i));
                    }
                    rows.add(row);
                }
                return new ViewExecutionResult(columns, rows);
            });
        } finally {
            DynamicDataSourceContextHolder.poll();
        }
    }

    private String appendDataScope(String sql) {
        HostSystemAuthService.AuthResult authResult = AuthContextHolder.getAuthResult();
        if (authResult == null || authResult.getDataScope() == null || authResult.getDataScope().isBlank()) {
            return sql;
        }

        try {
            Statement stmt = CCJSqlParserUtil.parse(sql);
            if (stmt instanceof PlainSelect) {
                PlainSelect plainSelect = (PlainSelect) stmt;
                Expression dataScopeExpr = CCJSqlParserUtil.parseCondExpression(authResult.getDataScope());
                if (plainSelect.getWhere() == null) {
                    plainSelect.setWhere(dataScopeExpr);
                } else {
                    Expression combined = CCJSqlParserUtil.parseCondExpression("(" + plainSelect.getWhere().toString() + ") AND (" + authResult.getDataScope() + ")");
                    plainSelect.setWhere(combined);
                }
                return plainSelect.toString();
            }
        } catch (JSQLParserException e) {
            throw new RuntimeException("Failed to append DataScope to SQL", e);
        }
        return sql;
    }

    private static String toNamedParameterSql(String sqlContent, Map<String, PprViewParamEntity> defMap) {
        Matcher matcher = TEMPLATE_PARAM_PATTERN.matcher(sqlContent);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String name = matcher.group(1);
            if (!defMap.containsKey(name)) {
                throw new IllegalArgumentException("SQL 使用了未定义的参数: " + name);
            }
            matcher.appendReplacement(sb, ":" + name);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private static Object convertType(PprViewParamEntity def, Object value) {
        if (value == null) {
            return null;
        }

        ParamType paramType;
        try {
            paramType = ParamType.valueOf(def.getParamType());
        } catch (Exception e) {
            paramType = ParamType.String;
        }

        return switch (paramType) {
            case String -> Objects.toString(value, null);
            case Number -> {
                if (value instanceof Number) {
                    yield value;
                }
                String s = Objects.toString(value, "").trim();
                if (s.isEmpty()) {
                    yield null;
                }
                try {
                    yield Long.parseLong(s);
                } catch (NumberFormatException ignored) {
                    try {
                        yield Double.parseDouble(s);
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("参数类型转换失败: " + def.getParamName());
                    }
                }
            }
            case Date -> {
                if (value instanceof java.util.Date) {
                    yield value;
                }
                String s = Objects.toString(value, "").trim();
                if (s.isEmpty()) {
                    yield null;
                }
                try {
                    yield java.sql.Date.valueOf(LocalDate.parse(s));
                } catch (DateTimeParseException ignored) {
                    try {
                        yield Timestamp.valueOf(LocalDateTime.parse(s));
                    } catch (DateTimeParseException e) {
                        throw new IllegalArgumentException("参数类型转换失败: " + def.getParamName());
                    }
                }
            }
        };
    }
}

