# PPR (Perfect Panel Report) 项目里程碑与开发计划 (Milestones)

基于《PPR_PRD》的核心需求与系统解耦架构，本项目研发将分为 4 个主要里程碑（Milestone）。每个里程碑都将交付可验证的系统功能，以确保项目按阶段平稳落地。

---

## 阶段一：M1 - 基建搭建与核心查询流闭环 (Core Data Flow)
**目标:** 跑通“数据源连接 -> 视图 SQL 执行 -> 简单报表数据返回”的基础全链路，并完成前后端底层技术架构的搭建。

### 后端任务 (Backend)
- [ ] **基础架构搭建**: 初始化 Spring Boot 工程，预留 Nacos 支持，引入 MyBatis-Plus、Sa-Token 等核心依赖。
- [ ] **SQLite 元数据初始化**: 创建系统所需的底层元数据表结构（`PPR_DATASOURCE`, `PPR_VIEW`, `PPR_VIEW_PARAM` 等）。
- [ ] **动态数据源与连接池**: 引入 `dynamic-datasource`，实现多业务数据源（MySQL/PG/SQLServer）的动态挂载与连接测试。
- [ ] **SQL 动态解析与防注入**: 集成 `JSqlParser`，实现对用户输入 SQL 的校验拦截，并为后续 DataScope 权限拼接预留能力。
- [ ] **视图执行引擎**: 开发 `JdbcTemplate` 动态查询模块，实现带参数的 SQL 预编译执行，并统一返回 `List<Map>` JSON 结构。支持 `translateDict` 参数决定是否在后端翻译字典。

### 前端任务 (Frontend)
- [ ] **前端基建初始化**: 搭建 Vue 3 + Vite + Element Plus + Pinia 框架，引入 UnoCSS 实现原子化 CSS，配置全局状态管理与路由。
- [ ] **独立管理控制台骨架**: 搭建标准的后台管理布局（左侧菜单、Header、主内容区）。
- [ ] **数据源配置页面**: 实现数据源列表展示、新增表单及连接测试功能。
- [ ] **视图设计器页面 (核心)**: 
  - 集成 CodeMirror 6 (`vue-codemirror6`) 实现 SQL 语法高亮编写。
  - 实现 SQL 参数配置表单及“执行预览”功能。

---

## 阶段二：M2 - 报表可视化渲染与权限集成 (Visualization & Auth)
**目标:** 建立报表设计体系，实现 ECharts 图表和 Table 的动态渲染，并跑通主系统的鉴权透传机制。

### 后端任务 (Backend)
- [ ] **报表元数据接口**: 提供 `/api/v1/report/meta/{reportId}` 和报表数据查询接口。
- [ ] **Sa-Token 鉴权流转**: 增加全局权限控制开关。实现拦截器机制提取 Token，调用主系统换取权限字符及 DataScope 数据范围。结合 `PPR_PERMISSION` 进行路由鉴权，并将 DataScope 传递给底层 SQL 解析引擎。
- [ ] **权限管理接口**: 提供系统菜单权限与报表（查看/修改）权限的映射配置接口。

### 前端任务 (Frontend)
- [ ] **报表设计器页面**:
  - 实现视图 ID 绑定，将视图参数动态映射为 UI 控件。
  - 增加“前端主动轮询间隔”配置能力。
  - 集成 CodeMirror 6 实现 ECharts 配置 JSON 的注入面板。
  - 实现基于 Element Plus 的表格列配置（对齐、显隐、宽度等）。
- [ ] **报表展示渲染引擎 (Client API)**:
  - 封装统一的报表展示组件，支持数据轮询与前端字典翻译机制。
  - 实现多条件表单的动态生成与查询联动。
  - 实现 ECharts 渲染器与 Table 渲染器。
- [ ] **原生 JS 挂载方案支持**: 提升编译目标至 `es2020`，使用 Vite 结合 UnoCSS 将组件及内联样式打包为自包含的原生 JS，实现脱离 Vue 环境的极速接入。

---

## 阶段三：M3 - Excel 引擎与拖拽式模板设计 (Excel Engine)
**目标:** 攻克“中国式复杂报表”难题，实现基于 x-spreadsheet 的前端可视化模板设计与基于 Easy Excel 的后端导出。

### 后端任务 (Backend)
- [ ] **标准列表导出**: 结合 Easy Excel 实现大数据量的流式 Excel 导出。
- [ ] **模板直出引擎 (脱机渲染)**: 提供独立接口，接收 `templateId` 与 JSON 数据，基于底层规则直接生成最终 Excel 文件返回。
- [ ] **模板管理接口**: 实现 Excel 模板文件的上传、下载及物理路径存储逻辑。

### 前端任务 (Frontend)
- [ ] **导出与网格模板可视化设计器 (核心)**:
  - 引入 x-spreadsheet 并在 Web 端加载渲染导入的 Excel 模板文件。
  - 开发左侧数据源树状面板（加载报表/视图的参数与字段）。
  - 实现**拖拽交互机制**：将左侧字段拖入 x-spreadsheet 单元格，并自动转换生成底层标识符（如单值、列表多行、列表多列）。
- [ ] **Excel 样式网格展示**: 在“报表展示引擎”中新增对 `chart_type == Excel` 的支持，读取 `mapping_config` 将动态数据填入 x-spreadsheet 中实现在线预览。

---

## 阶段四：M4 - 定时推送与日志审计 (Schedule & Audit)
**目标:** 完善系统的高级特性与辅助监控体系，达到可上线投产的成熟度。

### 后端任务 (Backend)
- [ ] **定时调度与邮件引擎**: 
  - 集成 Spring Schedule，实现根据 Cron 表达式动态启停任务。
  - 集成 JavaMailSender，实现定时生成报表 Excel 并作为邮件附件发送（支持群发/抄送）。
- [ ] **系统日志模块**: 
  - 使用 AOP 拦截关键操作，记录操作人 IP、时间与报表查询耗时。
  - 建立 SQLite 定时清理机制（如保留 30 天日志）。

### 前端任务 (Frontend)
- [ ] **定时发送配置页面**: 提供可视化 Cron 配置组件、收件人输入及富文本邮件正文配置。
- [ ] **系统日志查询面板**: 提供可视化的访问日志与执行堆栈查询界面。

---

## 验收与交付 (Delivery)
* 完成内部功能集成测试。
* 交付独立运行的 JAR 包与 SQLite 初始化脚本。
* 交付 `Dockerfile` 与 `docker-compose.yml` 及部署文档。
* 交付 `@ppr/vue` NPM 挂载包及原生 JS 接入 Demo。
