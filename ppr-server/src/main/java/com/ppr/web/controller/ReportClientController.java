package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.jdbc.ViewExecutionEngine;
import com.ppr.infra.jdbc.ViewExecutionResult;
import com.ppr.infra.meta.entity.PprReportEntity;
import com.ppr.infra.meta.entity.PprViewEntity;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.meta.mapper.PprReportMapper;
import com.ppr.infra.meta.mapper.PprViewMapper;
import com.ppr.infra.meta.mapper.PprViewParamMapper;
import com.ppr.infra.meta.service.ReportService;
import com.ppr.web.dto.ReportMetaResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/report")
public class ReportClientController {

    private final ReportService reportService;
    private final PprReportMapper reportMapper;
    private final PprViewMapper viewMapper;
    private final PprViewParamMapper viewParamMapper;
    private final ViewExecutionEngine viewExecutionEngine;

    public ReportClientController(ReportService reportService, PprReportMapper reportMapper, PprViewMapper viewMapper, PprViewParamMapper viewParamMapper, ViewExecutionEngine viewExecutionEngine) {
        this.reportService = reportService;
        this.reportMapper = reportMapper;
        this.viewMapper = viewMapper;
        this.viewParamMapper = viewParamMapper;
        this.viewExecutionEngine = viewExecutionEngine;
    }

    @GetMapping("/meta/{reportId}")
    public ReportMetaResponse meta(@PathVariable("reportId") String reportId) {
        return reportService.getReportMeta(reportId);
    }

    @PostMapping("/data/{reportId}")
    public ViewExecutionResult data(@PathVariable("reportId") String reportId,
                                    @RequestBody(required = false) Map<String, Object> params) {
        PprReportEntity report = reportMapper.selectById(reportId);
        if (report == null) {
            throw new IllegalArgumentException("Report not found");
        }
        String viewId = report.getViewId();
        if (viewId == null || viewId.isBlank()) {
            throw new IllegalArgumentException("Report has no viewId");
        }

        PprViewEntity view = viewMapper.selectById(viewId);
        if (view == null) {
            throw new IllegalArgumentException("View not found");
        }

        List<PprViewParamEntity> paramDefs = viewParamMapper.selectList(
                new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, viewId)
        );

        return viewExecutionEngine.execute(view.getDatasourceId(), view.getSqlContent(), paramDefs, params);
    }
}
