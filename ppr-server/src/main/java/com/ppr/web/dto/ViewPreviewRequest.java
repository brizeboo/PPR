package com.ppr.web.dto;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

public class ViewPreviewRequest {
    private String viewId;

    private String datasourceId;
    private String sqlContent;

    @Valid
    private List<ViewParamDto> paramDefs;

    private Map<String, Object> params;

    private Boolean translateDict;

    public String getViewId() {
        return viewId;
    }

    public void setViewId(String viewId) {
        this.viewId = viewId;
    }

    public String getDatasourceId() {
        return datasourceId;
    }

    public void setDatasourceId(String datasourceId) {
        this.datasourceId = datasourceId;
    }

    public String getSqlContent() {
        return sqlContent;
    }

    public void setSqlContent(String sqlContent) {
        this.sqlContent = sqlContent;
    }

    public List<ViewParamDto> getParamDefs() {
        return paramDefs;
    }

    public void setParamDefs(List<ViewParamDto> paramDefs) {
        this.paramDefs = paramDefs;
    }

    public Map<String, Object> getParams() {
        return params;
    }

    public void setParams(Map<String, Object> params) {
        this.params = params;
    }

    public Boolean getTranslateDict() {
        return translateDict;
    }

    public void setTranslateDict(Boolean translateDict) {
        this.translateDict = translateDict;
    }
}

