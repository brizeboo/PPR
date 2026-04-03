package com.ppr.infra.log;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ppr.infra.meta.entity.PprLogEntity;
import com.ppr.infra.meta.mapper.PprLogMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * 日志切面
 */
@Aspect
@Component
public class LogAspect {

    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);

    private final PprLogMapper pprLogMapper;
    private final ObjectMapper objectMapper;

    public LogAspect(PprLogMapper pprLogMapper) {
        this.pprLogMapper = pprLogMapper;
        this.objectMapper = new ObjectMapper();
    }

    @Around("@annotation(logAudit)")
    public Object around(ProceedingJoinPoint joinPoint, LogAudit logAudit) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = null;
        String errorMsg = null;
        try {
            result = joinPoint.proceed();
            return result;
        } catch (Throwable e) {
            errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.length() > 500) {
                errorMsg = errorMsg.substring(0, 500);
            }
            throw e;
        } finally {
            long costMs = System.currentTimeMillis() - startTime;
            saveLog(joinPoint, logAudit, costMs, errorMsg);
        }
    }

    private void saveLog(ProceedingJoinPoint joinPoint, LogAudit logAudit, long costMs, String errorMsg) {
        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String methodName = signature.getDeclaringTypeName() + "." + signature.getName();
            
            String params = "";
            Object[] args = joinPoint.getArgs();
            if (args != null && args.length > 0) {
                try {
                    Object[] filteredArgs = java.util.Arrays.stream(args)
                            .filter(arg -> !(arg instanceof jakarta.servlet.http.HttpServletRequest) 
                                    && !(arg instanceof jakarta.servlet.http.HttpServletResponse))
                            .toArray();
                    params = objectMapper.writeValueAsString(filteredArgs);
                } catch (Exception e) {
                    params = "Unserializable params";
                }
            }

            String ip = "unknown";
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ip = request.getRemoteAddr();
            }

            PprLogEntity logEntity = new PprLogEntity();
            logEntity.setId(UUID.randomUUID().toString());
            logEntity.setType(logAudit.value());
            logEntity.setMethod(methodName);
            logEntity.setParams(params);
            logEntity.setIp(ip);
            logEntity.setTime(System.currentTimeMillis());
            logEntity.setCostMs(costMs);
            logEntity.setErrorMsg(errorMsg);
            
            // 获取当前操作人（可以从 AuthContextHolder 中获取，假设存在的话）
            // logEntity.setOperator(AuthContextHolder.getAuthResult() != null ? ... : "anonymous");
            logEntity.setOperator("system");

            // 异步保存
            CompletableFuture.runAsync(() -> {
                try {
                    pprLogMapper.insert(logEntity);
                } catch (Exception e) {
                    log.error("Failed to save log", e);
                }
            });
        } catch (Exception e) {
            log.error("Error in LogAspect", e);
        }
    }
}
