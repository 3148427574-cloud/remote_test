# Aeri — Desktop AI Companion

住在你桌面上的 AI 伙伴。

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Tauri v2 |
| 前端 | React 19 + TypeScript |
| 状态 | Zustand |
| 后端 | Rust |
| 构建 | Vite 7 |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发（桌面窗口 + 热更新）
npm run tauri dev
```

前提：Node 20+、Rust 1.80+。

---

## 项目结构

```
src/
├── App.tsx                    # 根组件，主循环（Tick Loop）
├── main.tsx                   # React 入口
│
├── components/                # UI 组件
│   ├── pet/                   #   宠物渲染 + 拖动
│   │   ├── PetCanvas.tsx      #     画布：渲染当前动画帧
│   │   └── DragLayer.tsx      #     拖动 + 点击交互
│   ├── overlays/              #   浮层 UI
│   │   ├── SpeechBubble.tsx   #     对话气泡
│   │   └── ChatInput.tsx      #     聊天输入框
│   └── common/                #   通用组件
│
├── systems/                   # 引擎逻辑（纯 TS，不依赖 React）
│   ├── animation/             #   动画系统
│   │   ├── types.ts           #     类型定义
│   │   ├── animations.ts      #     动画数据（idle / happy / thinking …）
│   │   └── controller.ts      #     帧推进控制器
│   ├── behavior/              #   自主行为
│   │   └── idle.ts            #     空闲时随机动作
│   ├── emotion/               #   情绪系统（待实现）
│   │   ├── types.ts
│   │   └── engine.ts
│   └── ai/                    #   AI 对话
│       └── chat.ts            #     LLM 流式 API 调用
│
├── stores/                    # Zustand 状态桥接
│   ├── usePetStore.ts         #   宠物状态（位置/动画/情绪）
│   ├── useChatStore.ts        #   对话状态（消息/流式）
│   └── useSettingsStore.ts    #   设置（待实现）
│
├── tauri/                     # Rust ↔ 前端桥接
│   ├── commands.ts            #   类型化的 Tauri 命令
│   ├── storage.ts             #   本地持久化
│   ├── window.ts              #   窗口操作
│   └── system.ts              #   系统托盘 / 开机启动
│
└── assets/
    ├── images/                # 静态图片
    ├── sprites/               # 精灵帧序列
    └── sounds/                # 音效

src-tauri/                     # Rust 后端
└── src/
    ├── main.rs                # 入口
    ├── lib.rs                 # 插件注册
    ├── commands/              # Tauri 命令
    └── models/                # 数据模型
```

## 模块职责速查

| 目录 | 可以做的事 | 不能做的事 |
|------|-----------|-----------|
| `components/` | 读 store、渲染 UI、处理用户输入 | 写业务逻辑、调 API |
| `systems/` | 写算法、状态机、调外部 API | import React、操作 DOM |
| `stores/` | 定义 state + action、桥接 systems | 写复杂算法 |
| `tauri/` | 封装 Rust 命令 | 写 UI、写业务 |
| `assets/` | 放静态资源 | - |

## 核心设计

**Tick Loop** — 整个宠物的心跳。`App.tsx` 中 `requestAnimationFrame` 以 30fps 运行，每帧依次推进：

```
动画 controller.tick()
  → 自主行为 scheduler
    → 情绪衰减
      → store 更新
        → React 重渲染
```

**数据流** — 单向：

```
UI 事件 → Store action → systems 纯函数 → Store 更新 → UI 重渲染
                              ↓
                          tauri/ → Rust → 文件/API
```
