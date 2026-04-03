package com.ppr.infra.meta.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ppr.infra.meta.entity.PprReportEntity;
import com.ppr.infra.meta.entity.PprViewEntity;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.meta.mapper.PprReportMapper;
import com.ppr.infra.meta.mapper.PprViewMapper;
import com.ppr.infra.meta.mapper.PprViewParamMapper;
import com.ppr.web.dto.ReportMetaResponse;
import com.ppr.web.dto.ReportUpsertRequest;
import com.ppr.web.dto.ViewParamDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService extends ServiceImpl<PprReportMapper, PprReportEntity> {

    private final PprViewMapper viewMapper;
    private final PprViewParamMapper viewParamMapper;

    public ReportService(PprViewMapper viewMapper, PprViewParamMapper viewParamMapper) {
        this.viewMapper = viewMapper;
        this.viewParamMapper = viewParamMapper;
    }

    public ReportMetaResponse getReportMeta(String reportId) {
        PprReportEntity report = getById(reportId);
        if (report == null) {
            throw new IllegalArgumentException("Report not found: " + reportId);
        }

        ReportMetaResponse response = new ReportMetaResponse();
        response.setId(report.getId());
        response.setViewId(report.getViewId());
        response.setTemplateId(report.getTemplateId());
        response.setName(report.getName());
        response.setChartType(report.getChartType());
        response.setPollingInterval(report.getPollingInterval());
        response.setStyleConfig(report.getStyleConfig());
        response.setChartConfig(report.getChartConfig());

        if (report.getViewId() != null) {
            List<PprViewParamEntity> params = viewParamMapper.selectList(
                    new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, report.getViewId())
            );
            List<ViewParamDto> paramDtos = params.stream().map(p -> {
                ViewParamDto dto = new ViewParamDto();
                dto.setId(p.getId());
                dto.setParamName(p.getParamName());
                dto.setParamType(p.getParamType());
                dto.setDictCode(p.getDictCode());
                dto.setRequired(p.getIsRequired());
                return dto;
            }).collect(Collectors.toList());
            response.setParams(paramDtos);
        }

        return response;
    }

    @Transactional
    public String upsertReport(ReportUpsertRequest request) {
        PprReportEntity entity;
        if (request.getId() == null || request.getId().isBlank()) {
            entity = new PprReportEntity();
            entity.setId(UUID.randomUUID().toString().replace("-", ""));
        } else {
            entity = getById(request.getId());
            if (entity == null) {
                throw new IllegalArgumentException("Report not found: " + request.getId());
            }
        }

        entity.setViewId(request.getViewId());
        entity.setTemplateId(request.getTemplateId());
        entity.setName(request.getName());
        entity.setChartType(request.getChartType());
        entity.setPollingInterval(request.getPollingInterval() != null ? request.getPollingInterval() : 0);
        entity.setStyleConfig(request.getStyleConfig());
        entity.setChartConfig(request.getChartConfig());

        saveOrUpdate(entity);
        return entity.getId();
    }
}
