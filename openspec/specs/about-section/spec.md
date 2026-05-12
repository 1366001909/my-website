# Spec: 关于我区块布局与内容

## 概述

在 `#projects` 与 `#contact` 之间新增 `section#about`，展示个人照片与**三段**简介文案；遵守 `design.md` 中的响应式（`md:` 及以上左图右文，以下上图下文）、图片懒加载与无障碍关联（`aria-labelledby="about-heading"`，标题 `id="about-heading"`）。

## 行为规格

### 场景：区块位置与锚点

**Given** 页面已完整渲染主内容区  
**When** 用户按文档流自上而下查看各 section  
**Then** 顺序为 `#home` → `#projects` → **`#about`** → `#contact`；`#about` 根节点 `id` 为 `about` 且含 `section-anchor` 类

### 场景：宽屏布局

**Given** 视口宽度达到 `design.md` 约定的 `md` 断点及以上  
**When** 用户查看「关于我」区块  
**Then** 照片列与简介列横向并排（左图右文），简介内三段文本可读且语义顺序与数据源一致

### 场景：窄屏布局

**Given** 视口宽度小于 `md` 断点  
**When** 用户查看「关于我」区块  
**Then** 照片位于简介**上方**单列堆叠，无横向溢出导致整页不可读

### 场景：简介段落数量

**Given** `content` 中关于简介的数据已加载  
**When** 用户阅读「关于我」正文区  
**Then** 可见**恰好三段**独立段落（视觉与 DOM 上均可区分，例如三个 `<p>`）

## 边界与异常

### 场景：头像图片加载失败

**Given** 头像资源 URL 无效或网络错误导致 `<img>` 触发 `onError`  
**When** 页面展示该位置  
**Then** 显示中性占位（背景/图标或短提示文案，以 `design.md` 为准），页面不崩溃，简介与标题仍可访问
