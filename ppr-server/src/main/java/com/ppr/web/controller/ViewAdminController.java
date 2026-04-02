package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.jdbc.ViewExecutionEngine;
import com.ppr.infra.jdbc.ViewExecutionResult;
import com.ppr.infra.meta.entity.PprViewEntity;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.meta.mapper.PprViewMapper;
import com.ppr.infra.meta.mapper.PprViewParamMapper;
import com.ppr.web.dto.ViewParamDto;
import com.ppr.web.dto.ViewPreviewRequest;
import com.ppr.web.dto.ViewUpsertRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/view")
public class ViewAdminController {
    private final PprViewMapper viewMapper;
    private final PprViewParamMapper viewParamMapper;
    private final ViewExecutionEngine viewExecutionEngine;

    public ViewAdminController(PprViewMapper viewMapper, PprViewParamMapper viewParamMapper, ViewExecutionEngine viewExecutionEngine) {
        this.viewMapper = viewMapper;
        this.viewParamMapper = viewParamMapper;
        this.viewExecutionEngine = viewExecutionEngine;
    }

    @GetMapping("/list")
    public List<PprViewEntity> list() {
        return viewMapper.selectList(new LambdaQueryWrapper<>());
    }

    @GetMapping("/get/{id}")
    public Map<String, Object> get(@PathVariable("id") String id) {
        PprViewEntity view = viewMapper.selectById(id);
        List<PprViewParamEntity> params = viewParamMapper.selectList(new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, id));
        Map<String, Object> resp = new HashMap<>();
        resp.put("view", view);
        resp.put("params", params);
        return resp;
    }

    @PostMapping("/save")
    public PprViewEntity save(@RequestBody @Valid ViewUpsertRequest req) {
        String id = req.getId();
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString().replace("-", "");
        }

        PprViewEntity entity = new PprViewEntity();
        entity.setId(id);
        entity.setDatasourceId(req.getDatasourceId());
        entity.setName(req.getName());
        entity.setSqlContent(req.getSqlContent());

        if (viewMapper.selectById(id) == null) {
            viewMapper.insert(entity);
        } else {
            viewMapper.updateById(entity);
        }

        viewParamMapper.delete(new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, id));
        if (req.getParams() != null) {
            for (ViewParamDto dto : req.getParams()) {
                if (dto == null) {
                    continue;
                }
                PprViewParamEntity pe = new PprViewParamEntity();
                String pid = dto.getId();
                if (pid == null || pid.isBlank()) {
                    pid = UUID.randomUUID().toString().replace("-", "");
                }
                pe.setId(pid);
                pe.setViewId(id);
                pe.setParamName(dto.getParamName());
                pe.setParamType(dto.getParamType());
                pe.setDictCode(dto.getDictCode());
                pe.setIsRequired(Boolean.TRUE.equals(dto.getRequired()));
                viewParamMapper.insert(pe);
            }
        }

        return entity;
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable("id") String id) {
        viewMapper.deleteById(id);
        viewParamMapper.delete(new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, id));
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }

    @PostMapping("/preview")
    public ViewExecutionResult preview(@RequestBody @Valid ViewPreviewRequest req) {
        if (req.getViewId() != null && !req.getViewId().isBlank()) {
            PprViewEntity view = viewMapper.selectById(req.getViewId());
            if (view == null) {
                throw new IllegalArgumentException("viewId 不存在");
            }
            List<PprViewParamEntity> params = viewParamMapper.selectList(new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, req.getViewId()));
            return viewExecutionEngine.execute(view.getDatasourceId(), view.getSqlContent(), params, req.getParams());
        }

        if (req.getDatasourceId() == null || req.getDatasourceId().isBlank()) {
            throw new IllegalArgumentException("datasourceId 不能为空");
        }
        if (req.getSqlContent() == null || req.getSqlContent().isBlank()) {
            throw new IllegalArgumentException("sqlContent 不能为空");
        }

        List<PprViewParamEntity> defs = new ArrayList<>();
        if (req.getParamDefs() != null) {
            for (ViewParamDto dto : req.getParamDefs()) {
                if (dto == null) {
                    continue;
                }
                PprViewParamEntity def = new PprViewParamEntity();
                def.setParamName(dto.getParamName());
                def.setParamType(dto.getParamType());
                def.setDictCode(dto.getDictCode());
                def.setIsRequired(Boolean.TRUE.equals(dto.getRequired()));
                defs.add(def);
            }
        }

        return viewExecutionEngine.execute(req.getDatasourceId(), req.getSqlContent(), defs, req.getParams());
    }
}

