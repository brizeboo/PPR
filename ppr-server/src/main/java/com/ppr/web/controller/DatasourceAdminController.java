package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.datasource.DataSourceService;
import com.ppr.infra.meta.entity.PprDatasourceEntity;
import com.ppr.infra.meta.mapper.PprDatasourceMapper;
import com.ppr.web.dto.DatasourceTestRequest;
import com.ppr.infra.log.LogAudit;
import com.ppr.web.dto.DatasourceUpsertRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
/**
 * 后台管理：数据源连接
 */
@RestController
@RequestMapping("/api/v1/admin/datasource")
public class DatasourceAdminController {
    private final PprDatasourceMapper datasourceMapper;
    private final DataSourceService dataSourceService;

    public DatasourceAdminController(PprDatasourceMapper datasourceMapper, DataSourceService dataSourceService) {
        this.datasourceMapper = datasourceMapper;
        this.dataSourceService = dataSourceService;
    }

    @GetMapping("/list")
    public List<PprDatasourceEntity> list() {
        return datasourceMapper.selectList(new LambdaQueryWrapper<>());
    }

    @PostMapping("/save")
    public PprDatasourceEntity save(@RequestBody @Valid DatasourceUpsertRequest req) {
        String id = req.getId();
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString().replace("-", "");
        }

        PprDatasourceEntity entity = new PprDatasourceEntity();
        entity.setId(id);
        entity.setName(req.getName());
        entity.setType(req.getType());
        entity.setJdbcUrl(req.getJdbcUrl());
        entity.setUsername(req.getUsername());
        entity.setPassword(req.getPassword());

        if (datasourceMapper.selectById(id) == null) {
            datasourceMapper.insert(entity);
        } else {
            datasourceMapper.updateById(entity);
        }

        if (!"meta".equals(id)) {
            dataSourceService.addOrUpdateDataSource(entity);
        }
        return entity;
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable("id") String id) {
        datasourceMapper.deleteById(id);
        if (!"meta".equals(id)) {
            dataSourceService.removeDataSource(id);
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }

    @LogAudit("测试数据源连接")
    @PostMapping("/test")
    public Map<String, Object> testConnection(@RequestBody @Valid DatasourceTestRequest req) {
        boolean ok = dataSourceService.testConnection(req.getJdbcUrl(), req.getUsername(), req.getPassword());
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", ok);
        return resp;
    }
}

