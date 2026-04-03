package com.ppr.infra.meta.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ppr.infra.meta.entity.PprScheduleTaskEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 定时任务 Mapper
 */
@Mapper
public interface PprScheduleTaskMapper extends BaseMapper<PprScheduleTaskEntity> {
}
