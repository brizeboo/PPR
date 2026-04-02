package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.jdbc.ViewExecutionEngine;
import com.ppr.infra.jdbc.ViewExecutionResult;
import com.ppr.infra.meta.entity.PprViewEntity;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.meta.mapper.PprViewMapper;
import com.ppr.infra.meta.mapper.PprViewParamMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/view")
public class ViewClientController {
    private final PprViewMapper viewMapper;
    private final PprViewParamMapper viewParamMapper;
    private final ViewExecutionEngine viewExecutionEngine;

    public ViewClientController(PprViewMapper viewMapper, PprViewParamMapper viewParamMapper, ViewExecutionEngine viewExecutionEngine) {
        this.viewMapper = viewMapper;
        this.viewParamMapper = viewParamMapper;
        this.viewExecutionEngine = viewExecutionEngine;
    }

    @PostMapping("/data/{viewId}")
    public ViewExecutionResult data(@PathVariable("viewId") String viewId,
                                    @RequestParam(name = "translateDict", required = false) Boolean translateDict,
                                    @RequestBody(required = false) Map<String, Object> params) {
        PprViewEntity view = viewMapper.selectById(viewId);
        if (view == null) {
            throw new IllegalArgumentException("viewId 不存在");
        }
        List<PprViewParamEntity> paramDefs = viewParamMapper.selectList(new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, viewId));
        return viewExecutionEngine.execute(view.getDatasourceId(), view.getSqlContent(), paramDefs, params);
    }
}

