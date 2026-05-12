# Design: add-project-section

## 1. 目标与约束

- 对齐 `proposal.md` 与三份 delta spec：`project-showcase`、`project-card-hover`、`hero-cta-projects`。  
- 技术栈：React 19 + Vite 7 + TypeScript + Tailwind CSS v4；GitHub Pages `base`：`/my-website/`。  
- **全局**：项目截图 **`loading="lazy"`**；外链 `target="_blank"` + `rel="noopener noreferrer"`。  
- **严禁**：项目详情页、项目搜索（见 proposal Out of Scope）。

## 2. DOM 与锚点约定

- **保持** 外层 `section#projects`（`App.tsx` 已存在），`aria-labelledby="projects-heading"` 不变。  
- **区块内结构**：`ProjectsSection` 根节点内依次为：  
  - `h2#projects-heading`（「项目」或等价标题）  
  - 栅格容器 `ul` / `div` role=`list` 包裹多个 `ProjectCard`（实现可选用 `article` + `role="listitem"` 或语义化 `ul>li`——以可访问性优先择一并在代码中统一）。

## 3. 数据层

- 新建 **`src/content/projects.ts`**（或 `projects.json` 经静态 import），导出类型例如：

```ts
export type ProjectItem = {
  id: string
  name: string
  summary: string
  githubUrl: string
  imageSrc: string
  imageAlt: string
}
export const projects: ProjectItem[]
```

- **最少 4 条**记录；首版可使用占位截图（如 `src/assets/projects/placeholder-*.svg` 或内联小图）与真实 GitHub 链接占位符，便于后续替换。  
- **非法数据**：`githubUrl` 非 `https://` 开头时在开发构建阶段 `throw` 或断言失败（任选其一，在 tasks 中固定）。

## 4. `ProjectCard` 组件

- **布局**：卡片容器 `rounded-xl` + `border` + `overflow-hidden`；上部为 `aspect-video` 截图区，下部为标题、简介、`a` GitHub。  
- **截图**：`<img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover" />`  
- **简介**：2～3 行截断可用 `line-clamp-3`（Tailwind）或 CSS `-webkit-line-clamp`。  
- **GitHub**：文案固定为「GitHub」或图标 + 文案（图标可选，不引入新依赖则纯文字）。

## 5. 悬浮微动效（`project-card-hover`）

- **默认（未 reduce motion）**：`transition duration-200`；`hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--accent-border)]`（位移幅度 ≤ `2px` 量级）。  
- **`prefers-reduced-motion: reduce`**：移除 `translate`，仅保留 `hover:shadow-md` 或边框色微弱变化（二选一，代码中用 `motion-safe:` / `motion-reduce:` 前缀拆分）。  
- **键盘**：`focus-within:ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]`（或等效 `outline`）。

## 6. Hero CTA（`hero-cta-projects`）

- 在 `HeroSection` 内 `ThemeToggle` 上方或下方增加 **`button` 类型 CTA**（推荐 `button`，避免 `a` 与 `preventDefault` 键盘语义混用）：文案默认 **「查看项目」**。  
- **点击行为**：调用父组件传入的 **`onNavigateToProjects: () => void`**，内部等价于现有 `beginNavigate('projects')`，以复用 **滚动 + ScrollBlurOverlay** 逻辑。  
- **`App.tsx`**：`<HeroSection onNavigateToProjects={() => beginNavigate('projects')} />`。  
- 若未来 `HeroSection` 需在无导航上下文复用，可将回调改为可选；本变更以单页 App 为准。

## 7. 栅格与断点

- **桌面**：`grid-cols-2` 或 `md:grid-cols-2 lg:grid-cols-2`（4 卡 2×2）；**窄屏**：`grid-cols-1`。  
- **最大宽度**：与 Hero 文案区协调，如 `max-w-6xl mx-auto px-5`。

## 8. 图片与占位策略

- 优先 **本地静态资源**（避免外网占位服务拖慢国内访问）；可暂用 **纯色 + 项目名首字母** 的 CSS 占位块替代真实截图，仍须满足「截图区域」语义与 `lazy`。  
- 若使用真实 PNG：放入 `public/` 或 `src/assets/projects/`，路径与 `base` 兼容（Vite 处理 `import` 资源）。

## 9. 风险摘要

| 风险 | 缓解 |
|------|------|
| LCP / 体积 | lazy、合适分辨率、控制单图最大边长 |
| 外链安全 | `rel` 全、`https` 校验 |
| Hero 与导航双入口 | 统一 `beginNavigate('projects')` |
