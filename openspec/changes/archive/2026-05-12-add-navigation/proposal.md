# Proposal: add-navigation

## Why

当前站点为单页 Hero，缺少全局入口帮助访客在「首屏介绍、项目展示、联系方式」之间快速跳转。  
增加固定在顶部的导航栏，可强化个人品牌识别（左侧 Logo 或姓名），并降低长单页的信息寻找成本。

## What Changes

本次变更在前端单页内新增与调整以下内容：

1. **固定顶部导航栏**：`position: fixed`（或等效 `sticky` 策略需在 design 中固定一种），始终贴近视口顶部；合适的 `z-index`，避免被 Hero 背景层遮挡且不影响主题切换等交互。
2. **左侧品牌区**：展示个人 Logo（图片）**或** 姓名文案（二选一或可配置，以 design 为准），点击回到首屏 section。
3. **右侧导航链接**：**首页**、**项目**、**联系我**，对应页面内锚点（`#home` / `#projects` / `#contact` 等，具体 `id` 以 design 为准）。
4. **平滑滚动**：点击链接后，视口以平滑方式滚动至目标 section（`scroll-behavior: smooth` 或 `scrollIntoView({ behavior: 'smooth' })`，以 design 为准）。
5. **切换视觉反馈**：在发起锚点跳转至滚动完成（或超时兜底）期间，为页面增加**背景模糊类**效果（如 `backdrop-filter` 全屏半透明遮罩），以增强「正在切换」的感知；须与 `prefers-reduced-motion` 策略一致（见 spec）。

为承接锚点，需在页面中新增或标识 **项目**、**联系我** 对应 section（可为占位内容与后续变更扩展预留）。

## Out of Scope

以下内容明确不在本次变更范围内，**严禁开发**：

- 不做站内/站外**搜索**功能  
- 不做**多级下拉菜单**（仅平铺一级链接）  
- 不做**用户登录与注册**及相关 UI、路由、存储  

## Capabilities

### 1. 顶部导航栏展示与布局

提供固定顶栏、左侧品牌、右侧主导航链接；在桌面与窄屏下均可操作且不遮挡关键内容（见 spec 边界）。

### 2. 锚点平滑滚动与 Section 结构

页面具备可聚焦的 section 目标；导航点击触发平滑滚动至对应区域；URL hash 与键盘操作行为在 spec 中约定。

### 3. 滚动切换时的背景模糊反馈

在导航触发的页面内跳转过程中展示短时背景模糊（或等效）层，并在动效降级条件下可关闭或减弱。

## Impact

### 对现有功能的影响

- **布局**：固定导航会占用视口顶部高度，主内容区需增加 **padding-top / scroll-margin-top**，避免首屏标题被导航遮挡。  
- **Hero**：`HeroSection` 需有稳定 `id`（如 `home`）并可能调整首屏 `min-height` 与内部留白以配合 `scroll-margin`。  
- **主题与 Token**：导航样式应复用现有 CSS 变量（`--bg`、`--border`、`--text-h` 等），与亮/暗主题一致。  
- **GitHub Pages**：站内锚点为 `#fragment`，与 `base` 路径无冲突；若未来使用路由需另行评估。

### 风险与边界

- **无障碍**：跳过链接、焦点顺序、`aria-current` 与键盘激活需在 spec/design 中明确。  
- **动效偏好**：`prefers-reduced-motion: reduce` 时平滑滚动与模糊反馈须降级。  
- **性能**：`backdrop-filter` 在部分设备上开销较大，需限制持续时间并避免与粒子 Canvas 叠加过重（可仅在滚动过渡期启用遮罩层）。
