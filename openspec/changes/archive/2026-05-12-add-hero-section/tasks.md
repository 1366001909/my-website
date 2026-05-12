# Tasks: add-hero-section

> **流程约定（项目规则）**：每完成下方 **一个 Phase** 即停止，总结变更并等待确认后再进入下一 Phase。

---

## Phase 1 — 主题基础设施（`data-theme` + `localStorage`）

- [x] 新建 `src/lib/theme.ts`：导出 `Theme` 类型（`'light' | 'dark'`）、`STORAGE_KEY`（`'theme'`）、`isTheme(value: unknown)` 校验函数
- [x] 在 `theme.ts` 实现 `getSystemTheme()`：基于 `window.matchMedia('(prefers-color-scheme: dark)')` 返回 `light` 或 `dark`
- [x] 在 `theme.ts` 实现 `readStoredTheme()`：读 `localStorage`；非法值则 `removeItem` 并返回 `null`；`try/catch` 失败返回 `null`
- [x] 在 `theme.ts` 实现 `resolveInitialTheme()`：有合法存储则用存储，否则用 `getSystemTheme()`
- [x] 在 `theme.ts` 实现 `applyThemeToDocument(theme: Theme)`：设置 `document.documentElement.dataset.theme`
- [x] 在 `theme.ts` 实现 `persistTheme(theme: Theme)`：`try/catch` 写入 `localStorage`，失败不抛到 UI
- [x] 在 `index.html` 增加极早内联脚本：在 body 解析后、`type="module"` 主脚本前，同步读存储并设置 `document.documentElement.dataset.theme`（减轻 FOUC）；脚本需与 `STORAGE_KEY` 约定一致
- [x] 调整 `src/index.css`：为 `html[data-theme="light"]`、`html[data-theme="dark"]` 定义与现有 `:root` 对齐的 CSS 变量；未设置 `data-theme` 时保留现有 `@media (prefers-color-scheme: dark)` 行为

---

## Phase 2 — Hero 布局与文案（不含 Canvas）

- [x] 新建 `src/components/HeroSection.tsx`：`section` 根节点，`min-height: 100svh`，`position: relative`，语义化 `aria-label`（如「介绍」）
- [x] 在 `HeroSection` 内增加静态 CSS gradient 背景层（`div` 绝对定位铺满，`z-index` 低于前景）
- [x] 前景容器：`max-width`（如 `min(40rem, 92vw)`）、水平垂直居中（Grid 或 Flex）
- [x] 文案结构：`h1` 姓名；`p` 职业；`p` 一句话介绍；内容可先硬编码常量或 `src/content/hero.ts`
- [x] 新建 `src/components/ThemeToggle.tsx`：`button type="button"`，`aria-label` 与可选 `aria-pressed`；点击在 `light`/`dark` 间切换并调用 `applyThemeToDocument` + `persistTheme`
- [x] 在 `main.tsx`：`createRoot` 前再次调用 `resolveInitialTheme` + `applyTheme`（与内联脚本双保险，避免仅模块加载顺序问题）
- [x] 重构 `src/App.tsx`：以 `HeroSection` 为首页主体，移除首屏 counter / Vite 演示文案与相关 `useState`（与 Hero 无关部分留待 Phase 4 或本步一并下线，按你确认）
- [x] 按需调整 `src/index.css` 中 `#root` 约束（如 `max-width`、边框）：使 Hero 全宽观感符合设计（若保留居中内容区，明确「背景全宽 / 文案居中」策略）

---

## Phase 3 — Canvas 静态粒子层

- [x] 新建 `src/components/HeroParticles.tsx`：接收容器 ref 或由父传入尺寸；`canvas` 绝对定位铺满父级，`pointer-events: none`，`z-index` 介于渐变与前景之间
- [x] 实现 DPR：`const dpr = Math.min(window.devicePixelRatio ?? 1, 2)`，正确设置 `canvas` 像素尺寸与 `ctx.scale`
- [x] 实现静态绘制：根据宽度分档粒子数量上限；单帧绘制圆点（无 `requestAnimationFrame` 持续循环）
- [x] 实现 `resize`：`ResizeObserver` 或 `window.resize` + `requestAnimationFrame` **仅用于合并 resize 回调**（非动画循环），触发后重算尺寸并重绘一帧
- [x] `try/catch`：`getContext` 与绘制失败则隐藏 canvas 或卸载，不阻塞页面
- [x] 将 `HeroParticles` 嵌入 `HeroSection`，确认主题切换与按钮点击不被遮挡

---

## Phase 4 — 收尾与回归

- [x] 删除或移出首页不再需要的 Vite 模板区块（`#next-steps`、`ticks`、`#spacer` 等），避免与 proposal「首屏为个人品牌」冲突；删除未使用的 `App.css` 规则与 `assets` 引用（若已无引用）
- [x] 运行 `pnpm/npm run build` 与 `lint`，修复类型与 ESLint 问题
- [x] 手测清单：无存储首访随系统主题；切换后刷新保持；`localStorage` 手动写入非法值后刷新回退；窄屏长文案无横向溢出；无持续动画（含控制台无 rAF 粒子循环）（用户已确认验证通过）

---

## 依赖与顺序

- Phase 2 依赖 Phase 1（主题类名与变量可用）。
- Phase 3 依赖 Phase 2（Hero 容器尺寸与层级稳定）。
- Phase 4 可在 Phase 2 完成后并行准备，但建议在 Phase 3 合并后再做统一清理与构建验证。

---

## 备注（Out of Scope 自检）

- 不添加 keyframes / CSS animation 驱动背景。
- 不添加 `requestAnimationFrame` 驱动的粒子运动。
- 不实现 navbar、不调用任何后端 API。
