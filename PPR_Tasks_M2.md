# PPR 项目任务列表 - 阶段二：M2 (报表可视化渲染与权限集成)

本阶段目标为建立报表设计体系，实现 ECharts 图表和 Table 的动态渲染，并跑通主系统的鉴权透传机制。为了适应 AI 编程模型的上下文窗口，任务已被细化为单次 PR 级别的颗粒度。

## 后端任务 (Backend)

### Task B2.1: 报表元数据接口 (Report Meta API)
* **执行步骤**: 
  1. 开发 `ReportService`，提供基于 `reportId` 获取 `PPR_REPORT` 及关联的 `PPR_VIEW_PARAM` 接口。
  2. 实现 `/api/v1/report/meta/{reportId}` 返回 JSON（包含展示类型 `chart_type`、样式配置 `style_config` 和图表配置 `chart_config`）。
  3. 实现 `/api/v1/report/data/{reportId}`，内部直接调用 M1 的视图执行引擎获取实际数据。
* **验收标准**: 
  * 编写单元测试验证 meta 接口返回完整的结构化报表配置；data 接口返回预期的报表数据结果。

### Task B2.2: Sa-Token 鉴权集成与透传拦截器
* **执行步骤**:
  1. 引入 `sa-token-spring-boot3-starter`。
  2. 编写 `AuthInterceptor` 拦截 `/api/v1/report/**` 等前端请求，从 Header 或 URL 参数提取 `Token`。
  3. 开发 `HostSystemAuthService`：携带 `Token` 通过 RestTemplate/WebClient 向配置的主系统 URL 发起校验请求，获取用户权限字符列表（如 `["report:sales:view"]`）。
  4. 缓存该 `Token` 的鉴权结果至本地 Caffeine 或 Redis（视环境而定，推荐 Caffeine 保持轻量）。
* **验收标准**: 
  * Mock 一个主系统接口，当 PPR 拦截器收到 `Token=123` 时，能正确拿到权限字符；如果 Token 无效，拦截器抛出 `NotLoginException`。

### Task B2.3: 权限字符映射管理 API
* **执行步骤**:
  1. 开发 `PPR_PERMISSION` 表的增删改查接口（管理端 API）。
  2. 结合 B2.2 获取的权限字符，在 `/api/v1/report/data/{reportId}` 中增加前置校验：查询 `PPR_PERMISSION` 判断当前报表是否要求特定字符，若要求且用户不具备，则抛出 403 异常。
* **验收标准**: 
  * 访问受保护的报表时，不带对应权限字符请求将被拦截并返回 403 Forbidden 状态码。

---

## 前端任务 (Frontend)

### Task F2.1: 报表设计器 - 视图绑定与参数映射
* **执行步骤**:
  1. 开发 `/views/report-designer/index.vue`，包含报表列表页与编辑页。
  2. 提供下拉框供用户选择已创建的 `ViewID`，选中后自动拉取 `PPR_VIEW_PARAM`。
  3. 针对每个参数，提供一个“UI 组件映射表单”，允许配置为：文本框(Input)、下拉框(Select)、日期选择器(DatePicker)等，并存储至 `style_config` JSON 中。
* **验收标准**: 
  * 选择视图后，页面能正确呈现该视图的参数列表；完成 UI 映射后，能成功保存 `PPR_REPORT` 记录。

### Task F2.2: 报表设计器 - 样式编排与图表配置
* **执行步骤**:
  1. 在报表设计器中增加一个 “Table 样式配置区”（拖拽排序、列宽、显隐、对齐方式）。
  2. 增加一个 “ECharts 配置区”，提供一个 Monaco Editor 用于让用户粘贴 ECharts 的 Option JSON 模板。
  3. 在界面提供“预览报表”按钮，调用渲染引擎验证效果。
* **验收标准**: 
  * 修改表格列宽和表头对齐方式后保存，查看 `style_config` 的 JSON 数据能正确反映这些修改。

### Task F2.3: 报表展示引擎 (Client Renderer) - 动态表单与表格
* **执行步骤**:
  1. 开发供外部/内部调用的独立组件 `<PprReportViewer :reportId="id" />`。
  2. 在 `onMounted` 阶段请求 `/api/v1/report/meta/{reportId}`。
  3. 根据返回的参数映射，使用 `el-form` 动态渲染顶部的查询条件栏。
  4. 点击“查询”后，请求 data 接口，并基于 `style_config` 渲染出 `el-table`。
* **验收标准**: 
  * 传入一个报表 ID，页面能正确渲染出查询表单，点击查询后下方能呈现出带样式的 Element Plus 数据表格。

### Task F2.4: 报表展示引擎 (Client Renderer) - ECharts 渲染与打包
* **执行步骤**:
  1. 在 `<PprReportViewer>` 中增加逻辑：若 `chart_type === 'EChart'`，则引入 `echarts` 并渲染图表。
  2. 将后端返回的 `List<Map>` 数据通过约定规则（如 dataset）注入到 ECharts 的 Option JSON 中。
  3. 修改 `vite.config.ts`，配置 `build.lib` 模式，将该组件及其依赖（不含 Vue）打包为一个独立的 `ppr-renderer.umd.js` 和 `style.css`。
  4. 暴露全局方法 `window.PPR.render('#container', options)`。
* **验收标准**: 
  * 创建一个纯 HTML 文件（无 Vue 环境），引入打包产物和样式，调用 `PPR.render`，能在一个 `div` 容器中成功渲染出带有查询表单的柱状图报表。