# Aeri — Desktop AI Companion Pet

Tauri v2 桌面宠物应用。透明、置顶、可拖动的动画小狗，支持 AI 流式对话。

## 启动

```bash
npm install
npm run tauri dev
```

前提：Node 20+、Rust 1.80+。

## 技术栈

| 层 | 技术 |
|---|---|
| 桌面框架 | Tauri v2 (Rust) |
| 前端 | React 19 + TypeScript ~5.8 + Vite 7 |
| 状态 | Zustand 5 (persist → localStorage) |
| 样式 | 纯 CSS，单文件 `App.css` |
| AI | OpenAI 兼容 API (DeepSeek 默认) |

## 目录约定

- `components/` — React 渲染，不写业务逻辑、不调 API
- `systems/` — 纯 TS 逻辑，不 import React、不操作 DOM
- `stores/` — Zustand store，action 内调 systems，不做复杂算法
- `tauri/commands.ts` — Rust 命令的类型化封装
- `src-tauri/src/` — Rust 后端，命令注册在 `lib.rs`

## 当前状态 (2026-07-27)

- 6 个动画 (idle/happy/thinking/sleep/bounce/walk)
- AI 流式对话（context-aware system prompt）
- 设置面板：宠物形象/名字、语言（中/英/日）、AI 风格/频率/记忆、开机自启/置顶/缩放/托盘/快捷键
- Rust 插件：autostart、dialog、global-shortcut
- 5 个 commit 领先 origin/dev，待推送
