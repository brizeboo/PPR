package com.ppr.infra.auth;

import com.ppr.config.PprAuthProperties;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AdminKeyService {

    private static final Logger log = LoggerFactory.getLogger(AdminKeyService.class);

    private final PprAuthProperties authProperties;
    private String adminKey;

    public AdminKeyService(PprAuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @PostConstruct
    public void init() {
        if (authProperties.getAdminKey().isEnabled()) {
            this.adminKey = UUID.randomUUID().toString().replace("-", "");
            log.info("=========================================================");
            log.info("PPR Admin Key generated: {}", this.adminKey);
            log.info("Please use this key to access the admin console.");
            log.info("=========================================================");
        }
    }

    public boolean verifyKey(String key) {
        if (!authProperties.getAdminKey().isEnabled()) {
            return true;
        }
        return this.adminKey != null && this.adminKey.equals(key);
    }

    public boolean isEnabled() {
        return authProperties.getAdminKey().isEnabled();
    }
}