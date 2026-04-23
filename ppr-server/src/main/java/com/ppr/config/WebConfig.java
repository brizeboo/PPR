package com.ppr.config;

import com.ppr.infra.auth.AuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web 配置类，配置拦截器等
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 主系统权限拦截器
     */
    private final AuthInterceptor authInterceptor;

    /**
     * 系统权限及管理员配置属性
     */
    private final PprAuthProperties authProperties;

    public WebConfig(AuthInterceptor authInterceptor, PprAuthProperties authProperties) {
        this.authInterceptor = authInterceptor;
        this.authProperties = authProperties;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 主系统鉴权（针对前端报表查看/导出等，配置为不拦截 /api/v1/admin/**）
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/v1/report/data/**")
                .excludePathPatterns("/api/v1/admin/**");

        // 管理控制台的管理员密钥鉴权（仅检测密钥，不检测权限 token）
        registry.addInterceptor(new org.springframework.web.servlet.HandlerInterceptor() {
            @Override
            public boolean preHandle(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, Object handler) throws Exception {
                if (!authProperties.getAdmin().isEnabled()) {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"success\":false,\"code\":\"ADMIN_DISABLED\",\"message\":\"管理页面已禁用\"}");
                    return false;
                }
                
                String uri = request.getRequestURI();
                if (uri.startsWith("/api/v1/admin/auth/")) {
                    return true; // 登录、状态接口放行
                }
                
                // 从请求头获取密钥，前端默认将 key 存储在 localStorage 并放在 satoken 头中发送
                String key = request.getHeader("satoken");
                if (key == null || key.isBlank()) {
                     key = request.getHeader("adminKey");
                 }
                 
                 // 使用 Spring 的 ApplicationContext 获取 AdminKeyService Bean
                 org.springframework.context.ApplicationContext context = org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(request.getServletContext());
                com.ppr.infra.auth.AdminKeyService adminKeyService = context.getBean(com.ppr.infra.auth.AdminKeyService.class);
                
                // 验证访问IP
                String ip = getClientIp(request);
                if (!adminKeyService.verifyIp(ip)) {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"success\":false,\"code\":\"IP_NOT_ALLOWED\",\"message\":\"IP 地址不在允许的访问列表中\"}");
                    return false;
                }
                
                if (adminKeyService.verifyKey(key)) {
                    return true;
                }
                
                // 校验不通过时，返回 HTTP 200 并在响应体中包含错误信息，以供前端弹出管理员密钥输入框
                response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_OK);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":false,\"code\":\"ADMIN_KEY_INVALID\",\"message\":\"管理员密钥验证失败\"}");
                return false;
            }
        }).addPathPatterns("/api/v1/admin/**");
    }

    /**
     * 获取客户端真实 IP 地址
     * 考虑了经过 Nginx 等反向代理的情况
     * @param request HTTP 请求
     * @return 客户端 IP 地址
     */
    private String getClientIp(jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_CLUSTER_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_VIA");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("REMOTE_ADDR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 如果是多级代理，取第一个 IP 为客户端真实 IP
        if (ip != null && ip.indexOf(",") != -1) {
            ip = ip.substring(0, ip.indexOf(",")).trim();
        }
        return ip;
    }
}
