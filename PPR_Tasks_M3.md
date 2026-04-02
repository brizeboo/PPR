# PPR 项目任务列表 - 阶段三：M3 (Excel 引擎与拖拽式模板设计)

本阶段目标为攻克“中国式复杂报表”难题，实现基于 x-spreadsheet 的前端可视化模板设计与基于 Easy Excel 的后端导出。为了适应 AI 编程模型的上下文窗口，任务已被细化为单次 PR 级别的颗粒度。

## 后端任务 (Backend)

### Task B3.1: 基础 Excel 导出接口 (EasyExcel)
* **执行步骤**: 
  1. 引入 `easyexcel` 依赖。
  2. 开发 `/api/v1/report/export/{reportId}` 接口，复用查询逻辑获取结果集（`List<Map>`）。
  3. 基于 `PPR_REPORT` 中的 `style_config`（提取表头顺序、标题），动态构建 EasyExcel 的 `WriteTable`。
  4. 使用流式写入并返回 Excel 文件流。
* **验收标准**: 
  * 前端请求接口，能下载带有业务数据的 `.xlsx` 文件，表头顺序与报表配置完全一致。

### Task B3.2: 模板直出引擎 (Template Engine) API
* **执行步骤**:
  1. 开发 `/api/v1/admin/template/upload` 接口，接收 Excel 模板文件上传并存储到本地，在 `PPR_EXCEL_TEMPLATE` 表记录路径。
  2. 开发 `/api/v1/admin/template/mapping` 接口，保存前端传来的 `mapping_config` JSON。
  3. 开发脱机渲染接口 `/api/v1/template/export/{templateId}`，接收任意 JSON 请求体，交由后续渲染服务处理。
* **验收标准**: 
  * 成功上传文件，数据库记录文件路径；能更新指定模板的 `mapping_config`。

### Task B3.3: 自定义 Excel 模板填充逻辑 (核心算法)
* **执行步骤**:
  1. 引入 Apache POI。
  2. 编写 `ExcelTemplateRenderer` 服务，读取原始 `.xlsx` 模板文件，解析 `mapping_config`。
  3. 根据传入的 JSON 数据，按 3 类规则填充：
     - 单值变量：定位到 Cell 执行 `setCellValue`。
     - 列表多行变量：定位到起始行，执行向下插入新行并循环写入。
     - 列表多列变量：定位到起始列，循环向右创建新单元格并写入。
  4. 重新计算公式后输出到 OutputStream。
* **验收标准**: 
  * 传入包含单值和列表标记的 JSON 对象，导出的 Excel 数据正确扩展，原有复杂合并单元格与样式保持完好。

---

## 前端任务 (Frontend)

### Task F3.1: x-spreadsheet 核心集成与组件封装
* **执行步骤**:
  1. 引入 x-spreadsheet 的 npm 包或 CDN 依赖。
  2. 开发 `/components/ExcelEditor/index.vue`，封装 x-spreadsheet 的初始化过程。
  3. 在“模板设计器”页面引入组件，实现“导入本地 Excel 文件”并在 x-spreadsheet 中还原渲染的功能。
* **验收标准**: 
  * 打开页面能看到 Excel 网格 UI，导入 `.xlsx` 文件后，样式和合并单元格能正确在前端还原。

### Task F3.2: 模板设计器 - 拖拽字段与 Mapping 绑定
* **执行步骤**:
  1. 增加“数据源选择树”，可选择报表/视图，加载可用字段并支持 HTML5 Drag and Drop (`draggable="true"`)。
  2. 监听 x-spreadsheet 容器的 `drop` 事件，计算获取放置位置的行列坐标。
  3. 弹出配置对话框选择填充类型（单值 / 多行 / 多列）。
  4. 确认后向该单元格填入标识符，并存入响应式对象 `mappingConfig`。
* **验收标准**: 
  * 拖拽字段至网格中，单元格内容发生改变，且 `mappingConfig` 新增相应的坐标与类型绑定记录。

### Task F3.3: 模板设计器 - 保存与发布
* **执行步骤**:
  1. 增加“保存模板”按钮，调用后端保存 `mappingConfig`。
  2. 在报表设计器的展示类型 `chart_type` 中，新增 `Excel` 选项。
  3. 选中时，出现下拉框供用户绑定已上传的 Excel 模板。
  4. 保存时将 `template_id` 写入报表记录。
* **验收标准**: 
  * 报表能成功关联 Excel 模板并保存。

### Task F3.4: 报表展示引擎 (Client Renderer) - Excel 样式网格支持
* **执行步骤**:
  1. 修改 `<PprReportViewer>`，当 `chart_type === 'Excel'` 时，加载 `<ExcelEditor>` 组件。
  2. 将 x-spreadsheet 设为只读模式（隐藏工具栏）。
  3. 请求业务 JSON 数据以及模板关联的原始单元格结构数据。
  4. 参照单值、多行、多列 3 种规则，在前端遍历并动态修改 x-spreadsheet 的 cell 数据对象，实现浏览器端的报表呈现。
* **验收标准**: 
  * 前端能直接根据业务数据将内容铺入 x-spreadsheet，并在页面上完美展现“中国式复杂报表”效果（包括所有表头和合并单元格）。
