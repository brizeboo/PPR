# PPR 项目任务列表 - 阶段二：M2 (报表可视化渲染与权限集成)

本阶段目标为建立报表设计体系，实现 ECharts 图表和 Table 的动态渲染，并跑通主系统的鉴权透传机制与 DataScope。为了适应 AI 编程模型的上下文窗口，任务已被细化为单次 PR 级别的颗粒度。

## 后端任务 (Backend)

### Task B2.1: 报表元数据接口 (Report Meta API)
* **执行步骤**: 
  1. 开发 `ReportService`，提供基于 `reportId` 获取 `PPR_REPORT` 及关联的 `PPR_VIEW_PARAM` 接口。
  2. 实现 `/api/v1/report/meta/{reportId}` 返回 JSON（包含展示类型、轮询间隔、样式配置 `style_config` 和图表配置 `chart_config`）。
  3. 实现 `/api/v1/report/data/{reportId}`，内部调用 M1 的视图执行引擎获取数据（后端仅返回原始数据与字典元数据，默认不翻译）。
* **验收标准**: 
  * 编写单元测试验证 meta 接口返回完整的结构化报表配置；data 接口返回预期的报表数据结果。

### Task B2.2: Sa-Token 鉴权集成与透传拦截器
* **执行步骤**:
  1. 引入 `sa-token-spring-boot3-starter`。
  2. 开发全局权限控制开关（通过 `application.yml` 配置）。
  3. 编写 `AuthInterceptor`，开启权限时拦截请求提取 `Token`。
  4. 开发 `HostSystemAuthService`：携带 `Token` 调用主系统鉴权接口，获取返回的权限字符列表及 `DataScope` 数据范围。
  5. 缓存鉴权结果至 Caffeine，并在执行底层 SQL 时利用 JSqlParser 自动拼接 `DataScope`。
* **验收标准**: 
  * Mock 主系统接口，当 PPR 收到有效 Token 时能提取出 DataScope 并限制 SQL 结果；无 Token 或权限不足时返回 403。全局开关关闭时直接放行。

### Task B2.3: 权限字符映射管理 API
* **执行步骤**:
  1. 开发 `PPR_PERMISSION` 表的增删改查接口（管理端 API）。
  2. 结合 B2.2 结果，在请求受保护接口时，判断 `PPR_PERMISSION` 绑定的权限字符是否在用户的权限列表中。
* **验收标准**: 
  * 在管理端成功配置某报表需要 `report:sales:view` 权限后，缺少该权限字符的请求将被正确拦截。

---

## 前端任务 (Frontend)

### Task F2.1: 报表设计器 - 视图绑定与参数映射
* **执行步骤**:
  1. 开发 `/views/report-designer/index.vue`，包含报表列表页与编辑页。
  2. 提供下拉框供用户选择已创建的 `ViewID`，并自动拉取对应参数。
  3. 针对每个参数，提供“UI 组件映射表单”（如文本框、日期选择器等）。
  4. 增加“前端主动轮询间隔（秒）”的设置项，存储至 `PPR_REPORT`。
* **验收标准**: 
  * 页面能正确呈现视图的参数列表，并能成功保存包含 UI 映射和轮询间隔的配置。

### Task F2.2: 报表设计器 - 样式编排与图表配置
* **执行步骤**:
  1. 在报表设计器中增加一个 “Table 样式配置区”（列宽、显隐、对齐方式、字典优先覆盖配置）。
  2. 增加一个 “ECharts 配置区”，提供 CodeMirror 6 (`vue-codemirror6`) 编辑器用于让用户粘贴 ECharts 的 Option JSON 模板。
  3. 提供“预览报表”按钮，调用渲染引擎验证效果。
* **验收标准**: 
  * 能通过 CodeMirror 流畅编写 ECharts JSON，修改表格配置后保存，`style_config` 数据能正确持久化。

### Task F2.3: 报表展示引擎 (Client Renderer) - 动态表单与表格
* **执行步骤**:
  1. 开发独立组件 `<PprReportViewer :reportId="id" />`。
  2. `onMounted` 阶段请求 meta 接口，并依据轮询间隔初始化定时刷新逻辑。
  3. 根据参数映射动态渲染顶部的 `el-form` 查询条件栏。
  4. 拿到后端返回的数据后，在前端利用关联的字典元数据完成数据字典的本地翻译，并基于 `style_config` 渲染 `el-table`。
* **验收标准**: 
  * 传入报表 ID，能渲染出查询表单和字典翻译过后的数据表格，且能按配置的时间间隔自动刷新。

### Task F2.4: 报表展示引擎 (Client Renderer) - ECharts 渲染与打包
* **执行步骤**:
  1. 在 `<PprReportViewer>` 中增加 ECharts 支持，将业务数据注入到 Option JSON 中渲染。
  2. 修改 `vite.config.ts`，配置 `build.target` 为 `es2020`。
  3. 配置 `build.lib` 模式，并结合 UnoCSS 的能力，将组件及其 CSS 内联打包为一个自包含的 `ppr-renderer.umd.js` 文件。
  4. 暴露全局挂载方法 `window.PPR.render('#container', options)`。
* **验收标准**: 
  * 创建一个纯 HTML 文件（无 Vue、无额外 CSS 引入），仅引入 `ppr-renderer.umd.js` 并调用 `PPR.render`，能成功渲染出完整的图表报表且样式不丢失。
