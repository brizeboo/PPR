package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.jdbc.ViewExecutionEngine;
import com.ppr.infra.jdbc.ViewExecutionResult;
import com.ppr.infra.log.LogAudit;
import com.ppr.infra.meta.entity.PprReportEntity;
import com.ppr.infra.meta.entity.PprViewEntity;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.meta.mapper.PprReportMapper;
import com.ppr.infra.meta.mapper.PprViewMapper;
import com.ppr.infra.meta.mapper.PprViewParamMapper;
import com.ppr.infra.meta.service.ReportService;
import com.ppr.web.dto.ReportMetaResponse;
import com.alibaba.excel.EasyExcel;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
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

    @LogAudit("查询报表数据")
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

    /**
     * 导出报表数据为 Excel 文件
     */
    @LogAudit("导出报表数据")
    @PostMapping("/export/{reportId}")
    public void export(@PathVariable("reportId") String reportId,
                       @RequestBody(required = false) Map<String, Object> params,
                       HttpServletResponse response) throws IOException {
        PprReportEntity report = reportMapper.selectById(reportId);
        if (report == null) {
            throw new IllegalArgumentException("Report not found");
        }
        
        // 复用查询逻辑获取结果集
        ViewExecutionResult result = data(reportId, params);
        List<Map<String, Object>> dataList = result.getRows();

        // 解析 styleConfig 提取表头
        List<List<String>> head = new ArrayList<>();
        List<String> props = new ArrayList<>();
        
        String styleConfig = report.getStyleConfig();
        if (styleConfig != null && !styleConfig.isBlank()) {
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> columns = mapper.readValue(styleConfig, new TypeReference<List<Map<String, Object>>>() {});
            for (Map<String, Object> col : columns) {
                String prop = (String) col.get("prop");
                String label = (String) col.get("label");
                if (prop != null && label != null) {
                    List<String> headCol = new ArrayList<>();
                    headCol.add(label);
                    head.add(headCol);
                    props.add(prop);
                }
            }
        } else {
            // 如果没有配置，则直接取数据的 key 作为表头
            if (!dataList.isEmpty()) {
                Map<String, Object> firstRow = dataList.get(0);
                for (String key : firstRow.keySet()) {
                    List<String> headCol = new ArrayList<>();
                    headCol.add(key);
                    head.add(headCol);
                    props.add(key);
                }
            }
        }

        // 组装数据行
        List<List<Object>> data = new ArrayList<>();
        for (Map<String, Object> row : dataList) {
            List<Object> rowData = new ArrayList<>();
            for (String prop : props) {
                rowData.add(row.get(prop));
            }
            data.add(rowData);
        }

        // 设置响应头
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        String fileName = URLEncoder.encode(report.getName() + "导出数据", StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");

        // 使用 EasyExcel 写入流
        EasyExcel.write(response.getOutputStream()).head(head).sheet("数据").doWrite(data);
    }
}
