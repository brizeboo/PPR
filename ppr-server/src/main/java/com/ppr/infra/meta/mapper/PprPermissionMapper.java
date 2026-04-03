package com.ppr.infra.meta.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ppr.infra.meta.entity.PprPermissionEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 权限 Mapper
 */
@Mapper
public interface PprPermissionMapper extends BaseMapper<PprPermissionEntity> {
}
