# Tasks: add-project-section

> **流程约定（项目规则）**：每完成下方 **一个 Phase** 即停止，总结变更并等待确认后再进入下一 Phase。

---

## Phase 1 — 数据与类型

- [x] 新建 `src/content/projects.ts`：定义 `ProjectItem` 类型与 `projects` 数组，**至少 4 条**有效数据（含 `githubUrl`、`imageSrc`、`imageAlt`）
- [x] 为每条数据配置占位截图策略（本地 `import` 图或 CSS 占位组件二选一，在实现注释中注明）
- [x] （可选）为 `githubUrl` 添加简单运行时校验或构建期断言

---

## Phase 2 — 卡片 UI 与 `ProjectsSection` 替换

- [x] 新建 `src/components/ProjectCard.tsx`：实现截图区、名称、`summary`、`GitHub` 外链；`img` 带 `loading="lazy"`
- [x] 重写 `ProjectsSection.tsx`：标题 `h2#projects-heading`；栅格渲染 `projects.map` → `ProjectCard`
- [x] 响应式：`md:grid-cols-2`、窄屏单列；容器 `max-w-6xl mx-auto` 与 `design.md` 一致
- [x] 图片 onError 降级为占位（与 spec 边界一致）

---

## Phase 3 — 悬浮动效与无障碍

- [x] 按 `design.md` 拆分 `motion-safe:` / `motion-reduce:` 悬浮样式
- [x] 为卡片根节点添加 `focus-within` 可见环或 `outline`
- [x] 自测：仅键盘 Tab 可聚焦 GitHub 链接与 CTA（若卡片整体可点则不在本变更范围）

---

## Phase 4 — Hero CTA 与集成

- [x] 为 `HeroSection` 增加可选 prop `onNavigateToProjects?: () => void`；渲染「查看项目」`button`，点击调用回调
- [x] 在 `App.tsx` 传入 `onNavigateToProjects={() => beginNavigate('projects')}`
- [x] 自测：CTA 与导航「项目」均触发滚动至 `#projects` 且 `scroll-margin` 正常

---

## Phase 5 — 构建与手测

- [x] 运行 `npm run build` 与 `npm run lint` 并修复问题
- [x] 手测：4 卡展示、GitHub 新开页、`prefers-reduced-motion`、窄屏无横向溢出、懒加载在 Network 面板可见

---

## Out of Scope 自检

- 无项目详情路由页  
- 无搜索 / 筛选 UI 与逻辑
