# Spec: 静态科技感背景

## 概述

Hero 背景由两层组成：底层为静态 CSS gradient；上层为静态 Canvas 粒子图案。本变更 **禁止** 任何持续动画（含 gradient 位移动画与粒子运动动画）；允许在页面初始化与窗口尺寸变化时对 Canvas 进行重绘以适配布局。

## 行为规格

### 场景：静态渐变底

**Given** 用户查看首屏 Hero  
**When** 页面处于稳定展示状态（无用户触发的布局变化）  
**Then** 底层背景为 CSS gradient 呈现的静态视觉效果，且不依赖 `requestAnimationFrame` 或 CSS keyframes 实现持续变化

### 场景：静态粒子叠加

**Given** Canvas 层已初始化  
**When** 用户查看首屏 Hero  
**Then** 粒子以静态图案形式呈现（无漂移、无闪烁循环），且不阻挡用户对前景可交互控件的指针操作（Canvas 层应 `pointer-events: none` 或等效策略）

### 场景：窗口尺寸变化后重绘

**Given** 用户调整浏览器窗口大小或设备发生方向旋转导致 Hero 尺寸变化  
**When** 布局稳定后  
**Then** Canvas 粒子层按新尺寸重绘，仍保持静态、无持续动画

## 边界与异常

### 场景：高分屏（device pixel ratio）

**Given** 设备 `devicePixelRatio` 大于 1  
**When** Canvas 完成绘制  
**Then** 粒子图案在物理像素上清晰可辨，不出现明显模糊（需按 DPR 缩放 canvas  backing store 或等效实现）

### 场景：Canvas 不可用

**Given** 浏览器不支持 Canvas 或绘制失败  
**When** 用户查看首屏  
**Then** 用户仍可见静态 CSS gradient 与 Hero 文案，页面不因背景层失败而空白或崩溃
