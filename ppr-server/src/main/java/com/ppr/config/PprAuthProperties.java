package com.ppr.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ppr")
public class PprAuthProperties {

    private Auth auth = new Auth();
    private AdminKey adminKey = new AdminKey();

    public Auth getAuth() {
        return auth;
    }

    public void setAuth(Auth auth) {
        this.auth = auth;
    }

    public AdminKey getAdminKey() {
        return adminKey;
    }

    public void setAdminKey(AdminKey adminKey) {
        this.adminKey = adminKey;
    }

    public static class Auth {
        private boolean enabled = false;
        private String hostUrl;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getHostUrl() {
            return hostUrl;
        }

        public void setHostUrl(String hostUrl) {
            this.hostUrl = hostUrl;
        }
    }

    public static class AdminKey {
        private boolean enabled = true;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }
}
