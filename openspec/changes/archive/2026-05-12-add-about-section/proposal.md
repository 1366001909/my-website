# Proposal: add-about-section

## Why

单页在「项目」与「联系我」之间缺少个人叙事空间。新增「关于我」区块，配合照片与多段简介，并展示品牌标签（Logo 待定），可让访客在浏览项目后、发起联系前更了解你。

## What Changes

### 1. 页面区块顺序（已确认）

在 `App.tsx` 的 `<main>` 内，**自上而下**顺序调整为：

1. `#home` — Hero（不变）  
2. `#projects` — 项目展示（不变）  
3. **`#about`** — **新增「关于我」**（位于项目模块**下方**、联系我模块**上方**）  
4. `#contact` — 联系我（不变）

新建 `section#about`，`class` 含 `section-anchor`，并配置 `scroll-margin-top: var(--nav-height)`（与现有 section 一致），`aria-labelledby` 指向区块内标题 `id`（在 `design.md` 固定命名，如 `about-heading`）。

### 2. 「关于我」区块内容

- **左侧**：个人照片一张（资源路径与 `alt` 在 `design.md` / `content` 约定；**`loading="lazy"`**，符合项目性能约束）。  
- **右侧**：个人简介 **三段**文字（建议 `src/content/about.ts` 或等价数据源）。  
- **下方**：**品牌标签**区（标签列表 + Logo 区；Logo **待定**时采用占位：文字缩写、灰色占位框或透明占位图，在 `design.md` 明确一种）。

**响应式**：宽屏 **左图右文**；窄屏 **上图下文**（或单列，在 `design` 锁定一种）。

### 3. 导航栏修改（已确认）

在 **`SiteHeader`** 中扩展主导航：

- 在「项目」与「联系我」之间增加 **「关于我」**，锚点为 **`#about`**。  
- 链接顺序：**首页 → 项目 → 关于我 → 联系我**。

配套代码调整（实施阶段）：

- `SectionId`（或等价类型）扩展为包含 `'about'`：`home` | `projects` | `about` | `contact`。  
- `App.tsx` 中 `beginNavigate`、`useLayoutEffect`（hash 初始滚动）、`IntersectionObserver` 观察列表均纳入 **`about`**。  
- 若 `HeroSection` 或其它入口需链到关于我，可在后续任务中单列（本 proposal 不强制）。

## Out of Scope

以下内容不在本变更范围内，**严禁开发**（可按后续需求另开变更）：

- 不做「关于我」**独立子路由/详情页**（仍为单页内锚点区块）。  
- 不做**后端 / CMS / 登录**，简介与图片仍为构建时或静态资源维护。  
- 不做**多语言**（除非单独 proposal）。  
- 不做**图片裁剪上传后台**。

## Capabilities

### 1. 关于我区块布局与内容

在 `#projects` 与 `#contact` 之间提供 `#about` section；左图右文（响应式）；三段简介；图片懒加载与失败降级。

### 2. 品牌标签与 Logo 占位

区块下方展示品牌标签；Logo 待定期间使用约定占位，不阻塞上线。

### 3. 主导航扩展至「关于我」

顶栏增加「关于我」链至 `#about`，与现有平滑滚动、模糊反馈、`aria-current` 逻辑兼容。

## Impact

- **`App.tsx`**：插入 `AboutSection`（或等价组件）于 `projects` 与 `contact` 之间；扩展 section id 与 IO / hash 逻辑。  
- **`SiteHeader.tsx`**：`SectionId`、链接数组、`NavAnchor` 类型与顺序。  
- **`openspec/specs/anchor-smooth-scroll`**（主 spec）：若曾限定仅三个 `id`，同步后需在实施或 **sync-specs** 时补充 `about` 相关场景（另开同步任务或本变更 `tasks` 含「更新主 spec」一项）。  
- **视觉**：新增 `section` 边框/背景与 `#contact` 区分，避免粘连（具体 token 在 `design.md`）。
