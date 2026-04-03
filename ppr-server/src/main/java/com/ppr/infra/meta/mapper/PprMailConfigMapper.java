package com.ppr.infra.meta.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ppr.infra.meta.entity.PprMailConfigEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 邮件配置 Mapper
 */
@Mapper
public interface PprMailConfigMapper extends BaseMapper<PprMailConfigEntity> {
}
