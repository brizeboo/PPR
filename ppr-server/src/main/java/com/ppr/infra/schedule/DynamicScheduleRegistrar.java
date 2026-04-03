package com.ppr.infra.schedule;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ppr.infra.meta.entity.PprScheduleTaskEntity;
import com.ppr.infra.meta.mapper.PprScheduleTaskMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.config.Task;
import org.springframework.scheduling.config.CronTask;
import org.springframework.scheduling.config.ScheduledTask;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 动态调度任务注册器
 */
@Component
@EnableScheduling
public class DynamicScheduleRegistrar implements SchedulingConfigurer {

    private static final Logger log = LoggerFactory.getLogger(DynamicScheduleRegistrar.class);

    private final PprScheduleTaskMapper scheduleTaskMapper;
    
    // 我们可能需要将执行逻辑抽离，暂存依赖
    private final ScheduleTaskExecutor taskExecutor;

    private ScheduledTaskRegistrar taskRegistrar;

    private final Map<String, ScheduledTask> scheduledTasks = new ConcurrentHashMap<>();

    public DynamicScheduleRegistrar(PprScheduleTaskMapper scheduleTaskMapper, ScheduleTaskExecutor taskExecutor) {
        this.scheduleTaskMapper = scheduleTaskMapper;
        this.taskExecutor = taskExecutor;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        this.taskRegistrar = taskRegistrar;
    }

    @PostConstruct
    public void initTasks() {
        // 项目启动时，加载所有状态为1（运行中）的任务
        List<PprScheduleTaskEntity> tasks = scheduleTaskMapper.selectList(new QueryWrapper<PprScheduleTaskEntity>().eq("status", 1));
        for (PprScheduleTaskEntity task : tasks) {
            addTask(task);
        }
    }

    public void addTask(PprScheduleTaskEntity taskEntity) {
        if (taskEntity.getStatus() == 0) {
            return;
        }
        if (scheduledTasks.containsKey(taskEntity.getId())) {
            removeTask(taskEntity.getId());
        }

        CronTask cronTask = new CronTask(() -> {
            taskExecutor.execute(taskEntity);
        }, taskEntity.getCron());

        if (taskRegistrar != null) {
            ScheduledTask scheduledTask = taskRegistrar.scheduleCronTask(cronTask);
            if (scheduledTask != null) {
                scheduledTasks.put(taskEntity.getId(), scheduledTask);
                log.info("Started schedule task: id={}, cron={}", taskEntity.getId(), taskEntity.getCron());
            }
        }
    }

    public void removeTask(String taskId) {
        ScheduledTask scheduledTask = scheduledTasks.remove(taskId);
        if (scheduledTask != null) {
            scheduledTask.cancel(false);
            log.info("Stopped schedule task: id={}", taskId);
        }
    }

    public boolean hasTask(String taskId) {
        return scheduledTasks.containsKey(taskId);
    }
}
