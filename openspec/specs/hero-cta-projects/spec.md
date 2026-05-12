# Spec: Hero CTA 跳转至项目区块

## 概述

在 Hero Section 内提供主要行动按钮（CTA），点击后跳转至页面内 `#projects` 项目展示区块，与站点「项目」导航语义一致。

## 行为规格

### 场景：点击 Hero CTA

**Given** 用户位于首屏且 Hero 已渲染 CTA  
**When** 用户点击该 CTA  
**Then** 视口滚动至 `id="projects"` 的 section 可见区域，且标题区不被固定导航遮挡（依赖既有 `scroll-margin-top` / `padding-top` 策略）

### 场景：键盘激活 CTA

**Given** 用户使用键盘将焦点置于 Hero CTA 上  
**When** 用户按下 Enter 或 Space（若控件为 `button`）  
**Then** 触发与鼠标点击一致的跳转至 `#projects` 行为

## 边界与异常

### 场景：`#projects` 区域尚未挂载（极端）

**Given** 因实现错误导致页面中不存在 `id="projects"` 的元素  
**When** 用户点击 Hero CTA  
**Then** 页面不得崩溃；实现应在开发阶段通过类型与集成测试保证该情况不发生

### 场景：减少动效下的滚动

**Given** 用户开启 `prefers-reduced-motion: reduce`  
**When** 用户通过 Hero CTA 跳转至 `#projects`  
**Then** 滚动行为为即时或短时（与全局 `getScrollBehavior()` / CSS 策略一致），不得强制依赖长时长平滑滚动作为唯一路径
