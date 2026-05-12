# Proposal: add-project-section

## Why

当前 `#projects` 区域仅为占位文案，无法展示个人作品与技术能力。  
在 Hero 下方提供**卡片式项目展示**，可让访客在首屏之后快速浏览代表作，并通过 GitHub 外链深入了解；同时通过 Hero **CTA** 一键跳转至项目区块，形成清晰的信息动线。

## What Changes

1. **项目展示区块（位于 Hero 下方）**  
   - 在现有 `id="projects"` 的 section 内，将占位内容**替换为**正式的项目展示布局（仍保持与顶部导航「项目」锚点一致）。  
   - **卡片式布局**：每张卡片至少包含：**项目截图**、**项目名称**、**项目简介**（对应需求中的「见解」式短文案）、**GitHub 链接**（`target="_blank"` + `rel="noopener noreferrer"`）。  
   - **最少展示 4 个项目**（数据层至少 4 条记录；不足 4 条时实现不得静默缩减为更少而不报错——开发阶段以占位数据保证 ≥4）。

2. **卡片悬浮微动效**  
   - 鼠标悬浮在单张卡片上时有**轻微**视觉反馈（如阴影、微位移、边框高亮等，具体在 `design.md` 锁定）。  
   - 须遵守 `prefers-reduced-motion: reduce` 降级策略。

3. **Hero Section 功能修改**  
   - 在 Hero 主文案区域增加 **CTA**（文案在 `design.md` / `content` 中约定，如「查看项目」），点击后与导航「项目」一致：**锚点跳转至 `#projects`**，并尽量与现有 `beginNavigate('projects')` 行为一致（含滚动模糊反馈，若技术实现上 Hero 无法直接调用父级回调，则在 `design.md` 明确采用 `a href="#projects"` + 全局监听等替代方案）。

4. **性能与资源**  
   - 项目截图使用 **lazy loading**（与 `openspec/config.yaml` 中全局约束一致）。

## Out of Scope

以下内容明确不在本次变更范围内，**严禁开发**：

- 不做**项目详情页**（无独立路由页、无 `/projects/:id` 等）  
- 不做**项目搜索**（无搜索框、无筛选器、无查询 API）

## Capabilities

### 1. 项目展示区块与卡片内容

在 Hero 下方 `#projects` 区域内展示至少 4 张项目卡片；每张卡片包含截图、名称、简介、GitHub 外链；布局响应式可读。

### 2. 项目卡片悬浮微动效

在支持动效的用户环境下提供轻微悬浮反馈；在减少动效偏好下弱化或关闭位移类效果。

### 3. Hero CTA 跳转至项目区块

Hero 内 CTA 点击后跳转至 `#projects` section，行为与站点其余锚点/导航策略协调一致。

## Impact

### 对现有功能的影响

- **`ProjectsSection.tsx`**：由占位改为卡片栅格 + 子组件（或拆分为 `ProjectCard`），可能新增 `src/content/projects.ts`（或 JSON）承载项目数据。  
- **`HeroSection.tsx`**：新增 CTA 控件及可选 props（若需与父级 `beginNavigate` 对齐）。  
- **`App.tsx`**：可能向 `HeroSection` 注入 `onNavigateToProjects` 回调；`#projects` section 结构保持，`aria-labelledby` 与 `projects-heading` 保留或迁移至区块标题。  
- **导航**：`SiteHeader` 已有「项目」链向 `#projects`，本变更**不改变**该锚点 `id`，避免破坏现有导航与 `anchor-smooth-scroll` 主 spec。  
- **资源与构建**：新增多张截图静态资源或远程占位图策略需在 `design.md` 明确；注意 GitHub Pages `base` 路径下**本地图片**引用方式。

### 风险与边界

- 图片过多或过大影响首屏与 LCP：须 lazy、合理尺寸与格式（如 WebP/AVIF 可选，以 tasks 分步落地）。  
- 外链 GitHub 可用性与 SEO：使用 `rel` 安全属性；无详情页时卡片信息须自包含。
