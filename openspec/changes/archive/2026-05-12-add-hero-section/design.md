# Design: add-hero-section

## 1. 目标与约束

- 对齐 `proposal.md` 与三份 `spec.md`：`hero-first-screen`、`static-tech-background`、`theme-toggle`。
- **禁止** 任何持续动画（无 CSS keyframes 循环、无 `requestAnimationFrame` 粒子动画）。
- **禁止** navbar、后端 API（见 proposal Out of Scope）。
- 技术栈：React 19 + Vite + TypeScript + Tailwind CSS v4；部署 GitHub Pages，`base` 为 `/my-website/`（内部路由与资源路径需注意，本变更以单页首屏为主）。

## 2. 总体结构

采用单页内 **Hero 区域** 为首页首屏主体；背景与前景分层，主题由根节点属性驱动 CSS 变量。

```text
App (或 Home 根组件)
└── <main> / 片段
    └── <section class="hero" aria-label="...">
          ├── 背景层 A：div（CSS gradient，全铺）
          ├── 背景层 B：canvas（静态粒子，absolute 铺满，pointer-events: none）
          └── 前景层：article / div（文案 + 主题切换按钮）
```

- **Hero 容器**：`position: relative`；最小高度 `min-height: 100svh`；前景层 `position: relative; z-index` 高于 canvas。
- **居中**：推荐 CSS Grid `place-items: center` 或 Flexbox，保证文案块 `max-width`（例如 `min(40rem, 92vw)`）避免超宽屏行过长。

## 3. Hero 文案与语义

- `h1`：仅一处，用于姓名（满足 spec 主标题层级）。
- 职业：可用 `p` + class，或 `p`/`div` + `aria-labelledby` 与 `h1` 关联（若需要更严谨可给职业行 `id`）。
- 一句话介绍：独立 `p`。
- 文案内容来源：首版可硬编码于组件常量或单独 `content.ts` 便于后续替换；**不**引入 CMS/API。

## 4. 静态科技感背景

### 4.1 CSS gradient 底层

- 使用 Tailwind 任意值或 `index.css` 中 scoped 到 `[data-theme]` 的变量，定义 light/dark 两套 gradient stop 颜色。
- 仅静态渐变，**不**使用 `animation` / `@keyframes` 移动背景。

### 4.2 Canvas 静态粒子

- **初始化**：`useLayoutEffect` 或 `useEffect` 中读取容器 `clientWidth` / `clientHeight`，按固定随机种子或 `Math.random` 一次性生成粒子坐标（数量与视口宽度分档，例如窄屏 ~40、宽屏 ~120，具体数值实现时调参）。
- **绘制**：单帧 `fillRect` / `arc` 等完成；**不**启动动画循环。
- **resize**：监听 `window.resize`（建议 `requestAnimationFrame` 防抖仅用于合并 resize 回调，**不**用于每帧重绘动画；或使用 `ResizeObserver` 观察 Hero 容器）。触发后清空并重算布局、重绘一帧静态粒子。
- **DPR**：`const dpr = Math.min(window.devicePixelRatio ?? 1, 2)`，设置 `canvas.width/height` 为 `cssSize * dpr`，`ctx.scale(dpr, dpr)`，保证高分屏清晰。
- **交互**：canvas 样式 `pointer-events: none`，避免挡住主题按钮。
- **失败降级**：`try/catch` 包裹获取 context 与绘制；失败时移除 canvas 或隐藏，仅保留 CSS gradient（对齐 static-tech-background spec）。

## 5. 主题切换与 token

### 5.1 DOM 与存储

- 在 `document.documentElement`（`<html>`）上设置 `data-theme="light" | "dark"`。
- `localStorage` 键名约定：`theme`（值仅 `light` | `dark`）。读取时校验；非法值删除键并回退系统偏好（对齐 theme-toggle spec）。
- **首屏闪烁**：在 `main.tsx` 最尽早执行一段内联脚本（Vite 可用 `index.html` 内联 script 或极早执行的模块）读取 `localStorage` 并设置 `data-theme`，再挂载 React；若无法内联，至少在根组件首次渲染前同步读取一次（可能仍有轻微闪烁，设计接受度需在实现阶段验证）。

### 5.2 与现有 `index.css` 的关系

- 当前存在 `@media (prefers-color-scheme: dark)` 下覆写 `:root` 变量。
- **设计决策**：以 `html[data-theme="light"]` / `html[data-theme="dark"]` 显式变量集为**最高优先级**；当未设置 `data-theme` 时仍可用 `@media (prefers-color-scheme: dark)` 作为默认。用户手动切换后，`data-theme` 固定，**不再**随系统实时变化（直至用户再次切换或清除存储——清除可作为可选未来增强，本变更不要求）。

### 5.3 主题切换控件

- `button type="button"`，`aria-label` 描述「切换明亮/暗黑主题」；`aria-pressed` 可选绑定到「当前是否为 dark」。
- `:focus-visible` 样式与现有站点风格一致。

## 6. 文件与模块划分（建议）

| 路径 | 职责 |
|------|------|
| `src/App.tsx`（或拆出的 `src/pages/Home.tsx`） | 组合 Hero、挂载主题切换与内容 |
| `src/components/HeroSection.tsx`（新建） | 布局、文案、背景层组合 |
| `src/components/HeroParticles.tsx`（新建） | Canvas 初始化、resize、DPR、错误处理 |
| `src/lib/theme.ts`（新建） | `getStoredTheme`、`setTheme`、`resolveInitialTheme`、合法值校验 |
| `src/index.css` | `data-theme` 下 CSS 变量、Hero 必要全局 token；逐步替代纯媒体查询依赖 |
| `index.html`（可选） | 极早主题脚本，减轻 FOUC |

具体文件名以实现阶段为准；若保持单文件以降低改动面，可将 Hero + Canvas 暂放 `App.tsx`，但需在 tasks 中注明后续可拆分。

## 7. 可访问性与性能

- 对比度：若渐变与粒子偏亮/偏暗，前景层可增加半透明 `backdrop` 或文字 `text-shadow`（静态，非动画）。
- 性能：无 rAF 循环；resize 防抖；粒子数量有上限；首屏不阻塞 LCP 文本（文案应在 HTML/React 首屏结构中优先）。
- 图片：本 Hero 以 CSS + Canvas 为主；若保留头像等图片，遵守项目 lazy 约定（本 proposal 未要求头像，可不引入）。

## 8. 与下游 tasks 的衔接

- Phase 1：主题基础设施（`theme.ts`、`data-theme`、`index.css` 变量、`localStorage` + 非法值处理）。
- Phase 2：Hero 布局与文案替换模板首屏。
- Phase 3：Canvas 静态粒子 + resize + DPR + 降级。
- Phase 4：清理旧模板区块（如 Vite 默认 counter/文档区）或移出首屏——**范围以 proposal 为准**；若 proposal 仅要求「首屏为 Hero」，可在 tasks 中明确是否删除 `#next-steps` 或整页仅保留 Hero（需你确认产品意图，默认设计为「首页以 Hero 为主，其余内容可后续变更」）。

## 9. 风险摘要

| 风险 | 缓解 |
|------|------|
| 主题脚本过晚导致 FOUC | `index.html` 内联极早脚本或同步读取 |
| `localStorage` 异常 | try/catch，会话内仍切换 |
| Canvas 模糊 | DPR 上限 2 + 正确 backing store |
| 与「无动画」冲突 | Code review 禁止 rAF 持续循环与 keyframes 背景动画 |
