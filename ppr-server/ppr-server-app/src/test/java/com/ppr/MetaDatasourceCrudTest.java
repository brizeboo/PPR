package com.ppr;

import com.ppr.infra.meta.entity.PprDatasourceEntity;
import com.ppr.infra.meta.mapper.PprDatasourceMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

@SpringBootTest(properties = {
        "spring.datasource.dynamic.datasource.meta.url=jdbc:sqlite:./target/test-meta.db"
})
public class MetaDatasourceCrudTest {
    @Autowired
    private PprDatasourceMapper datasourceMapper;

    @Test
    void crud() {
        String id = UUID.randomUUID().toString().replace("-", "");

        PprDatasourceEntity entity = new PprDatasourceEntity();
        entity.setId(id);
        entity.setName("test");
        entity.setType("SQLite");
        entity.setJdbcUrl("jdbc:sqlite:./target/test-biz.db");
        entity.setUsername("");
        entity.setPassword("");

        int inserted = datasourceMapper.insert(entity);
        Assertions.assertEquals(1, inserted);

        PprDatasourceEntity loaded = datasourceMapper.selectById(id);
        Assertions.assertNotNull(loaded);
        Assertions.assertEquals("test", loaded.getName());

        loaded.setName("test2");
        int updated = datasourceMapper.updateById(loaded);
        Assertions.assertEquals(1, updated);

        PprDatasourceEntity loaded2 = datasourceMapper.selectById(id);
        Assertions.assertEquals("test2", loaded2.getName());

        int deleted = datasourceMapper.deleteById(id);
        Assertions.assertEquals(1, deleted);
    }
}

