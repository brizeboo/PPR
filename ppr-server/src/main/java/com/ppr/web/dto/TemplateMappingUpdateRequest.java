package com.ppr.web.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * 模板映射配置更新请求
 */
public class TemplateMappingUpdateRequest {

    @NotBlank(message = "映射配置不能为空")
    private String mappingConfig;

    public String getMappingConfig() {
        return mappingConfig;
    }

    public void setMappingConfig(String mappingConfig) {
        this.mappingConfig = mappingConfig;
    }
}