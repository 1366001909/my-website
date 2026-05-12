# Tasks: add-navigation

> **流程约定（项目规则）**：每完成下方 **一个 Phase** 即停止，总结变更并等待确认后再进入下一 Phase。

---

## Phase 1 — DOM 与全局样式基础

- [x] 在 `src/index.css` 增加 CSS 变量 `--nav-height`（初值如 `3.5rem`），并设置 `html { scroll-behavior: smooth; }` 与 `@media (prefers-reduced-motion: reduce)` 下 `scroll-behavior: auto`
- [x] 为 `main` 增加 `padding-top: var(--nav-height)`（或等价类），避免内容被固定导航遮挡
- [x] 新建占位 `ProjectsSection.tsx`、`ContactSection.tsx`（含语义化标题 `id`/`aria-labelledby`），内容可为简短占位文案
- [x] 调整 `App.tsx`：用 `<main>` 包裹；顺序包含 `#home`（包裹现有 `HeroSection`）、`#projects`、`#contact` 三个 `section`
- [x] 为 `#home`、`#projects`、`#contact` 对应 `section` 设置 `scroll-margin-top: var(--nav-height)`（Tailwind 任意属性或 `index.css`）

---

## Phase 2 — `SiteHeader` 布局与链接

- [x] 新建 `src/components/SiteHeader.tsx`：`position: fixed`、全宽、顶对齐、`z-index` 按 `design.md`
- [x] 左侧品牌：使用 `heroName`（从 `src/content/hero.ts` 导入）作为可点击元素，点击滚动到 `#home`（调用 `scrollIntoView` + `getScrollBehavior()` 辅助函数，或与全局 CSS 一致仅使用 `a href="#home"` 二选一并在代码注释中固定）
- [x] 右侧三个 `a`：`首页`→`#home`，`项目`→`#projects`，`联系我`→`#contact`；样式使用现有 CSS 变量
- [x] 窄屏布局：`flex-wrap` / `gap`，保证无下拉、无搜索框；验证 320px 宽度仍可点到三链接
- [x] `:focus-visible` 样式与键盘 Enter 激活锚点行为自测通过

---

## Phase 3 — 滚动模糊反馈

- [x] 新建 `src/components/ScrollBlurOverlay.tsx`（或等价）：受控 `active` prop，`fixed inset-0`、`backdrop-filter` + `@supports` 降级半透明
- [x] 在导航点击路径上集成：点击任一主导航锚点或品牌滚动前 `active=true`，在 `scrollend` 或兜底定时后 `active=false`；`clearTimeout` / 取消重复监听防止连点泄漏
- [x] `prefers-reduced-motion: reduce` 时不启用强模糊（直接不渲染或极低透明度，与 spec 一致）
- [x] 确认遮罩 `z-index` **低于** `SiteHeader`，且 `pointer-events` 策略与 `design.md` 一致

---

## Phase 4 — 收尾与验证

- [x]（可选）`IntersectionObserver` 为当前 section 对应链接设置 `aria-current`  
- [x] 运行 `npm run build` 与 `npm run lint` 并修复问题  
- [x] 手测：三锚点平滑滚动、hash 直链、`prefers-reduced-motion` 降级、快速连点、亮/暗主题下导航可读性

---

## Out of Scope 自检

- 无搜索 UI 与逻辑  
- 无多级下拉菜单  
- 无登录、注册、会话与后端 API  
