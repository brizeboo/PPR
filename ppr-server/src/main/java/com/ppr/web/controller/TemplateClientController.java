package com.ppr.web.controller;

import com.ppr.infra.meta.entity.PprExcelTemplateEntity;
import com.ppr.infra.meta.mapper.PprExcelTemplateMapper;
import com.ppr.infra.meta.service.ExcelTemplateRenderer;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/template")
public class TemplateClientController {

    private final PprExcelTemplateMapper templateMapper;
    private final ExcelTemplateRenderer templateRenderer;

    public TemplateClientController(PprExcelTemplateMapper templateMapper, ExcelTemplateRenderer templateRenderer) {
        this.templateMapper = templateMapper;
        this.templateRenderer = templateRenderer;
    }

    /**
     * 模板直出引擎 (脱机渲染)
     */
    @PostMapping("/export/{templateId}")
    public void export(@PathVariable("templateId") String templateId,
                       @RequestBody Map<String, Object> data,
                       HttpServletResponse response) throws IOException {
        
        PprExcelTemplateEntity template = templateMapper.selectById(templateId);
        if (template == null) {
            throw new IllegalArgumentException("Template not found");
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        String fileName = URLEncoder.encode(template.getName(), StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName);

        templateRenderer.render(template, data, response.getOutputStream());
    }

    /**
     * 获取模板详情
     */
    @GetMapping("/{templateId}")
    public PprExcelTemplateEntity getTemplate(@PathVariable("templateId") String templateId) {
        return templateMapper.selectById(templateId);
    }

    /**
     * 下载模板文件
     */
    @GetMapping("/file/{templateId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("templateId") String templateId) {
        PprExcelTemplateEntity template = templateMapper.selectById(templateId);
        if (template == null) {
            throw new IllegalArgumentException("Template not found");
        }
        File file = new File(template.getFilePath());
        if (!file.exists()) {
            throw new IllegalArgumentException("File not found");
        }
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + template.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}