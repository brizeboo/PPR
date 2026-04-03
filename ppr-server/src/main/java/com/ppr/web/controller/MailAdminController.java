package com.ppr.web.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ppr.infra.mail.MailService;
import com.ppr.infra.meta.entity.PprMailConfigEntity;
import com.ppr.infra.meta.mapper.PprMailConfigMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.ppr.infra.log.LogAudit;

@RestController
@RequestMapping("/api/v1/admin/mail")
public class MailAdminController {

    private final PprMailConfigMapper mailConfigMapper;
    private final MailService mailService;

    public MailAdminController(PprMailConfigMapper mailConfigMapper, MailService mailService) {
        this.mailConfigMapper = mailConfigMapper;
        this.mailService = mailService;
    }

    @GetMapping("/config")
    public PprMailConfigEntity getConfig() {
        List<PprMailConfigEntity> configs = mailConfigMapper.selectList(new QueryWrapper<>());
        if (!configs.isEmpty()) {
            return configs.get(0);
        }
        return null;
    }

    @LogAudit("保存邮件配置")
    @PostMapping("/save")
    public void saveConfig(@RequestBody PprMailConfigEntity entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(UUID.randomUUID().toString());
            mailConfigMapper.insert(entity);
        } else {
            mailConfigMapper.updateById(entity);
        }
        // 重新初始化邮件发送器
        mailService.initMailSender();
    }

    @PostMapping("/test")
    public void testSend(@RequestBody Map<String, String> payload) {
        String to = payload.get("to");
        if (to == null || to.isEmpty()) {
            throw new IllegalArgumentException("收件人不能为空");
        }
        mailService.sendEmailWithAttachment(to, null, "PPR 邮件测试", "这是一封来自 PPR 系统的测试邮件。", "test.txt", "Hello World!".getBytes());
    }
}
