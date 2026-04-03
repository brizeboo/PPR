package com.ppr.infra.auth;

public class AuthContextHolder {
    private static final ThreadLocal<HostSystemAuthService.AuthResult> contextHolder = new ThreadLocal<>();

    public static void setAuthResult(HostSystemAuthService.AuthResult result) {
        contextHolder.set(result);
    }

    public static HostSystemAuthService.AuthResult getAuthResult() {
        return contextHolder.get();
    }

    public static void clear() {
        contextHolder.remove();
    }
}
