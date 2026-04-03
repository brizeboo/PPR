package com.ppr.infra.auth;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.ppr.config.PprAuthProperties;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class HostSystemAuthService {

    private final PprAuthProperties authProperties;

    // Cache: Token -> AuthResult
    private final Cache<String, AuthResult> authCache = Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(1000)
            .build();

    public HostSystemAuthService(PprAuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    public AuthResult getAuthResult(String token) {
        if (!authProperties.isEnabled()) {
            return new AuthResult(true, List.of(), null);
        }

        return authCache.get(token, this::fetchFromHostSystem);
    }

    private AuthResult fetchFromHostSystem(String token) {
        // Mock external API call
        if (token == null || token.isBlank()) {
            return new AuthResult(false, List.of(), null);
        }
        
        // Return dummy data for M2 testing
        // In real world, use RestTemplate to call authProperties.getHostUrl()
        if ("mock-valid-token".equals(token)) {
            return new AuthResult(true, List.of("report:sales:view", "report:sales:edit"), "dept_id IN (1,2)");
        }
        
        return new AuthResult(false, List.of(), null);
    }

    public static class AuthResult {
        private boolean valid;
        private List<String> permissions;
        private String dataScope;

        public AuthResult(boolean valid, List<String> permissions, String dataScope) {
            this.valid = valid;
            this.permissions = permissions;
            this.dataScope = dataScope;
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getPermissions() {
            return permissions;
        }

        public String getDataScope() {
            return dataScope;
        }
    }
}
