# 贡献指南

## 环境

- Node 20+
- Rust 1.80+
- VS Code + Tauri 插件 + rust-analyzer

```bash
npm install
npm run tauri dev
```

## 分支策略

```
main          ← 稳定版本（只从 develop 合并）
  ↑
develop       ← 日常集成（只从 feature 合并）
  ↑
feature/<模块>/<描述>
```

**分支命名示例：**

```
feature/animation/sprite-loader
feature/chat/streaming-reply
feature/system/tray-icon
fix/drag/transparent-window
```

**规则：**

1. 从 `develop` 拉分支，开发完提 PR 回 `develop`
2. **禁止**直接 push `main` 和 `develop`
3. 一个分支只做一件事
4. 分支名全小写，单词用 `-` 分隔

## Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>
```

**类型：**

| 类型 | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修 bug |
| `refactor` | 重构（不改变功能） |
| `style` | 格式（空格、分号，不改变逻辑） |
| `docs` | 文档 |
| `chore` | 杂项（依赖更新、配置） |
| `test` | 测试 |

**scope** 写模块名：`animation` / `chat` / `ui` / `store` / `tauri` / `docs`

**示例：**

```
feat(animation): add sprite sheet loader
fix(ui): drag conflict with native img behavior
refactor(store): extract chat store from pet store
docs: add architecture overview to README
chore: update tauri to 2.1
```

**规则：**
- subject 用英文，小写开头
- 不超过 72 字符
- 不加句号结尾
- 提交前确保 `tsc --noEmit` 通过

## PR 流程

1. **标题**：和 commit 规范一致，如 `feat(animation): add frame interpolation`
2. **描述**：写清楚三件事 — 做了什么、为什么做、怎么验证
3. **UI 改动必须附截图或录屏**
4. 至少 1 人 review + approve 后才能合并
5. 合并用 **Squash Merge**，保持 develop 干净

## 代码规范

### 文件命名

| 类型 | 规范 | 正确 | 错误 |
|------|------|------|------|
| 组件 | PascalCase | `PetCanvas.tsx` | `pet-canvas.tsx` |
| Store | `use` 前缀 | `usePetStore.ts` | `petStore.ts` |
| systems 模块 | 小写，描述功能 | `controller.ts`、`types.ts` | `AnimationController.ts` |
| Rust | snake_case | `ai_proxy.rs` | `aiProxy.rs` |

### 编写原则

1. **`components/` 只做渲染** — 不写 fetch、不写状态机、不写复杂算法
2. **`systems/` 纯逻辑** — 不 import React、不操作 DOM、不读 store
3. **`stores/` 只做桥接** — 定义 state、暴露 action，action 内部调 systems
4. **禁止 `any`** — 所有类型显式声明
5. **禁止 barrel export** — 不写 `index.ts` 重新导出，import 直接写完整路径
6. **一个文件一个主概念** — 别把多个 class/组件塞一个文件

### 新增一个动画

正确流程：

```
1. systems/animation/animations.ts     → 加一条动画定义
2. 在组件中调用 usePetStore.playAnimation("动画名")
```

不需要改 controller、types、store。

### 新增一个系统

正确流程：

```
1. systems/<新模块>/types.ts           → 定义类型
2. systems/<新模块>/engine.ts          → 写逻辑
3. stores/ 中新增或修改 store           → 桥接
4. components/ 中新增或修改组件          → 渲染
```

## 环境变量

敏感信息（API Key）不要硬编码，后续会统一管理。暂时在开发时手动调用：

```ts
useChatStore.getState().setConfig({ apiKey: "sk-xxx" });
```

## 问题？

在项目群聊或 issue 里提问，不要在代码注释里留 TODO 对话。
