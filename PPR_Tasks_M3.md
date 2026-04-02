# PPR 项目任务列表 - 阶段三：M3 (Excel 引擎与拖拽式模板设计)

本阶段目标为攻克“中国式复杂报表”难题，实现基于 Luckysheet 的前端可视化模板设计与基于 Easy Excel 的后端导出。为了适应 AI 编程模型的上下文窗口，任务已被细化为单次 PR 级别的颗粒度。

## 后端任务 (Backend)

### Task B3.1: 基础 Excel 导出接口 (EasyExcel)
* **执行步骤**: 
  1. 引入 `easyexcel` 依赖。
  2. 开发 `/api/v1/report/export/{reportId}` 接口，复用 `ReportService` 查询元数据与数据结果（`List<Map<String, Object>>`）。
  3. 基于 `PPR_REPORT` 中的 `style_config`（提取表头顺序、标题、显隐属性），动态构建 EasyExcel 的 `WriteTable`。
  4. 使用流式写入并设置 `Content-Type` 为 `application/vnd.ms-excel`，返回 Excel 流。
* **验收标准**: 
  * 前端请求该接口，能成功下载一个带有业务数据的 `.xlsx` 文件，且其表头与报表设计器中配置的 `style_config` 顺序、标题完全一致。

### Task B3.2: 模板直出引擎 (Template Engine) API
* **执行步骤**:
  1. 开发 `/api/v1/admin/template/upload` 接口，接收 Excel 模板文件上传，将其存储到本地磁盘（如 `/data/templates/`），并在 `PPR_EXCEL_TEMPLATE` 表插入记录（包含物理路径）。
  2. 开发 `/api/v1/admin/template/mapping` 接口，保存前端设计器传来的 `mapping_config` JSON（单元格坐标 -> 数据字段标识）。
  3. 开发脱机渲染接口 `/api/v1/template/export/{templateId}`，接收 JSON 请求体。
* **验收标准**: 
  * 成功上传 `test.xlsx`，数据库能正确记录文件路径。调用保存 mapping 接口，能更新指定模板的 `mapping_config` 字段。

### Task B3.3: 自定义 Excel 模板填充逻辑 (核心算法)
* **执行步骤**:
  1. 引入 Apache POI。
  2. 编写 `ExcelTemplateRenderer` 核心服务，读取上传的原始 `.xlsx` 模板文件。
  3. 解析 `mapping_config`（如 `{"A1": {"type": "single", "field": "title"}, "A2": {"type": "multi-row", "field": "list_data"}}`）。
  4. 根据传入的 JSON 数据，按以下 3 类规则填充：
     - 单值变量：定位到 `Row/Cell` 直接执行 `setCellValue`。
     - 列表多行变量：定位到起始 `Row`，执行插入新行操作（如 `shiftRows`），并循环写入数据集合。
     - 列表多列变量：定位到起始 `Cell`，循环向右创建新单元格写入数据集合。
  5. 重新计算所有公式（`evaluateAll`），输出到 Response OutputStream。
* **验收标准**: 
  * 提供一个包含单值 `${title}` 和列表 `${list}` 标记的模板，传入包含这两个 key 的 JSON 对象，导出的 Excel 结构正确扩展，且原有的复杂合并单元格格式不被破坏。

---

## 前端任务 (Frontend)

### Task F3.1: Luckysheet 核心集成与组件封装
* **执行步骤**:
  1. 在 `index.html` 引入 Luckysheet 的 CDN 依赖（CSS 和 JS）。
  2. 开发 `/components/ExcelEditor/index.vue`，封装 Luckysheet 初始化生命周期：`luckysheet.create({ container: 'luckysheet', data: [], ... })`。
  3. 在“模板设计器”页面 `/views/template-designer/index.vue` 引入该组件，并实现“导入本地 Excel 文件”加载到 Luckysheet 中的功能。
* **验收标准**: 
  * 打开页面后能看到完整的 Excel 网格 UI，点击导入本地文件，文件内容（包括样式、合并单元格）能正确在 Luckysheet 中还原显示。

### Task F3.2: 模板设计器 - 拖拽字段与 Mapping 绑定
* **执行步骤**:
  1. 在模板设计器左侧，增加一个“数据源选择树”，可下拉选择已有的报表/视图，并加载其所有返回字段（列名）。
  2. 实现 HTML5 Drag and Drop：左侧字段支持 `draggable="true"`。
  3. 监听 Luckysheet 容器的 `drop` 事件，获取放置位置的行列坐标 `(r, c)`。
  4. 弹出配置对话框，让用户选择填充类型（单值 / 多行 / 多列）。
  5. 确认后，向该单元格填入标识符文本（如 `${field}`），并将配置存入一个本地响应式对象 `mappingConfig`。
* **验收标准**: 
  * 用户能将左侧的 `age` 字段拖到 Luckysheet 的 `B2` 单元格，选择“列表多行”，`B2` 单元格内容变为 `${age}`，同时 `mappingConfig` 新增一条针对 `B2` 坐标的记录。

### Task F3.3: 模板设计器 - 保存与发布
* **执行步骤**:
  1. 增加“保存模板”按钮，调用后端 `/api/v1/admin/template/mapping` 保存 `mappingConfig`。
  2. 在“报表设计器 (`Report Config Page`)”中，针对展示类型 `chart_type`，新增 `Excel` 选项。
  3. 当选为 `Excel` 时，出现下拉框供用户选择已设计好的模板（读取 `PPR_EXCEL_TEMPLATE` 列表）。
  4. 保存时，将 `template_id` 写入 `PPR_REPORT` 记录。
* **验收标准**: 
  * 报表能成功关联到一个 Excel 模板 ID 并保存，数据库 `template_id` 字段不为空。

### Task F3.4: 报表展示引擎 (Client Renderer) - Excel 样式网格支持
* **执行步骤**:
  1. 修改 `<PprReportViewer>`：若 `chart_type === 'Excel'`，则不再渲染 Table/ECharts，而是加载 `<ExcelEditor>` 组件（复用 F3.1 成果）。
  2. 设置 Luckysheet 为**只读模式**（隐藏工具栏和 Sheet 栏）。
  3. 拿到 `data` 接口返回的业务 JSON 后，请求该模板关联的原始文件数据（可通过后端 API 获取其初始 luckysheet-json）。
  4. 参照后端的 3 种规则（单值、多行、多列），在前端 JS 中遍历并修改 luckysheet 的 `celldata`，实现数据的客户端填充与渲染展示。
* **验收标准**: 
  * 在不刷新页面的前提下，前端能直接基于拿到的业务 JSON 将数据铺入 Luckysheet 并在网页上完美呈现出“中国式复杂报表”效果（包括表头、合并、颜色等）。