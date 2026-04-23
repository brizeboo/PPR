package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ppr.infra.meta.entity.PprScheduleTaskEntity;
import com.ppr.infra.meta.mapper.PprScheduleTaskMapper;
import com.ppr.infra.schedule.DynamicScheduleRegistrar;
import com.ppr.infra.schedule.ScheduleTaskExecutor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.ppr.infra.log.LogAudit;

@RestController
@RequestMapping("/api/v1/admin/schedule")
public class ScheduleAdminController {

    private final PprScheduleTaskMapper scheduleTaskMapper;
    private final DynamicScheduleRegistrar dynamicScheduleRegistrar;
    private final ScheduleTaskExecutor taskExecutor;

    public ScheduleAdminController(PprScheduleTaskMapper scheduleTaskMapper, DynamicScheduleRegistrar dynamicScheduleRegistrar, ScheduleTaskExecutor taskExecutor) {
        this.scheduleTaskMapper = scheduleTaskMapper;
        this.dynamicScheduleRegistrar = dynamicScheduleRegistrar;
        this.taskExecutor = taskExecutor;
    }

    @GetMapping("/list")
    public List<PprScheduleTaskEntity> list() {
        return scheduleTaskMapper.selectList(new QueryWrapper<>());
    }

    @LogAudit("保存定时任务")
    @PostMapping("/save")
    public String save(@RequestBody PprScheduleTaskEntity entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(UUID.randomUUID().toString());
            scheduleTaskMapper.insert(entity);
        } else {
            scheduleTaskMapper.updateById(entity);
        }
        
        // 更新定时任务
        if (entity.getStatus() == 1) {
            dynamicScheduleRegistrar.addTask(entity);
        } else {
            dynamicScheduleRegistrar.removeTask(entity.getId());
        }
        
        return entity.getId();
    }

    @LogAudit("修改定时任务状态")
    @PostMapping("/status/{id}")
    public void changeStatus(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        PprScheduleTaskEntity entity = scheduleTaskMapper.selectById(id);
        if (entity != null) {
            entity.setStatus(payload.get("status"));
            scheduleTaskMapper.updateById(entity);
            if (entity.getStatus() == 1) {
                dynamicScheduleRegistrar.addTask(entity);
            } else {
                dynamicScheduleRegistrar.removeTask(entity.getId());
            }
        }
    }

    @LogAudit("删除定时任务")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        scheduleTaskMapper.deleteById(id);
        dynamicScheduleRegistrar.removeTask(id);
    }

    @LogAudit("立即执行定时任务")
    @PostMapping("/execute/{id}")
    public void execute(@PathVariable String id, @RequestBody Map<String, String> payload) {
        PprScheduleTaskEntity entity = scheduleTaskMapper.selectById(id);
        if (entity != null) {
            String tempEmail = payload.get("email");
            if (tempEmail != null && !tempEmail.trim().isEmpty()) {
                entity.setReceivers(tempEmail);
            }
            // 异步执行避免阻塞接口
            new Thread(() -> {
                taskExecutor.execute(entity);
            }).start();
        } else {
            throw new IllegalArgumentException("Task not found");
        }
    }
}
