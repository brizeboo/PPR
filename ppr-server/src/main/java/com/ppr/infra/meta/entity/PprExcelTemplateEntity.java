package com.ppr.infra.meta.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

/**
 * Excel 模板实体类
 */
@TableName("PPR_EXCEL_TEMPLATE")
public class PprExcelTemplateEntity {

    @TableId
    private String id;

    private String name;

    private String filePath;

    private String mappingConfig;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getMappingConfig() {
        return mappingConfig;
    }

    public void setMappingConfig(String mappingConfig) {
        this.mappingConfig = mappingConfig;
    }
}