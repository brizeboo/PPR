package com.ppr.infra.schedule;

import com.alibaba.excel.EasyExcel;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ppr.infra.jdbc.ViewExecutionEngine;
import com.ppr.infra.jdbc.ViewExecutionResult;
import com.ppr.infra.mail.MailService;
import com.ppr.infra.meta.entity.PprReportEntity;
import com.ppr.infra.meta.entity.PprScheduleTaskEntity;
import com.ppr.infra.meta.entity.PprViewEntity;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.meta.mapper.PprReportMapper;
import com.ppr.infra.meta.mapper.PprViewMapper;
import com.ppr.infra.meta.mapper.PprViewParamMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 定时任务执行器
 */
@Component
public class ScheduleTaskExecutor {

    private static final Logger log = LoggerFactory.getLogger(ScheduleTaskExecutor.class);

    private final MailService mailService;
    private final PprReportMapper reportMapper;
    private final PprViewMapper viewMapper;
    private final PprViewParamMapper viewParamMapper;
    private final ViewExecutionEngine viewExecutionEngine;

    public ScheduleTaskExecutor(MailService mailService, 
                                PprReportMapper reportMapper,
                                PprViewMapper viewMapper,
                                PprViewParamMapper viewParamMapper,
                                ViewExecutionEngine viewExecutionEngine) {
        this.mailService = mailService;
        this.reportMapper = reportMapper;
        this.viewMapper = viewMapper;
        this.viewParamMapper = viewParamMapper;
        this.viewExecutionEngine = viewExecutionEngine;
    }

    public void execute(PprScheduleTaskEntity task) {
        log.info("Executing schedule task: reportId={}, cron={}, status={}", task.getReportId(), task.getCron(), task.getStatus());
        
        try {
            PprReportEntity report = reportMapper.selectById(task.getReportId());
            if (report == null) {
                log.error("Report not found: {}", task.getReportId());
                return;
            }

            PprViewEntity view = viewMapper.selectById(report.getViewId());
            if (view == null) {
                log.error("View not found: {}", report.getViewId());
                return;
            }

            List<PprViewParamEntity> params = viewParamMapper.selectList(
                    new QueryWrapper<PprViewParamEntity>().eq("view_id", view.getId()));

            ViewExecutionResult result = viewExecutionEngine.execute(
                    view.getDatasourceId(), view.getSqlContent(), params, new HashMap<>());

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            
            // 使用 EasyExcel 动态导出数据
            List<List<String>> head = new ArrayList<>();
            for (String col : result.getColumns()) {
                List<String> headCol = new ArrayList<>();
                headCol.add(col);
                head.add(headCol);
            }

            List<List<Object>> data = new ArrayList<>();
            for (Map<String, Object> rowMap : result.getRows()) {
                List<Object> row = new ArrayList<>();
                for (String col : result.getColumns()) {
                    row.add(rowMap.get(col));
                }
                data.add(row);
            }

            EasyExcel.write(outputStream).head(head).sheet("Report Data").doWrite(data);

            byte[] attachmentData = outputStream.toByteArray();
            String filename = report.getName() + ".xlsx";

            mailService.sendEmailWithAttachment(
                    task.getReceivers(),
                    task.getCcReceivers(),
                    task.getEmailSubject(),
                    task.getEmailContent(),
                    filename,
                    attachmentData
            );
            
            log.info("Successfully executed schedule task and sent email: {}", task.getId());
        } catch (Exception e) {
            log.error("Failed to execute schedule task: {}", task.getId(), e);
        }
    }
}
