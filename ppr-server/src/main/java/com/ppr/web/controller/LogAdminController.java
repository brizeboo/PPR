package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ppr.infra.meta.entity.PprLogEntity;
import com.ppr.infra.meta.mapper.PprLogMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.StringUtils;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/log")
public class LogAdminController {

    private final PprLogMapper logMapper;

    public LogAdminController(PprLogMapper logMapper) {
        this.logMapper = logMapper;
    }

    @PostMapping("/page")
    public Page<PprLogEntity> page(@RequestBody Map<String, Object> params) {
        int current = (int) params.getOrDefault("current", 1);
        int size = (int) params.getOrDefault("size", 10);
        String type = (String) params.get("type");
        String status = (String) params.get("status"); // success / error
        Long startTime = params.get("startTime") != null ? Long.valueOf(params.get("startTime").toString()) : null;
        Long endTime = params.get("endTime") != null ? Long.valueOf(params.get("endTime").toString()) : null;

        QueryWrapper<PprLogEntity> wrapper = new QueryWrapper<>();
        
        if (StringUtils.hasText(type)) {
            wrapper.like("type", type);
        }
        if ("error".equals(status)) {
            wrapper.isNotNull("error_msg");
        } else if ("success".equals(status)) {
            wrapper.isNull("error_msg");
        }
        if (startTime != null) {
            wrapper.ge("time", startTime);
        }
        if (endTime != null) {
            wrapper.le("time", endTime);
        }
        wrapper.orderByDesc("time");

        return logMapper.selectPage(new Page<>(current, size), wrapper);
    }
}
