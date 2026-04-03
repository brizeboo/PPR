package com.ppr.infra.auth;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ppr.config.PprAuthProperties;
import com.ppr.infra.meta.entity.PprPermissionEntity;
import com.ppr.infra.meta.mapper.PprPermissionMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.List;
import java.util.Map;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final PprAuthProperties authProperties;
    private final HostSystemAuthService hostSystemAuthService;
    private final PprPermissionMapper permissionMapper;

    public AuthInterceptor(PprAuthProperties authProperties, HostSystemAuthService hostSystemAuthService, PprPermissionMapper permissionMapper) {
        this.authProperties = authProperties;
        this.hostSystemAuthService = hostSystemAuthService;
        this.permissionMapper = permissionMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!authProperties.isEnabled()) {
            return true;
        }

        String token = request.getHeader("Authorization");
        if (token == null || token.isBlank()) {
            token = request.getHeader("token");
        }
        if (token == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        HostSystemAuthService.AuthResult authResult = hostSystemAuthService.getAuthResult(token);
        if (!authResult.isValid()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        // Store data scope in thread local
        AuthContextHolder.setAuthResult(authResult);

        // Path variables can be used to check reportId permission
        Map<String, String> pathVariables = (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        if (pathVariables != null && pathVariables.containsKey("reportId")) {
            String reportId = pathVariables.get("reportId");
            List<PprPermissionEntity> permissions = permissionMapper.selectList(
                    new LambdaQueryWrapper<PprPermissionEntity>().eq(PprPermissionEntity::getReportId, reportId)
            );
            
            if (!permissions.isEmpty()) {
                boolean hasPermission = false;
                for (PprPermissionEntity p : permissions) {
                    if (authResult.getPermissions().contains(p.getAuthChar())) {
                        hasPermission = true;
                        break;
                    }
                }
                if (!hasPermission) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    return false;
                }
            }
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        AuthContextHolder.clear();
    }
}
