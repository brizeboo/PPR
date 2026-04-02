# PPR (Perfect Panel Report)

PPR 是一个支持动态数据源、拖拽式 Excel 模板设计与数据可视化的复杂报表平台。

## 🚀 核心特性

- **动态数据源与 SQL 引擎**：支持 MySQL/PostgreSQL/SQLServer 动态挂载，提供带语法高亮的 SQL 编辑器与防注入校验。
- **可视化报表设计**：集成 ECharts 与数据表格，支持动态条件渲染与脱机原生 JS 挂载。
- **中国式复杂报表**：基于 x-spreadsheet 与 Easy Excel，实现可视化拖拽式模板设计与高性能流式导出。
- **定时调度与推送**：支持基于 Cron 表达式的报表定时生成与邮件附件推送。
- **安全与权限管控**：集成 Sa-Token 实现系统级鉴权，提供完善的操作日志与查询审计。

## 🛠️ 技术栈

- **后端**：Spring Boot, MyBatis-Plus, Sa-Token, Easy Excel, JSqlParser
- **前端**：Vue 3, Vite, Element Plus, ECharts, Luckysheet, Monaco Editor
- **底层元数据**：SQLite

## 📦 安装指南

### 1. 环境准备
- Java 17+
- Node.js 18+
- Docker & Docker Compose (可选，用于一键部署)

### 2. 快速部署 (Docker)
```bash
docker-compose up -d
```

### 3. 本地运行
**后端启动**：
直接运行 Spring Boot 主启动类，系统将自动初始化底层 SQLite 数据库。

**前端启动**：
```bash
cd frontend
npm install
npm run dev
```

## 🧩 组件集成

PPR 支持作为独立组件嵌入到你的现有业务系统中：

### Vue 项目集成
通过 NPM 安装 `@ppr/vue` 依赖包：
```javascript
import { PprReport } from '@ppr/vue';

// 样式已自动注入，直接在组件中使用
// <PprReport :reportId="123" />
```

### 原生 JS 集成
PPR 提供自包含的构建产物（CSS 已内联），支持脱离 Vue 环境的纯 JS 挂载：
```html
<script src="https://your-server/ppr.js"></script>

<div id="report-container"></div>
<script>
  PPR.render(document.getElementById('report-container'), {
    reportId: 123,
    token: 'your-auth-token'
  });
</script>
```
