package com.ppr.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class ViewUpsertRequest {
    private String id;

    @NotBlank
    private String datasourceId;

    @NotBlank
    private String name;

    @NotBlank
    private String sqlContent;

    @Valid
    private List<ViewParamDto> params;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDatasourceId() {
        return datasourceId;
    }

    public void setDatasourceId(String datasourceId) {
        this.datasourceId = datasourceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSqlContent() {
        return sqlContent;
    }

    public void setSqlContent(String sqlContent) {
        this.sqlContent = sqlContent;
    }

    public List<ViewParamDto> getParams() {
        return params;
    }

    public void setParams(List<ViewParamDto> params) {
        this.params = params;
    }
}

