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

    /**
     * 新增数据源
     *
     * @param req 新增/更新请求体
     * @return 新增后的数据源实体
     */
    @PostMapping("/add")
    public PprDatasourceEntity add(@RequestBody @Valid DatasourceUpsertRequest req) {
        // 校验名称是否重复
        Long count = datasourceMapper.selectCount(
            new LambdaQueryWrapper<PprDatasourceEntity>().eq(PprDatasourceEntity::getName, req.getName())
        );
        if (count != null && count > 0) {
            throw new IllegalArgumentException("数据源名称已存在");
        }

        // 生成新的数据源ID
        String id = UUID.randomUUID().toString().replace("-", "");

        // 创建新的实体对象并赋值
        PprDatasourceEntity entity = new PprDatasourceEntity();
        entity.setId(id);
        entity.setName(req.getName());
        entity.setType(req.getType());
        entity.setJdbcUrl(req.getJdbcUrl());
        entity.setUsername(req.getUsername());
        entity.setPassword(req.getPassword());

        // 插入到数据库
        datasourceMapper.insert(entity);

        // 如果不是元数据数据源，则更新服务缓存
        if (!"meta".equals(id)) {
            dataSourceService.addOrUpdateDataSource(entity);
        }
        return entity;
    }

    /**
     * 更新数据源
     *
     * @param req 新增/更新请求体
     * @return 更新后的数据源实体
     */
    @PostMapping("/update")
    public PprDatasourceEntity update(@RequestBody @Valid DatasourceUpsertRequest req) {
        // 数据源ID
        String id = req.getId();
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("数据源ID不能为空");
        }

        // 校验名称是否重复（排除当前正在更新的实体自身）
        Long count = datasourceMapper.selectCount(
            new LambdaQueryWrapper<PprDatasourceEntity>()
                .eq(PprDatasourceEntity::getName, req.getName())
                .ne(PprDatasourceEntity::getId, id)
        );
        if (count != null && count > 0) {
            throw new IllegalArgumentException("数据源名称已存在");
        }

        // 创建新的实体对象并赋值
        PprDatasourceEntity entity = new PprDatasourceEntity();
        entity.setId(id);
        entity.setName(req.getName());
        entity.setType(req.getType());
        entity.setJdbcUrl(req.getJdbcUrl());
        entity.setUsername(req.getUsername());
        entity.setPassword(req.getPassword());

        // 更新数据库记录
        datasourceMapper.updateById(entity);

        // 如果不是元数据数据源，则更新服务缓存
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

