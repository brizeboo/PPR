package com.ppr.infra.jdbc;

import java.util.List;
import java.util.Map;

public class ViewExecutionResult {
    private final List<String> columns;
    private final List<Map<String, Object>> rows;

    public ViewExecutionResult(List<String> columns, List<Map<String, Object>> rows) {
        this.columns = columns;
        this.rows = rows;
    }

    public List<String> getColumns() {
        return columns;
    }

    public List<Map<String, Object>> getRows() {
        return rows;
    }
}

