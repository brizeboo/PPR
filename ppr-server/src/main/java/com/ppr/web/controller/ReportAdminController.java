package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.meta.entity.PprReportEntity;
import com.ppr.infra.meta.mapper.PprReportMapper;
import com.ppr.infra.meta.service.ReportService;
import com.ppr.web.dto.ReportUpsertRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/report")
public class ReportAdminController {

    private final ReportService reportService;
    private final PprReportMapper reportMapper;

    public ReportAdminController(ReportService reportService, PprReportMapper reportMapper) {
        this.reportService = reportService;
        this.reportMapper = reportMapper;
    }

    @PostMapping("/upsert")
    public String upsert(@RequestBody ReportUpsertRequest request) {
        return reportService.upsertReport(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        reportMapper.deleteById(id);
    }

    @GetMapping("/list")
    public List<PprReportEntity> list() {
        return reportMapper.selectList(new LambdaQueryWrapper<>());
    }
}
