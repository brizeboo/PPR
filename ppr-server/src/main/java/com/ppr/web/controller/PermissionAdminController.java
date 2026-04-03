package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.meta.entity.PprPermissionEntity;
import com.ppr.infra.meta.mapper.PprPermissionMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/permission")
public class PermissionAdminController {

    private final PprPermissionMapper permissionMapper;

    public PermissionAdminController(PprPermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    @GetMapping("/list/{reportId}")
    public List<PprPermissionEntity> list(@PathVariable("reportId") String reportId) {
        return permissionMapper.selectList(
                new LambdaQueryWrapper<PprPermissionEntity>().eq(PprPermissionEntity::getReportId, reportId)
        );
    }

    @PostMapping("/upsert")
    public String upsert(@RequestBody PprPermissionEntity entity) {
        if (entity.getId() == null || entity.getId().isBlank()) {
            entity.setId(UUID.randomUUID().toString().replace("-", ""));
            permissionMapper.insert(entity);
        } else {
            permissionMapper.updateById(entity);
        }
        return entity.getId();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        permissionMapper.deleteById(id);
    }
}
