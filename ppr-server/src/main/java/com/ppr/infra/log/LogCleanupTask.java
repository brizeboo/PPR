package com.ppr.infra.log;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ppr.infra.meta.entity.PprLogEntity;
import com.ppr.infra.meta.mapper.PprLogMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 日志清理定时任务
 */
@Component
public class LogCleanupTask {

    private static final Logger log = LoggerFactory.getLogger(LogCleanupTask.class);

    private final PprLogMapper logMapper;

    public LogCleanupTask(PprLogMapper logMapper) {
        this.logMapper = logMapper;
    }

    /**
     * 每天凌晨2点执行，清理30天前的日志
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldLogs() {
        long thirtyDaysAgo = System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000;
        
        try {
            int deleted = logMapper.delete(new QueryWrapper<PprLogEntity>().lt("time", thirtyDaysAgo));
            log.info("Successfully cleaned up {} log records older than 30 days.", deleted);
        } catch (Exception e) {
            log.error("Failed to clean up old logs", e);
        }
    }
}
