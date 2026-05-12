# Spec: 锚点平滑滚动 — 纳入 about（增量）

## 概述

单页可滚动目标在原有 `home`、`projects`、`contact` 基础上增加 **`about`**；程序化导航、首屏 hash 解析与 section 可见性检测均须识别 `about`，行为与既有三段一致（含 `scroll-margin-top`、`prefers-reduced-motion`）。

## 行为规格

### 场景：点击「关于我」滚动

**Given** 页面存在 `id="about"` 的 section  
**When** 用户点击导航中的「关于我」  
**Then** 视口以与「项目」「联系我」相同的方式滚动至 `#about`（减少动效偏好下为即时跳转），且 section 顶部与固定导航之间保留 `section-anchor` 所约定的间距

### 场景：URL 带 `#about` 进入

**Given** 用户通过带 `#about` 的 URL 打开站点  
**When** 首次布局完成后  
**Then** 页面定位到 `#about`；若 `id` 缺失则不得白屏崩溃（与主 spec 对未知 hash 的约束一致）

### 场景：滚动驱动的高亮状态

**Given** 用户通过滚轮或触摸缓慢经过 `#about`  
**When** `IntersectionObserver` 判定 `about` 为主可见 section  
**Then** 应用状态中的当前 section 可为 `about`，并驱动导航 `aria-current` 与「关于我」高亮一致

## 边界与异常

### 场景：未知 hash

**Given** URL hash 既不是 `home`、`projects`、`about`、`contact` 之一  
**When** 页面加载或刷新  
**Then** 回退逻辑与实施前对非法 hash 的行为一致（例如默认 `home` 且不抛异常）
