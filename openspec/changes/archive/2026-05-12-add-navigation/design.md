# Design: add-navigation

## 1. 目标与约束

- 对齐 `proposal.md` 与三份 delta spec：`top-navigation`、`anchor-smooth-scroll`、`scroll-blur-feedback`。  
- 技术栈：React 19 + Vite + TypeScript + Tailwind CSS v4；部署 GitHub Pages，`base` 为 `/my-website/`。  
- **严禁**：搜索、多级下拉、登录注册（见 proposal Out of Scope）。

## 2. 页面结构与 DOM 约定

单页结构建议如下（`App.tsx` 组装）：

```text
<>
  <SiteHeader />              <!-- fixed top -->
  <ScrollBlurOverlay />       <!-- 条件渲染或 opacity 控制，见 §5 -->
  <main>
    <section id="home">      <!-- 首屏：可包一层或给现有 HeroSection 根节点加 id -->
      <HeroSection />
    </section>
    <section id="projects" aria-labelledby="projects-heading">
      ...
    </section>
    <section id="contact" aria-labelledby="contact-heading">
      ...
    </section>
  </main>
</>
```

- **`id` 约定（锁定）**：`home`、`projects`、`contact`（与导航 `href="#home"` 等一致）。  
- **`main` 顶部内边距**：`padding-top: var(--nav-height)`（或等价），`--nav-height` 在 `:root` / `index.css` 与导航实际高度同步（导航单行约 `56px`–`64px`，以最终实现测量为准，可用 CSS 变量统一）。  
- **`scroll-margin-top`**：为 `#home`、`#projects`、`#contact` 目标元素（或各 `section`）设置 `scroll-margin-top: var(--nav-height)`，避免锚点滚动后标题贴到导航下沿。

## 3. 顶部导航 `SiteHeader`

- **位置与层级**：`position: fixed; top: 0; left: 0; right: 0; z-index: 50`（数值需高于 Hero 内 canvas/渐变，低于或等于滚动遮罩策略见 §5）。  
- **样式**：背景 `background: color-mix(in srgb, var(--bg) 85%, transparent)` 或 `var(--bg)` + 底边框 `1px solid var(--border)`；支持亮/暗主题变量。  
- **左侧品牌**：首版推荐复用 `src/content/hero.ts` 中 `heroName` 作为可点击文本（`button` 或 `a href="#home"`）；若后续换 Logo，再增加 `src/content/nav.ts` 与 `<img alt="">`。  
- **右侧链接**：三个 `a` 元素，`href="#home"`、`#projects`、`#contact`**；不在本变更中**使用 `react-router`。  
- **窄屏**：使用 `flex-wrap` + `gap` + `justify-between`，或中间 `flex-1` + `min-w-0`；禁止汉堡菜单与下拉（Out of Scope）。  
- **当前页指示（可选增强）**：使用 `IntersectionObserver` 更新当前 section 对应链接的 `aria-current="page"`（仅对 hash 匹配链接），避免过度工程可放在 Phase 末任务。

## 4. 平滑滚动策略

- **全局 CSS**：`html { scroll-behavior: smooth; }`  
- **动效降级**：

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- **程序化滚动**（左侧品牌若用 `button`）：调用 `document.getElementById('home')?.scrollIntoView({ behavior: getScrollBehavior() })`，其中 `getScrollBehavior()` 在 `matchMedia('(prefers-reduced-motion: reduce)')` 为真时返回 `'auto'`，否则 `'smooth'`。  
- **初始带 hash 进入**：依赖浏览器默认 + `scroll-behavior`；若需首屏补偿，可在 `useLayoutEffect` 内对合法 hash 调用一次 `scrollIntoView`（与 `prefers-reduced-motion` 一致）。

## 5. 滚动切换背景模糊 `ScrollBlurOverlay`

- **触发**：主导航内锚点点击、左侧品牌触发滚动时，置 `isTransitioning` 为 `true`，展示全屏层。  
- **实现**：`position: fixed; inset: 0; z-index: 40`（**低于** `SiteHeader` 的 `50`，保证导航始终可点）；`backdrop-filter: blur(8px)`（具体 px 可调）；背景 `rgba(0,0,0,0.08)` 在 dark 模式略调深（用 token 或 `color-mix`）。  
- **结束条件**：优先监听 `window` 的 `scrollend`（若不支持则用 `scroll` 节流 + 速度阈值，或 **400ms** 兜底 `setTimeout`）；结束时 `isTransitioning = false`。  
- **快速连点**：每次发起新导航前 `clearTimeout` 旧兜底，并**单例**遮罩层，避免堆叠多个全屏层。  
- **`backdrop-filter` 不支持**：用 `@supports not ((backdrop-filter: blur(1px)))` 降级为纯半透明背景，不阻塞滚动。  
- **`pointer-events`**：遮罩在展示期间可为 `none` 以免挡导航点击；若产品希望「过渡中不可点正文」，可改为 `auto` 但须不与「导航可连点」冲突——**推荐** `pointer-events: none` 全屏，仅视觉反馈。

## 6. 文件与模块划分（建议）

| 路径 | 职责 |
|------|------|
| `src/components/SiteHeader.tsx` | 固定顶栏、品牌、三链接 |
| `src/components/ScrollBlurOverlay.tsx` | 模糊层显隐与滚动结束检测 |
| `src/components/ProjectsSection.tsx` | `#projects` 占位区块 |
| `src/components/ContactSection.tsx` | `#contact` 占位区块 |
| `src/App.tsx` | 组合 `SiteHeader`、overlay、`main` 与各 section |
| `src/index.css` | `--nav-height`、`scroll-behavior`、`@supports` 降级 |

可将 overlay 逻辑并入 `SiteHeader` 同文件以减少 prop drilling，以 tasks 为准。

## 7. 与现有 Hero / 主题的关系

- **ThemeToggle**：保留在 Hero 内或后续迁至导航右侧由产品决定；本 design **默认保留在 Hero**，避免与「右侧三链接」抢位；若迁移须在 tasks 中单独立项。  
- **Hero `min-height: 100svh`**：首屏 section 若包裹 `HeroSection`，`#home` 的 `scroll-margin-top` 仍适用；`100svh` 可保留为「首屏区块」高度。

## 8. 风险摘要

| 风险 | 缓解 |
|------|------|
| 固定导航遮挡标题 | `--nav-height` + `scroll-margin-top` + `main` `padding-top` |
| `scrollend` 兼容 | 兜底 `setTimeout` + `scroll` 节流二选一 |
| 模糊层性能 | 短时、单例、降低 blur 半径；reduced motion 关闭强模糊 |
