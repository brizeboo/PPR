package com.ppr.infra.meta.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ppr.infra.meta.entity.PprReportEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 报表 Mapper
 */
@Mapper
public interface PprReportMapper extends BaseMapper<PprReportEntity> {
}
