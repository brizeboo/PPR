package com.ppr.infra.meta.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

/**
 * 权限映射实体类
 */
@TableName("PPR_PERMISSION")
public class PprPermissionEntity {

    @TableId
    private String id;

    private String reportId;

    private String authChar;

    private String action;

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getAuthChar() {
        return authChar;
    }

    public void setAuthChar(String authChar) {
        this.authChar = authChar;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
