package com.ppr.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.datasource.DataSourceService;
import com.ppr.infra.meta.entity.PprDatasourceEntity;
import com.ppr.infra.meta.mapper.PprDatasourceMapper;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StartupDataSourceLoader implements ApplicationRunner {
    private final PprDatasourceMapper datasourceMapper;
    private final DataSourceService dataSourceService;

    public StartupDataSourceLoader(PprDatasourceMapper datasourceMapper, DataSourceService dataSourceService) {
        this.datasourceMapper = datasourceMapper;
        this.dataSourceService = dataSourceService;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<PprDatasourceEntity> datasources = datasourceMapper.selectList(new LambdaQueryWrapper<>());
        for (PprDatasourceEntity ds : datasources) {
            if (ds == null || ds.getId() == null || ds.getId().isBlank()) {
                continue;
            }
            if ("meta".equals(ds.getId())) {
                continue;
            }
            dataSourceService.addOrUpdateDataSource(ds);
        }
    }
}

