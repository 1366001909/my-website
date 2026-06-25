# 项目架构阅读笔记

> 由对话中的代码阅读整理而成，便于日后查阅与迭代。技术栈与路径以仓库当时状态为准。

## 1. 目录结构与系统架构

**技术栈：** Vite 8 + React 19 + TypeScript + Tailwind CSS 4（`@tailwindcss/vite`），纯前端 SPA，无独立路由库。

| 区域 | 作用 |
|------|------|
| `index.html` | 入口 HTML；内联脚本做主题首屏（与 `src/lib/theme.ts` 的 storage key 对齐） |
| `vite.config.ts` | `base: '/my-website/'`（GitHub Pages 子路径部署） |
| `src/main.tsx` | `createRoot`、主题初始化、挂载 `App` |
| `src/App.tsx` | 整站编排：顶栏、滚动模糊层、各区块 `<main>` |
| `src/components/*` | 区块与壳组件（Hero、Projects、About、Contact、Header、主题切换等） |
| `src/content/*.ts` | 静态文案与列表数据（非 HTTP 接口） |
| `src/lib/*` | 主题、滚动行为等小工具 |

**系统形态：** 单页、单根组件树；数据以本地 TypeScript 模块为主；无服务层或统一 API 客户端层。

---

## 2. 路由的配置与结构

**未使用** React Router / TanStack Router 等。

**实际机制：**

- **URL：** `location.hash`，合法片段为 `home` | `projects` | `about` | `contact`（与 `App.tsx`、`SiteHeader` 中的 `SectionId` 一致）。
- **导航：** `SiteHeader` 使用 `<a href="#...">` 并 `preventDefault`，由 `onNavigate` 调用 `scrollIntoView`。
- **当前区块高亮：** `IntersectionObserver` 根据视口推断当前 section，更新 `activeSection`。
- **首屏：** `useLayoutEffect` 根据 hash 滚动到对应 `id` 的 section。

结论：**锚点滚动 + hash 的单页内导航**，不是多页面或嵌套路由树。

---

## 3. 项目的构架方式

概括为：**编排式单页 + 按区块拆组件 + 内容外置为 ts 模块**。

- **编排中心：** `App.tsx` 持有导航状态、模糊过渡、IntersectionObserver 订阅。
- **展示：** 各 `*Section.tsx` 负责一块 UI，边界相对清晰。
- **配置型内容：** `src/content/*` 便于改文案与列表，但仍为编译期静态数据。

无全局状态管理库、无 data-fetching 层、无 BFF；结构简单，适合静态站点。引入 API 后需在数据获取、缓存、加载与错误态上自行约定分层。

---

## 4. 「Dashboard」与可复用性

当前仓库中 **不存在** 名为 Dashboard 的页面或组件；界面为 **作品集式单页**（顶栏 + 多个全宽 section）。

若将「壳」理解为可复用布局：

- **顶栏 + 主区域：** `SiteHeader` 与 `main.site-main` 可抽象为布局组件，通过 `children` 替换内容；需注意现有导航与 `SectionId` / hash 强绑定，复用到控制台类多路由场景时需重构导航契约。
- **各 Section 组件：** 可在其他页面按需引用，但多依赖全页宽度与主题 CSS 变量。

---

## 5. 后端 API 与现有结构的适配

**可以适配**，属于增量分层，而非内置能力。

| 方面 | 现状 | 接入 API 时的常见做法 |
|------|------|------------------------|
| 数据 | `content/*.ts` 静态 | 渐进改为 `fetch` + 类型；或构建时拉取仍输出静态站点 |
| 环境配置 | Vite 仅前端构建 | 使用 `import.meta.env.VITE_*` 配置 API base；注意与 `base` 资源前缀区分 |
| 部署 | 静态托管（如 GitHub Pages） | API 常独立域名或子域；需处理 **CORS** 与 **HTTPS** |
| 鉴权 | 无 | Cookie 需 `credentials`；或 Bearer；静态前端无服务端 session 时需单独设计 |

开发阶段可在 `vite.config.ts` 中配置 `server.proxy`，将 `/api` 代理到本地后端，与现有结构不冲突。若生产环境前后端 **同源反代**，可减轻部分 CORS 配置负担。

---

## 6. ASCII 架构图（当前）

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                                │
│  (theme bootstrap script)  +  <div id="root">                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ type="module"
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       src/main.tsx                               │
│  resolveInitialTheme → applyThemeToDocument                      │
│  createRoot(#root).render(<StrictMode><App/></StrictMode>)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        App.tsx                                   │
│  state: activeSection, blurActive                               │
│  nav: hash ↔ SectionId, scrollIntoView, IntersectionObserver    │
├─────────────────────────────────────────────────────────────────┤
│  SiteHeader ──► onNavigate(SectionId)                           │
│  ScrollBlurOverlay                                              │
│  <main>                                                         │
│    #home    → HeroSection                                       │
│    #projects→ ProjectsSection  ←── content/projects.ts          │
│    #about   → AboutSection     ←── content/about.ts             │
│    #contact → ContactSection                                    │
└───────────────┬───────────────────────────────┬─────────────────┘
                │                               │
                ▼                               ▼
        src/components/*.tsx              src/content/*.ts
        src/lib/theme.ts, scroll.ts       （静态，无 HTTP）

┌─────────────────────────────────────────────────────────────────┐
│  构建 / 部署                                                      │
│  Vite (React plugin + Tailwind plugin)  →  dist/                │
│  base: "/my-website/"  →  静态资源与 hash 路由均带该前缀           │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────┐
        │  未来可选：API 层（当前代码中不存在）    │
        │  浏览器 ──fetch──► 后端 REST/GraphQL   │
        │  或 Vite dev server.proxy("/api"→…)   │
        └──────────────────────────────────────┘
```

---

## 7. 备注

- OpenSpec 相关目录若已清空，以你本地的 `openspec/config.yaml` 与后续变更文档为准。
- 依赖与脚本以根目录 `package.json` 为准；若之后增加 `gh-pages` 等，请同步更新本笔记或改为「见 package.json」。
