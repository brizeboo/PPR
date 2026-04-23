package com.ppr.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * PPR权限相关配置属性类
 */
@Configuration
@ConfigurationProperties(prefix = "ppr")
public class PprAuthProperties {

    /**
     * 权限验证配置
     */
    private Auth auth = new Auth();
    
    /**
     * 管理员配置
     */
    private Admin admin = new Admin();

    /**
     * 获取权限验证配置
     * @return 权限验证配置对象
     */
    public Auth getAuth() {
        return auth;
    }

    /**
     * 设置权限验证配置
     * @param auth 权限验证配置对象
     */
    public void setAuth(Auth auth) {
        this.auth = auth;
    }

    /**
     * 获取管理员配置
     * @return 管理员配置对象
     */
    public Admin getAdmin() {
        return admin;
    }

    /**
     * 设置管理员配置
     * @param admin 管理员配置对象
     */
    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    /**
     * 权限验证内部配置类
     */
    public static class Auth {
        /**
         * 是否启用权限验证
         */
        private boolean enabled = false;
        
        /**
         * 权限验证的主机地址
         */
        private String hostUrl;

        /**
         * 获取是否启用权限验证
         * @return 是否启用
         */
        public boolean isEnabled() {
            return enabled;
        }

        /**
         * 设置是否启用权限验证
         * @param enabled 是否启用
         */
        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        /**
         * 获取权限验证的主机地址
         * @return 主机地址
         */
        public String getHostUrl() {
            return hostUrl;
        }

        /**
         * 设置权限验证的主机地址
         * @param hostUrl 主机地址
         */
        public void setHostUrl(String hostUrl) {
            this.hostUrl = hostUrl;
        }
    }

    /**
     * 管理员配置类
     */
    public static class Admin {
        /**
         * 是否开启管理员管理页面
         */
        private boolean enabled = true;

        /**
         * 管理员密钥的值，如果为空，代表不需要管理员密钥
         */
        private String adminKey;

        /**
         * 允许访问控制台的IP列表，多个IP用逗号分隔
         * 如果配置为 0.0.0.0 或者为空，则表示不限制IP
         */
        private String allowedIps;

        /**
         * 获取是否开启管理员管理页面
         * @return 是否开启
         */
        public boolean isEnabled() {
            return enabled;
        }

        /**
         * 设置是否开启管理员管理页面
         * @param enabled 是否开启
         */
        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        /**
         * 获取管理员密钥的值
         * @return 管理员密钥的值
         */
        public String getAdminKey() {
            return adminKey;
        }

        /**
         * 设置管理员密钥的值
         * @param adminKey 管理员密钥的值
         */
        public void setAdminKey(String adminKey) {
            this.adminKey = adminKey;
        }

        /**
         * 获取允许访问的IP列表
         * @return 允许访问的IP列表
         */
        public String getAllowedIps() {
            return allowedIps;
        }

        /**
         * 设置允许访问的IP列表
         * @param allowedIps 允许访问的IP列表
         */
        public void setAllowedIps(String allowedIps) {
            this.allowedIps = allowedIps;
        }
    }
}
