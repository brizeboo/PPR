# PPR 项目任务列表 - 阶段四：M4 (定时推送、GraphQL 与日志审计)

本阶段目标为完善系统的高级特性与辅助监控体系，达到可上线投产的成熟度。为了适应 AI 编程模型的上下文窗口，任务已被细化为单次 PR 级别的颗粒度。

## 后端任务 (Backend)

### Task B4.1: 定时调度引擎 (Spring Schedule)
* **执行步骤**: 
  1. 开发 `PPR_SCHEDULE_TASK` 表对应的实体、Mapper 及 Service。
  2. 实现基于 `SchedulingConfigurer` 的动态任务注册器 `DynamicScheduleRegistrar`。
  3. 提供管理 API：新增/修改任务（Cron 表达式、状态 `0:停止, 1:运行`），并能在运行时动态 add/cancel 调度任务，无需重启 Spring Boot。
* **验收标准**: 
  * 通过接口新增一个 `0/5 * * * * ?` (每5秒) 的任务并启用，控制台每 5 秒打印一次执行日志；修改为停止状态后，日志停止打印。

### Task B4.2: 邮件发送引擎 (JavaMailSender)
* **执行步骤**:
  1. 引入 `spring-boot-starter-mail`。
  2. 开发全局 SMTP 配置表 `PPR_MAIL_CONFIG` (host, port, username, password, protocol)。
  3. 编写 `MailService`，实现基于数据库配置动态初始化 `JavaMailSenderImpl`（避免写死在 `application.yml`）。
  4. 结合 M3 的 `ExcelTemplateRenderer` 生成报表 Excel 字节流。
  5. 封装发送带附件的 HTML 邮件方法，支持 `To`, `Cc` 及自定义 `Subject`/`Content`。
* **验收标准**: 
  * 配置一个有效的 SMTP 账号，调用测试发信接口，指定收件人邮箱，能成功收到包含 `.xlsx` 附件和自定义正文的测试邮件。

### Task B4.3: 定时任务执行与邮件联动
* **执行步骤**:
  1. 在 `DynamicScheduleRegistrar` 的执行逻辑中，根据 `report_id` 查询报表元数据和对应的视图 SQL。
  2. 执行 SQL 获取数据，调用 `ExcelTemplateRenderer` 或 EasyExcel 生成附件流。
  3. 调用 `MailService` 将该附件发送至 `PPR_SCHEDULE_TASK` 中配置的 `receivers` 和 `cc_receivers`。
* **验收标准**: 
  * 配置一个每分钟执行的报表推送任务，时间到达后，指定的邮箱成功收到包含该报表最新数据的 Excel 附件邮件。

### Task B4.4: 系统日志与审计模块 (AOP Logging)
* **执行步骤**:
  1. 创建 `PPR_LOG` 表 (id, type, operator, ip, method, params, time, cost_ms, error_msg)。
  2. 编写 `@LogAudit` 自定义注解。
  3. 编写 `LogAspect`，切入标注了该注解的 Controller 方法（如 `/api/v1/report/data` 和所有管理端变更接口）。
  4. 异步保存日志至 SQLite。
  5. 开发一个固定的每日凌晨清理任务：删除 `time < now() - 30 days` 的记录。
* **验收标准**: 
  * 访问一次报表查询接口，`PPR_LOG` 表中正确增加一条类型为“查询”的记录，包含当前请求的 IP 和 SQL 执行耗时（`cost_ms`）。

### Task B4.5: GraphQL 中转与安全代理 (可选特性)
* **执行步骤**:
  1. 编写 Hasura 代理配置逻辑：在 Spring Boot 中配置 Hasura 的 Endpoint URL 及 Admin Secret。
  2. 开放 `/api/v1/graphql` 接口，接收前端的标准 GraphQL Query/Mutation Payload。
  3. 校验 `Token`（复用 `AuthInterceptor`），若通过，则在 Header 中附加 `x-hasura-role` 或 Admin Secret，通过 `RestTemplate` 转发至底层 Hasura 引擎。
  4. 将 Hasura 的响应原样返回给前端。
* **验收标准**: 
  * 不带 Token 请求 `/api/v1/graphql` 返回 401；带有效 Token 请求，能成功获取到 Hasura 返回的数据结构。

---

## 前端任务 (Frontend)

### Task F4.1: 定时发送配置页面
* **执行步骤**:
  1. 开发 `/views/schedule/index.vue`，展示任务列表。
  2. 新增/编辑任务对话框：包含报表选择下拉框、Cron 表达式输入框（可引入 `vue-cron` 辅助组件）、收件人输入（支持多个逗号分隔）、抄送人、邮件主题及富文本正文（或简单的 `textarea`）。
  3. 增加“启停状态” Switch 开关，以及“立即执行一次”的测试按钮。
* **验收标准**: 
  * 页面上能完整填入任务信息并保存，保存后任务列表出现新记录，点击“立即执行一次”能收到操作成功的反馈。

### Task F4.2: 邮件全局 SMTP 配置面板
* **执行步骤**:
  1. 在“定时发送配置页面”顶部或侧边，增加一个“全局 SMTP 配置”按钮/标签页。
  2. 提供表单填写发件服务器 (Host)、端口 (Port)、账号 (Username) 及授权码/密码 (Password)。
  3. 提供“保存并测试发信”功能，向当前登录人或指定测试邮箱发送一封纯文本验证邮件。
* **验收标准**: 
  * 填写 QQ 或企业微信邮箱的 SMTP 信息后点击测试，能提示成功并实际收到测试邮件。

### Task F4.3: 系统日志查看页面
* **执行步骤**:
  1. 开发 `/views/log/index.vue`。
  2. 顶部提供多条件搜索栏：操作类型（登录/查询/变更/定时任务）、时间区间（DatePicker）、状态（成功/失败）。
  3. 底部 `el-table` 展示日志详情。针对“失败”状态的记录，提供一个“查看异常”按钮，弹窗展示后端的 `error_msg` 堆栈文本。
* **验收标准**: 
  * 能查询并分页展示系统内的所有审计日志，点击异常日志的“查看”按钮能看到清晰的报错堆栈信息。

### Task F4.4: GraphQL 调试终端集成 (Playground)
* **执行步骤**:
  1. 在管理后台新增路由 `/views/graphql/playground.vue`。
  2. 引入 `graphiql` React 组件的 Vue 包装器，或者直接使用 `iframe` 嵌入一个独立的 GraphiQL 页面。
  3. 配置其 fetcher 的 Endpoint 指向 PPR 的 `/api/v1/graphql`，并在 Header 中自动注入当前登录的 `Token`。
* **验收标准**: 
  * 打开该页面，左侧能看到由 Schema Introspection 自动生成的文档，在左侧输入框编写 GraphQL Query，点击运行，右侧能正确渲染出 JSON 结果。