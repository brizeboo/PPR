package com.ppr;

import com.ppr.infra.sql.SqlSecurityValidator;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import org.junit.jupiter.api.Test;

public class SqlParseSmokeTest {
    @Test
    void parseSelectStarFrom() throws Exception {
        CCJSqlParserUtil.parse("select * from sample");
        new SqlSecurityValidator().validateSelectOnly("select * from sample");
    }
}
