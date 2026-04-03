# PPR 项目任务列表 - 阶段一：M1 (基建搭建与核心查询流闭环)

本阶段目标为跑通“数据源连接 -> 视图 SQL 执行 -> 简单报表数据返回”的基础全链路。为了适应 AI 编程模型的上下文窗口，任务已被细化为单次 PR 级别的颗粒度。

## 阶段状态

- [x] M1 全链路已完成（后端 + 前端 + 构建验证）

## 后端任务 (Backend)

### [x] Task B1.1: Spring Boot 工程初始化与 SQLite 集成
* **执行步骤**: 
  1. 使用 Spring Initializr 创建 Java 17 + Spring Boot 3.x 工程。
  2. 配置 Maven 多模块（如 `ppr-core`, `ppr-server`），预留 Nacos 微服务依赖但不默认开启。
  3. 引入 `mybatis-plus-boot-starter` 和 `sqlite-jdbc` 依赖。
  4. 编写 SQLite 的数据源配置及自动建表脚本（Schema: `PPR_DATASOURCE`, `PPR_VIEW`, `PPR_VIEW_PARAM`）。
* **验收标准**: 
  * 启动应用后，能在本地目录自动生成 `ppr-meta.db` 文件。
  * 编写一个简单的单元测试，成功对 `PPR_DATASOURCE` 表进行 CRUD 操作。

### [x] Task B1.2: 动态数据源 (Dynamic DataSource) 集成
* **执行步骤**:
  1. 引入 `dynamic-datasource-spring-boot-starter`。
  2. 开发 `DataSourceService`，实现基于 `PPR_DATASOURCE` 记录在运行时动态添加、删除外部数据源（MySQL/PG/SQLServer）。
  3. 开发 `/api/v1/admin/datasource/test` 接口，验证外部连接的连通性。
* **验收标准**: 
  * 通过 API 传入任意合法的 MySQL 连接信息，系统返回连接成功，且不影响主 SQLite 数据源的运行。

### [x] Task B1.3: SQL 安全解析器集成 (JSqlParser)
* **执行步骤**:
  1. 引入 `jsqlparser` 依赖。
  2. 编写 `SqlSecurityValidator` 工具类，解析 SQL 抽象语法树 (AST)。
  3. 拦截包含 `INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE` 等非查询操作。
  4. 预留用于后续向 `WHERE` 条件中动态拼接 DataScope 行级权限的扩展接口。
* **验收标准**: 
  * 编写单元测试：输入 `SELECT * FROM users` 返回通过；输入 `SELECT * FROM users; DROP TABLE users;` 抛出 `SqlSecurityException`。

### [x] Task B1.4: 动态视图查询引擎 (JdbcTemplate)
* **执行步骤**:
  1. 编写 `ViewExecutionEngine`。
  2. 根据 `viewId` 查询 `PPR_VIEW` 及其 `PPR_VIEW_PARAM` 定义。
  3. 对前端传入的 JSON 参数进行必填校验与类型转换。
  4. 使用具名参数的 `NamedParameterJdbcTemplate` 切换到目标业务数据源执行 SQL。
  5. 检查请求参数中的 `translateDict`，若为 `true` 则执行字典映射逻辑，默认不翻译。
  6. 开发 `/api/v1/admin/view/preview` 及独立的视图数据接口 `/api/v1/view/data/{viewId}`。
* **验收标准**: 
  * 调用 preview 接口，传入动态参数（如 `{"age": 18}`），能成功查询外部数据库并返回正确的 JSON 结构数据，防止 SQL 注入。

---

## 前端任务 (Frontend)

### [x] Task F1.1: Vue 3 基础工程与管理控制台骨架
* **执行步骤**:
  1. 使用 Vite 初始化 Vue 3 + TypeScript 项目。
  2. 集成 Element Plus、Vue Router、Pinia 以及 UnoCSS。
  3. 搭建标准的 Admin Layout：左侧静态导航菜单、顶部 Header、主体 RouterView 区域。
* **验收标准**: 
  * 成功运行 `npm run dev`，无报错。
  * 页面呈现标准的后台布局，点击左侧菜单可平滑切换路由，UnoCSS 样式生效。

### [x] Task F1.2: 数据源管理页面 (CRUD & 测试连接)
* **执行步骤**:
  1. 开发 `/views/datasource/index.vue`。
  2. 使用 `el-table` 展示数据源列表。
  3. 开发新增/编辑抽屉 (Drawer)，表单包含名称、类型(下拉)、JDBC URL、账号密码。
  4. 增加“测试连接”按钮并联调后端 API。
* **验收标准**: 
  * 页面可正常展示数据，点击“测试连接”并能根据后端返回弹出成功/失败的 Message 提示。

### [x] Task F1.3: 视图设计器 - CodeMirror 6 集成
* **执行步骤**:
  1. 引入 `vue-codemirror6` 及其核心依赖。
  2. 开发 `/views/view-designer/index.vue`，页面划分为左侧（视图列表）、中上（SQL 编辑区）、中下（参数配置区）、右侧（预览结果区）。
  3. 配置 CodeMirror 为 `sql` 语言模式，启用基础代码高亮和暗黑主题。
* **验收标准**: 
  * 页面加载后，能在代码编辑器中输入 SQL 并看到明显的语法高亮，编辑器体验流畅，无性能卡顿。

### [x] Task F1.4: 视图设计器 - 参数绑定与实时预览
* **执行步骤**:
  1. 在视图设计器中开发“参数配置表单”（动态增删行，包含参数名、类型、是否必填、字典映射等）。
  2. 开发“运行”按钮，提取 CodeMirror 中的 SQL 及配置好的参数，调用后端 `/api/v1/admin/view/preview` 接口。
  3. 将返回的结果数据动态渲染为 `el-table` 在右侧/下方的结果预览区展示。
* **验收标准**: 
  * 能在页面上定义 `#{id}` 参数，输入测试值后点击运行，下方表格正确渲染出该 ID 对应的数据集。
