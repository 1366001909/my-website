## Context

单页站点（React + Vite + Tailwind v4）当前顺序为 `#home` → `#projects` → `#contact`；`SiteHeader` 的 `SectionId` 与 `IntersectionObserver` 仅覆盖上述三段。`section-anchor` 已在全局 CSS 使用 `scroll-margin-top: var(--nav-height)`。需在「项目」与「联系我」之间插入 `#about`，并扩展主导航与滚动/高亮逻辑。

## Goals / Non-Goals

**Goals:**

- 在 DOM 顺序上固定为：`#projects` 之后、`#contact` 之前渲染「关于我」区块。
- 宽屏（`md` 及以上，断点与现有站点一致，取 Tailwind `md:` ≈ 768px）为**左图右文**；窄屏为**上图下文**（单列堆叠，先图后文）。
- 照片使用 `<img loading="lazy" decoding="async">`，`alt` 取自 `content`；加载失败时显示中性占位（背景 + 可选图标或短文案），不抛错。
- 简介三段来自 `src/content/about.ts`（导出如 `aboutParagraphs: [string, string, string]` 或 `aboutParagraphs: string[]` 且构建时校验长度为 3）。
- 品牌区：若干标签（名称 + 可选外链 `rel` 安全策略与项目区一致）；Logo **待定**项使用 **圆角矩形灰底占位**（`aspect-square` 或固定宽高），内嵌 **品牌缩写文字**（如首字母），不依赖外部占位图 URL。
- `#about` section：`className` 含 `section-anchor`；`border-t border-[var(--border)]`；背景**锁定**为 `bg-[var(--bg)]`（与 `#projects` 同色带时靠顶边分割区块）；`#contact` 保持现有 `bg-[var(--code-bg)]`。

**Non-Goals:**

- 不引入路由、CMS、上传与多语言（与 `proposal.md` Out of Scope 一致）。

## Decisions

| 决策 | 选项 | 理由 |
|------|------|------|
| Section `id` | `about` | 与 `proposal` 一致，hash 为 `#about`。 |
| 标题 `id` | `about-heading` | 与 `aria-labelledby="about-heading"` 一致。 |
| 组件与文件 | `src/components/AboutSection.tsx` + `src/content/about.ts` | 与 `HeroSection` / `content/hero` 模式一致。 |
| 照片路径 | `src/assets/about-photo.jpg`（或 `.webp`） | Vite 静态资源；若暂无文件，实施阶段可暂用公开占位 URL **仅开发**或提交极小占位图；**本设计锁定**：仓库内放置 **`src/assets/about-photo.jpg`**（实施者可复制占位二进制），避免生产依赖外网。 |
| 响应式断点 | Tailwind `md:`（768px） | 与全站一致。 |
| `SectionId` 联合类型 | `'home' \| 'projects' \| 'about' \| 'contact'` | 类型安全，与 `SiteHeader` 共用。 |
| 导航文案 | 「关于我」 | 与 `proposal` 一致。 |
| 品牌标签数据 | `src/content/about.ts` 内 `brandItems: { name: string; href?: string; abbr: string }[]` | `abbr` 用于 Logo 占位内文字；`href` 可选。 |
| IntersectionObserver | 将 `about` 并入现有列表与 `id` 判断 | 与 `home`/`projects`/`contact` 同一 `rootMargin`/`threshold`。 |
| 主规范同步 | `tasks.md` Phase 末或独立任务：更新 `openspec/specs/anchor-smooth-scroll`、`top-navigation`、`scroll-blur-feedback` | 与 `proposal` Impact 一致。 |

## Risks / Trade-offs

- **[Risk]** `#about` 高度较小导致 IO 在 `contact` 与 `about` 间频繁切换高亮 → **Mitigation**：沿用现有 `rootMargin` 与 ratio 排序；若验收抖动再微调（不在本 design 预先改数值）。
- **[Risk]** 四链在极窄屏换行拥挤 → **Mitigation**：允许 `flex-wrap` + 略小 `text-sm`（与现导航一致）；不引入汉堡菜单（Out of Scope）。

## Migration Plan

纯前端静态部署；无数据迁移。回滚：移除 `AboutSection` 与 `about` 相关类型及导航项即可。

## Open Questions

- 真实照片与品牌列表的最终文案由内容维护者在 `about.ts` 与资源目录中替换；本变更不阻塞合并。
