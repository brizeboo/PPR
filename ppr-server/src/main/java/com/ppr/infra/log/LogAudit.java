package com.ppr.infra.log;

import java.lang.annotation.*;

/**
 * 日志审计注解
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LogAudit {
    
    /**
     * 操作类型
     */
    String value() default "";
}
