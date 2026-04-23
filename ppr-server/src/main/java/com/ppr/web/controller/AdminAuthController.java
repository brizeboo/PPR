package com.ppr.web.controller;

import com.ppr.infra.auth.AdminKeyService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理员认证控制器，提供管理员密钥验证接口
 */
@RestController
@RequestMapping("/api/v1/admin/auth")
public class AdminAuthController {

    /**
     * 管理员密钥服务
     */
    private final AdminKeyService adminKeyService;

    public AdminAuthController(AdminKeyService adminKeyService) {
        this.adminKeyService = adminKeyService;
    }

    /**
     * 验证管理员密钥
     */
    @PostMapping("/verify")
    public Map<String, Object> verifyKey(@RequestBody Map<String, String> payload) {
        String key = payload.get("adminKey");
        boolean valid = adminKeyService.verifyKey(key);
        Map<String, Object> result = new HashMap<>();
        if (valid) {
            result.put("success", true);
            result.put("token", key); // 直接返回 adminKey 作为 token
        } else {
            result.put("success", false);
            result.put("message", "Invalid admin key");
        }
        return result;
    }

    /**
     * 获取系统是否开启了管理员密钥鉴权及管理页面是否可用
     */
    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> result = new HashMap<>();
        result.put("enabled", adminKeyService.isEnabled()); // 是否开启管理页面
        result.put("hasKey", adminKeyService.hasKey()); // 是否需要密钥
        return result;
    }
}