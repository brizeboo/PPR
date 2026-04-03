package com.ppr.infra.meta.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ppr.infra.meta.entity.PprLogEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 系统日志 Mapper
 */
@Mapper
public interface PprLogMapper extends BaseMapper<PprLogEntity> {
}
