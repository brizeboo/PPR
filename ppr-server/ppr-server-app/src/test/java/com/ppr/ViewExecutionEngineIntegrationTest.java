package com.ppr;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.infra.datasource.DataSourceService;
import com.ppr.infra.jdbc.ViewExecutionEngine;
import com.ppr.infra.jdbc.ViewExecutionResult;
import com.ppr.infra.meta.entity.PprDatasourceEntity;
import com.ppr.infra.meta.entity.PprViewEntity;
import com.ppr.infra.meta.entity.PprViewParamEntity;
import com.ppr.infra.meta.mapper.PprDatasourceMapper;
import com.ppr.infra.meta.mapper.PprViewMapper;
import com.ppr.infra.meta.mapper.PprViewParamMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@SpringBootTest(properties = {
        "spring.datasource.dynamic.datasource.meta.url=jdbc:sqlite:./target/test-meta.db"
})
public class ViewExecutionEngineIntegrationTest {
    @Autowired
    private DataSourceService dataSourceService;
    @Autowired
    private PprDatasourceMapper datasourceMapper;
    @Autowired
    private PprViewMapper viewMapper;
    @Autowired
    private PprViewParamMapper viewParamMapper;
    @Autowired
    private ViewExecutionEngine viewExecutionEngine;

    @Test
    void executeOnExternalSqlite() throws Exception {
        Path bizDb = Path.of("./target/test-biz.db");
        Files.deleteIfExists(bizDb);

        try (Connection conn = DriverManager.getConnection("jdbc:sqlite:" + bizDb.toString());
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate("CREATE TABLE t_user (id INTEGER PRIMARY KEY, name TEXT)");
            stmt.executeUpdate("INSERT INTO t_user(id, name) VALUES (1, 'Alice')");
        }

        String dsId = UUID.randomUUID().toString().replace("-", "");
        PprDatasourceEntity ds = new PprDatasourceEntity();
        ds.setId(dsId);
        ds.setName("biz");
        ds.setType("SQLite");
        ds.setJdbcUrl("jdbc:sqlite:" + bizDb.toString());
        ds.setUsername("");
        ds.setPassword("");
        datasourceMapper.insert(ds);
        dataSourceService.addOrUpdateDataSource(ds);

        String viewId = UUID.randomUUID().toString().replace("-", "");
        PprViewEntity view = new PprViewEntity();
        view.setId(viewId);
        view.setDatasourceId(dsId);
        view.setName("userById");
        view.setSqlContent("select id, name from t_user where id = #{id}");
        viewMapper.insert(view);

        PprViewParamEntity param = new PprViewParamEntity();
        param.setId(UUID.randomUUID().toString().replace("-", ""));
        param.setViewId(viewId);
        param.setParamName("id");
        param.setParamType("Number");
        param.setDictCode(null);
        param.setIsRequired(true);
        viewParamMapper.insert(param);

        List<PprViewParamEntity> defs = viewParamMapper.selectList(new LambdaQueryWrapper<PprViewParamEntity>().eq(PprViewParamEntity::getViewId, viewId));
        ViewExecutionResult result = viewExecutionEngine.execute(dsId, view.getSqlContent(), defs, Map.of("id", 1));

        Assertions.assertEquals(List.of("id", "name"), result.getColumns());
        Assertions.assertEquals(1, result.getRows().size());
        Assertions.assertEquals("Alice", String.valueOf(result.getRows().get(0).get("name")));
    }
}

