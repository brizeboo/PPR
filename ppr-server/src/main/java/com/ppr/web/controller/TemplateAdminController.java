package com.ppr.web.controller;

import com.ppr.infra.meta.entity.PprExcelTemplateEntity;
import com.ppr.infra.meta.mapper.PprExcelTemplateMapper;
import com.ppr.web.dto.TemplateMappingUpdateRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/template")
public class TemplateAdminController {

    private final PprExcelTemplateMapper templateMapper;

    @Value("${ppr.upload.dir:./uploads/templates}")
    private String uploadDir;

    public TemplateAdminController(PprExcelTemplateMapper templateMapper) {
        this.templateMapper = templateMapper;
    }

    /**
     * 获取所有模板
     */
    @GetMapping("/list")
    public List<PprExcelTemplateEntity> list() {
        return templateMapper.selectList(null);
    }

    /**
     * 上传 Excel 模板文件
     */
    @PostMapping("/upload")
    public PprExcelTemplateEntity upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        File dir = new File(uploadDir);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("无法创建上传目录");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String id = UUID.randomUUID().toString().replace("-", "");
        String fileName = id + extension;
        File dest = new File(dir, fileName);
        
        file.transferTo(dest);

        PprExcelTemplateEntity entity = new PprExcelTemplateEntity();
        entity.setId(id);
        entity.setName(originalFilename);
        entity.setFilePath(dest.getAbsolutePath());
        templateMapper.insert(entity);

        return entity;
    }

    /**
     * 保存模板映射配置
     */
    @PostMapping("/mapping/{templateId}")
    public PprExcelTemplateEntity saveMapping(@PathVariable("templateId") String templateId,
                                              @RequestBody TemplateMappingUpdateRequest request) {
        PprExcelTemplateEntity entity = templateMapper.selectById(templateId);
        if (entity == null) {
            throw new IllegalArgumentException("模板不存在");
        }

        entity.setMappingConfig(request.getMappingConfig());
        templateMapper.updateById(entity);

        return entity;
    }
}