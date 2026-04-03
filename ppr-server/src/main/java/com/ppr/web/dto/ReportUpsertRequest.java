package com.ppr.web.dto;

public class ReportUpsertRequest {
    private String id;
    private String viewId;
    private String templateId;
    private String name;
    private String chartType;
    private Integer pollingInterval;
    private String styleConfig;
    private String chartConfig;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getViewId() { return viewId; }
    public void setViewId(String viewId) { this.viewId = viewId; }

    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getChartType() { return chartType; }
    public void setChartType(String chartType) { this.chartType = chartType; }

    public Integer getPollingInterval() { return pollingInterval; }
    public void setPollingInterval(Integer pollingInterval) { this.pollingInterval = pollingInterval; }

    public String getStyleConfig() { return styleConfig; }
    public void setStyleConfig(String styleConfig) { this.styleConfig = styleConfig; }

    public String getChartConfig() { return chartConfig; }
    public void setChartConfig(String chartConfig) { this.chartConfig = chartConfig; }
}
