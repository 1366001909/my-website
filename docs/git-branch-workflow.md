# Git 分支与 GitHub Pages 部署说明

> 个人品牌站仓库的分支分工与日常操作备忘，避免「只 push main 却忘了部署」。

## 三个分支各干什么

| 分支 | 内容 | 用途 | 是否手写代码 |
|------|------|------|--------------|
| **test-dev** | 开发中的源码 | 新功能、试验性改动 | ✅ 是 |
| **main** | 合并后的稳定源码 | 版本主线，与远程同步 | ✅ 是（通常经 merge 进入） |
| **gh-pages** | 构建产物（`dist/`） | GitHub Pages 对外展示 | ❌ 否，仅由部署命令更新 |

**线上访问地址：** https://1366001909.github.io/my-website/

---

## 关系示意

```
test-dev（开发）  ──merge──►  main（稳定源码）  ──npm run deploy──►  gh-pages（线上静态站）
```

- **test-dev → main**：合并**源代码**（merge 或 Pull Request）。
- **main → gh-pages**：**不是 merge**，而是本地构建后，由 `gh-pages` 工具把 `dist/` 推送到 `gh-pages` 分支。

---

## 推荐工作流

### 1. 在 test-dev 开发

```powershell
git checkout test-dev
# 改代码 …
git add .
git commit -m "说明本次改动"
git push origin test-dev
```

### 2. 合并到 main

```powershell
git checkout main
git pull origin main
git merge test-dev
git push origin main
```

### 3. 部署 GitHub Pages（在 main 上执行）

```powershell
git checkout main
npm run deploy
```

`deploy` 脚本等价于：`npm run build && gh-pages -d dist`

- 先根据 **main** 上的源码构建 `dist/`
- 再将静态文件发布到远程 **gh-pages** 分支
- GitHub 通常 1～3 分钟后更新；未生效时可强制刷新（Ctrl+F5）

---

## 常见误区

| 误区 | 正确理解 |
|------|----------|
| push 了 main，Pages 就会自动更新 | ❌ 本项目无自动 CI，必须手动 `npm run deploy` |
| 把 main merge 到 gh-pages | ❌ gh-pages 存的是构建结果，用 deploy 命令更新 |
| 在 gh-pages 分支改代码 | ❌ 下次 deploy 会被覆盖；应改 main / test-dev |

---

## GitHub Pages 配置检查

仓库 **Settings → Pages** 建议为：

- **Source**：Deploy from a branch
- **Branch**：`gh-pages` / `/ (root)`

---

## 与本项目相关的其他配置

- Vite `base` 为 `/my-website/`，与 GitHub Pages 子路径一致（见 `vite.config.ts`）。
- 架构说明见 [architecture-exploration.md](./architecture-exploration.md)。
