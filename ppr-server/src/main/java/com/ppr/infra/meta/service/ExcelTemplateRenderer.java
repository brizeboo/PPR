package com.ppr.infra.meta.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ppr.infra.meta.entity.PprExcelTemplateEntity;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

/**
 * Excel 模板渲染服务
 */
@Service
public class ExcelTemplateRenderer {

    public void render(PprExcelTemplateEntity template, Map<String, Object> data, OutputStream outputStream) throws IOException {
        String filePath = template.getFilePath();
        String mappingConfigStr = template.getMappingConfig();

        ObjectMapper mapper = new ObjectMapper();
        List<Map<String, Object>> mappingConfig = null;
        if (mappingConfigStr != null && !mappingConfigStr.isBlank()) {
            mappingConfig = mapper.readValue(mappingConfigStr, new TypeReference<List<Map<String, Object>>>() {});
        }

        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {
            
            Sheet sheet = workbook.getSheetAt(0);

            if (mappingConfig != null && !mappingConfig.isEmpty()) {
                for (Map<String, Object> config : mappingConfig) {
                    String type = (String) config.get("type"); // single, row, col
                    String field = (String) config.get("field");
                    int rowIndex = (int) config.get("row");
                    int colIndex = (int) config.get("col");

                    Object value = data.get(field);
                    if (value == null) continue;

                    if ("single".equals(type)) {
                        Row row = sheet.getRow(rowIndex);
                        if (row == null) row = sheet.createRow(rowIndex);
                        Cell cell = row.getCell(colIndex);
                        if (cell == null) cell = row.createCell(colIndex);
                        setCellValue(cell, value);
                    } else if ("row".equals(type) && value instanceof List) {
                        List<?> listData = (List<?>) value;
                        int currentListRowIndex = rowIndex;
                        
                        // 插入行逻辑 (此处简化，仅对行追加数据)
                        for (Object item : listData) {
                            Row row = sheet.getRow(currentListRowIndex);
                            if (row == null) {
                                // 若需移动下方行可用 sheet.shiftRows，这里直接创建
                                row = sheet.createRow(currentListRowIndex);
                            }
                            
                            Cell cell = row.getCell(colIndex);
                            if (cell == null) cell = row.createCell(colIndex);
                            
                            // 假设 item 就是基础类型，或将其 toString
                            if (item instanceof Map) {
                                // 提取 subField？若 mappingConfig 未提供 subField，默认 toString()
                                setCellValue(cell, item.toString());
                            } else {
                                setCellValue(cell, item);
                            }
                            currentListRowIndex++;
                        }
                    } else if ("col".equals(type) && value instanceof List) {
                        List<?> listData = (List<?>) value;
                        int currentListColIndex = colIndex;
                        Row row = sheet.getRow(rowIndex);
                        if (row == null) row = sheet.createRow(rowIndex);
                        
                        for (Object item : listData) {
                            Cell cell = row.getCell(currentListColIndex);
                            if (cell == null) cell = row.createCell(currentListColIndex);
                            
                            if (item instanceof Map) {
                                setCellValue(cell, item.toString());
                            } else {
                                setCellValue(cell, item);
                            }
                            currentListColIndex++;
                        }
                    }
                }
            }

            workbook.setForceFormulaRecalculation(true);
            workbook.write(outputStream);
        }
    }

    private void setCellValue(Cell cell, Object value) {
        if (value instanceof Number) {
            cell.setCellValue(((Number) value).doubleValue());
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue(value.toString());
        }
    }
}