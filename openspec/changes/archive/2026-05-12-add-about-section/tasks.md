## 1. Phase 1 — 关于我 UI 与内容（本 Phase 完成后暂停待确认）

- [x] 1.1 新增 `src/content/about.ts`：导出 `aboutPhotoAlt`、`aboutParagraphs`（恰好三段文案）、`brandItems`（`name` / `abbr` / 可选 `href`），占位文案可后续替换
- [x] 1.2 在 `src/assets/` 添加 `about-photo.jpg`（或与 `design.md` 一致之文件名），确保 Vite 构建通过
- [x] 1.3 新建 `src/components/AboutSection.tsx`：`h2#about-heading`；`md:` 左图右文、默认上图下文；三段 `<p>`；图片 `loading="lazy"`、`decoding="async"`、`onError` 占位态
- [x] 1.4 底部品牌区：每项名称 + 灰底圆角占位块显示 `abbr`；有 `href` 时新标签页打开并带 `rel="noopener noreferrer"`
- [x] 1.5 `brandItems` 为空时不渲染品牌区容器（或构建期校验，与 spec 一致）

## 2. Phase 2 — 页面顺序与导航逻辑（本 Phase 完成后暂停待确认）

- [x] 2.1 在 `App.tsx` 的 `#projects` 与 `#contact` 之间插入 `section#about`（`section-anchor`、`border-t`、`bg-[var(--bg)]`、`aria-labelledby="about-heading"`）并渲染 `AboutSection`
- [x] 2.2 扩展 `SiteHeader.tsx`：`SectionId` 与 `links` 含 `about`，顺序为首页 → 项目 → 关于我 → 联系我
- [x] 2.3 更新 `App.tsx`：初始 hash、`beginNavigate`、`useLayoutEffect`、`IntersectionObserver` 的 id 列表与分支均包含 `about`

## 3. Phase 3 — 主规范同步（本 Phase 完成后暂停待确认）

- [x] 3.1 更新 `openspec/specs/anchor-smooth-scroll/spec.md`：纳入 `about` 与 `#about` URL 场景
- [x] 3.2 更新 `openspec/specs/top-navigation/spec.md`：四链顺序与「关于我」
- [x] 3.3 更新 `openspec/specs/scroll-blur-feedback/spec.md`：模糊反馈覆盖「关于我」导航点击

## 4. 验证

- [x] 4.1 运行项目构建与 lint；手测四段导航、直接打开 `#about`、图片加载失败占位、窄屏与桌面布局
