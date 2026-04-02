package com.ppr.infra.datasource;

import com.baomidou.dynamic.datasource.DynamicRoutingDataSource;
import com.baomidou.dynamic.datasource.creator.DataSourceCreator;
import com.baomidou.dynamic.datasource.creator.DataSourceProperty;
import com.baomidou.dynamic.datasource.toolkit.DynamicDataSourceContextHolder;
import com.ppr.infra.meta.entity.PprDatasourceEntity;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Service
public class DataSourceService {
    private final DynamicRoutingDataSource routingDataSource;
    private final DataSourceCreator dataSourceCreator;

    public DataSourceService(DataSource dataSource,
                             @Qualifier("hikariDataSourceCreator") DataSourceCreator dataSourceCreator) {
        this.routingDataSource = (DynamicRoutingDataSource) dataSource;
        this.dataSourceCreator = dataSourceCreator;
    }

    public boolean testConnection(String jdbcUrl, String username, String password) {
        try (Connection ignored = DriverManager.getConnection(jdbcUrl, username, password)) {
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void addOrUpdateDataSource(PprDatasourceEntity datasource) {
        if (datasource == null || datasource.getId() == null) {
            throw new IllegalArgumentException("datasource.id 不能为空");
        }

        DataSourceProperty prop = new DataSourceProperty();
        prop.setUrl(datasource.getJdbcUrl());
        prop.setUsername(datasource.getUsername());
        prop.setPassword(datasource.getPassword());

        DataSource ds = dataSourceCreator.createDataSource(prop);
        routingDataSource.addDataSource(datasource.getId(), ds);
    }

    public void removeDataSource(String datasourceId) {
        routingDataSource.removeDataSource(datasourceId);
    }

    public void runInDataSource(String datasourceId, Runnable runnable) {
        DynamicDataSourceContextHolder.push(datasourceId);
        try {
            runnable.run();
        } finally {
            DynamicDataSourceContextHolder.poll();
        }
    }
}

