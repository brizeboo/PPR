package com.ppr.infra.auth;

import com.ppr.config.PprAuthProperties;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * 管理员密钥服务，负责管理和验证系统的管理员访问密钥
 */
@Component
public class AdminKeyService {

    /**
     * 日志记录器
     */
    private static final Logger log = LoggerFactory.getLogger(AdminKeyService.class);

    /**
     * 权限相关配置属性
     */
    private final PprAuthProperties authProperties;
    
    /**
     * 当前使用的管理员密钥
     */
    private String adminKey;

    /**
     * 允许访问的IP列表，为空表示不限制
     */
    private java.util.Set<String> allowedIpSet;

    /**
     * 构造函数注入配置属性
     * @param authProperties 权限配置属性
     */
    public AdminKeyService(PprAuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    /**
     * 初始化方法，从配置文件中读取管理员密钥和允许的IP列表
     */
    @PostConstruct
    public void init() {
        if (authProperties.getAdmin().isEnabled()) {
            this.adminKey = authProperties.getAdmin().getAdminKey();
            if (this.adminKey == null || this.adminKey.trim().isEmpty()) {
                log.info("PPR Admin page is enabled without an admin key.");
                this.adminKey = null; // 设置为空，表示不需要密钥
            } else {
                log.info("PPR Admin Key loaded from configuration.");
            }
            
            // 初始化允许的IP列表
            String allowedIpsConfig = authProperties.getAdmin().getAllowedIps();
            if (allowedIpsConfig == null || allowedIpsConfig.trim().isEmpty() || "0.0.0.0".equals(allowedIpsConfig.trim())) {
                this.allowedIpSet = null; // 不限制IP
                log.info("Admin IP restriction is disabled (allowed-ips is empty or 0.0.0.0).");
            } else {
                this.allowedIpSet = new java.util.HashSet<>();
                String[] ips = allowedIpsConfig.split(",");
                for (String ip : ips) {
                    if (!ip.trim().isEmpty()) {
                        this.allowedIpSet.add(ip.trim());
                    }
                }
                log.info("Admin IP restriction is enabled. Allowed IPs: {}", this.allowedIpSet);
            }
        } else {
            log.info("PPR Admin page is disabled.");
        }
    }

    /**
     * 验证传入的密钥是否有效
     * @param key 待验证的密钥字符串
     * @return 验证通过返回 true，否则返回 false
     */
    public boolean verifyKey(String key) {
        if (!authProperties.getAdmin().isEnabled()) {
            return false; // 如果未开启管理页面，直接返回false，拦截器会有处理
        }
        if (this.adminKey == null) {
            return true; // 如果开启了管理页面但未配置密钥，直接放行
        }
        return this.adminKey.equals(key);
    }

    /**
     * 验证请求的IP是否被允许访问控制台
     * @param ip 客户端请求IP
     * @return 如果允许访问返回 true，否则返回 false
     */
    public boolean verifyIp(String ip) {
        if (!authProperties.getAdmin().isEnabled()) {
             return false;
        }
        if (this.allowedIpSet == null || this.allowedIpSet.isEmpty()) {
            return true;
        }
        return ip != null && this.allowedIpSet.contains(ip.trim());
    }

    /**
     * 检查系统是否启用了管理员密钥验证
     * @return 启用返回 true，否则返回 false
     */
    public boolean isEnabled() {
        return authProperties.getAdmin().isEnabled();
    }
    
    /**
     * 检查系统是否配置了管理员密钥
     * @return 配置了返回 true，否则返回 false
     */
    public boolean hasKey() {
        return this.adminKey != null;
    }
}