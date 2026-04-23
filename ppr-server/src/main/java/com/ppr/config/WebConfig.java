package com.ppr.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import com.ppr.infra.auth.AuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
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

        // 管理控制台的 Sa-Token 管理员密钥鉴权
        registry.addInterceptor(new SaInterceptor(handle -> {
            if (authProperties.getAdminKey().isEnabled()) {
                SaRouter.match("/api/v1/admin/**")
                        .notMatch("/api/v1/admin/auth/verify")
                        .notMatch("/api/v1/admin/auth/status")
                        .check(r -> StpUtil.checkLogin());
            }
        })).addPathPatterns("/api/v1/admin/**");
    }
}
