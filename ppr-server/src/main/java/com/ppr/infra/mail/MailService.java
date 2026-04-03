package com.ppr.infra.mail;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ppr.infra.meta.entity.PprMailConfigEntity;
import com.ppr.infra.meta.mapper.PprMailConfigMapper;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Properties;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final PprMailConfigMapper mailConfigMapper;
    
    private JavaMailSenderImpl mailSender;

    public MailService(PprMailConfigMapper mailConfigMapper) {
        this.mailConfigMapper = mailConfigMapper;
        initMailSender();
    }

    public void initMailSender() {
        List<PprMailConfigEntity> configs = mailConfigMapper.selectList(new QueryWrapper<>());
        if (configs.isEmpty()) {
            log.warn("No mail configuration found, email sending is disabled.");
            this.mailSender = null;
            return;
        }

        PprMailConfigEntity config = configs.get(0);
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(config.getHost());
        sender.setPort(config.getPort());
        sender.setUsername(config.getUsername());
        sender.setPassword(config.getPassword());
        sender.setProtocol(StringUtils.hasText(config.getProtocol()) ? config.getProtocol() : "smtp");
        sender.setDefaultEncoding("UTF-8");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false");

        this.mailSender = sender;
        log.info("MailSender initialized with host: {}, username: {}", config.getHost(), config.getUsername());
    }

    public void sendEmailWithAttachment(String to, String cc, String subject, String content, String attachmentFilename, byte[] attachmentData) {
        if (this.mailSender == null) {
            log.error("MailSender is not initialized. Cannot send email to {}", to);
            throw new RuntimeException("Mail service is not configured.");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(mailSender.getUsername());
            
            if (StringUtils.hasText(to)) {
                helper.setTo(to.split(","));
            } else {
                throw new IllegalArgumentException("Recipient address is empty");
            }
            
            if (StringUtils.hasText(cc)) {
                helper.setCc(cc.split(","));
            }
            
            helper.setSubject(StringUtils.hasText(subject) ? subject : "PPR Report");
            helper.setText(StringUtils.hasText(content) ? content : "", true);
            
            if (attachmentData != null && attachmentData.length > 0) {
                helper.addAttachment(attachmentFilename, new ByteArrayResource(attachmentData));
            }
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
