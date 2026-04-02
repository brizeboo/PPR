# PPR (Perfect Panel Report)

PPR is a complex reporting platform that supports dynamic data sources, drag-and-drop Excel template design, and data visualization.

## 🚀 Core Features

- **Dynamic Data Sources & SQL Engine**: Supports dynamic mounting of MySQL/PostgreSQL/SQLServer, featuring a syntax-highlighted SQL editor with anti-injection validation.
- **Visual Report Design**: Integrates ECharts and data tables, supporting dynamic condition rendering and standalone native JS mounting.
- **Complex Excel Reports**: Powered by Luckysheet and Easy Excel, enabling visual drag-and-drop template design and high-performance streaming export.
- **Task Scheduling & Push**: Supports scheduled report generation and email attachment delivery based on Cron expressions.
- **Security & Access Control**: Integrates Sa-Token for system-level authentication, providing comprehensive operation logs and query audits.

## 🛠️ Tech Stack

- **Backend**: Spring Boot, MyBatis-Plus, Sa-Token, Easy Excel, JSqlParser
- **Frontend**: Vue 3, Vite, Element Plus, ECharts, Luckysheet, Monaco Editor
- **Metadata DB**: SQLite

## 📦 Installation Guide

### 1. Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose (optional, for quick deployment)

### 2. Quick Deployment (Docker)
```bash
docker-compose up -d
```

### 3. Local Run
**Backend**:
Run the Spring Boot main class directly. The system will automatically initialize the underlying SQLite database.

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## 🧩 Component Integration

PPR can be embedded into your existing business systems as an independent component:

### Vue Project Integration
Install the `@ppr/vue` package via NPM:
```javascript
import { PprReport } from '@ppr/vue';

// Styles are automatically injected, just use it in your component
// <PprReport :reportId="123" />
```

### Native JS Integration
PPR provides self-contained build artifacts (CSS is inlined), supporting mounting outside of Vue environments:
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
