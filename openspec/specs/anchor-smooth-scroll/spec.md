# Spec: 锚点平滑滚动与 Section 结构

## 概述

单页内包含至少四个可滚动目标 section：首屏（首页）、项目、**关于我**、联系我；各 section 具备稳定 `id`（`home`、`projects`、`about`、`contact`）。用户通过导航链接触发平滑滚动至对应 `id` 元素。

## 行为规格

### 场景：点击「首页」滚动至首屏

**Given** 页面存在 `id` 为首屏约定值（见 `design.md`，例如 `home`）的 section  
**When** 用户点击导航中的「首页」  
**Then** 视口以平滑方式滚动至该 section，且该 section 顶部与导航底部之间保留合理间距（不被导航遮挡）

### 场景：点击「项目」「关于我」「联系我」

**Given** 页面存在 `id` 为项目、关于我、联系我所约定值的 section  
**When** 用户分别点击「项目」「关于我」「联系我」  
**Then** 视口以平滑方式滚动至对应 section

### 场景：URL 带 hash 进入

**Given** 用户通过带 hash 的 URL 打开页面（例如 `.../index.html#projects` 或 `.../index.html#about`）  
**When** 页面完成首次布局与必要脚本执行后  
**Then** 浏览器定位到对应 section（可为瞬时或平滑，以 `design.md` 统一约定）；若 `id` 不存在则不得白屏崩溃，应停留在文档顶部或安全位置并可在控制台或开发环境发现错误（生产环境可静默失败）

### 场景：非法或未知 hash

**Given** URL 的 hash 不是已约定的 section `id`（例如 `#foo`）  
**When** 页面完成首次加载  
**Then** 页面不得白屏崩溃；应回退到安全默认（例如停留在首屏或保持文档顶部），且仍可正常使用导航滚动至各 section

## 边界与异常

### 场景：用户偏好减少动效

**Given** 用户系统开启 `prefers-reduced-motion: reduce`  
**When** 用户点击任意导航锚点链接  
**Then** 滚动行为为即时跳转（`behavior: 'auto'` 或等效），且不依赖长时长平滑滚动作为唯一可达手段

### 场景：目标 section 高度不足一屏

**Given** 目标 section 内容高度小于视口高度  
**When** 用户滚动至该 section  
**Then** 页面仍可正常滚动，不出现布局断裂；底部留白或 `min-height` 策略以 `design.md` 为准
