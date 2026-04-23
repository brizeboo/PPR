package com.ppr.web.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ppr.infra.auth.AdminKeyService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/auth")
public class AdminAuthController {

    private final AdminKeyService adminKeyService;

    public AdminAuthController(AdminKeyService adminKeyService) {
        this.adminKeyService = adminKeyService;
    }

    /**
     * 验证管理员密钥，并生成对应的 Token 登录状态
     */
    @PostMapping("/verify")
    public Map<String, Object> verifyKey(@RequestBody Map<String, String> payload) {
        String key = payload.get("adminKey");
        boolean valid = adminKeyService.verifyKey(key);
        Map<String, Object> result = new HashMap<>();
        if (valid) {
            // 使用 Sa-Token 登录
            StpUtil.login("admin");
            result.put("success", true);
            result.put("token", StpUtil.getTokenValue());
        } else {
            result.put("success", false);
            result.put("message", "Invalid admin key");
        }
        return result;
    }

    /**
     * 获取系统是否开启了管理员密钥鉴权
     */
    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> result = new HashMap<>();
        result.put("enabled", adminKeyService.isEnabled());
        return result;
    }
}