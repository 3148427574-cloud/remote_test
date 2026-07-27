# Aeri 设置面板增强 — 开发设计文档

## 1. 技术栈（严格约束）

| 层级 | 技术 | 约束说明 |
|------|------|----------|
| 前端框架 | **React 19.1** | 不得引入 Vue/Angular 等其他框架 |
| 语言 | **TypeScript ~5.8** | 严格模式，所有新文件必须 `.tsx`/`.ts` |
| 状态管理 | **Zustand 5.x** | 不引入 Redux/Jotai 等替代方案 |
| 打包 | **Vite 7** | 继续使用 `@vitejs/plugin-react` |
| 桌面框架 | **Tauri v2** | 所有系统调用通过 Tauri IPC |
| 后端语言 | **Rust** (2021 edition) | 新增能力用 Tauri Plugin 或自定义 command |
| 样式 | **纯 CSS** | 写在现有 `App.css`，不用 Tailwind/CSS-in-JS |
| 后端插件 | **Tauri Plugin 体系** | autostart 使用 `tauri-plugin-autostart` |

**禁止引入的依赖：**
- 任何额外的 UI 框架 / CSS 框架
- 任何新的状态管理库
- 任何路由库（继续单页面架构）

---

## 2. 设置项总览

### 2.1 已有（保留）

| 设置项 | 存储 Key | 类型 | UI |
|--------|----------|------|-----|
| API URL | `baseUrl` | `string` | text input |
| API Key | `apiKey` | `string` | password input |
| Model | `model` | `string` | text input |
| City | `city` | `string` | text input |

### 2.2 本期新增

| 设置项 | 存储 Key | 类型 | UI | 后端依赖 |
|--------|----------|------|-----|----------|
| 宠物名字 | `petName` | `string` | text input | — |
| 宠物形象 | `petAvatar` | `"puppy" \| "cat" \| "custom"` | 图片选择器 / 预设切换 | `tauri-plugin-dialog` |
| 开机自启动 | `autoLaunch` | `boolean` | toggle switch | `tauri-plugin-autostart` |
| 启动显示 | `startupBehavior` | `"show" \| "tray"` | 下拉选 | `tauri-plugin-autostart` + Tray |
| 窗口置顶 | `alwaysOnTop` | `boolean` | toggle switch | Tauri window API |
| 窗口缩放 | `windowScale` | `0.8 \| 1.0 \| 1.2` | 分段按钮 | Tauri window API |
| 互动频率 | `interactionFrequency` | `"active" \| "normal" \| "quiet"` | 分段按钮 | — |
| AI 回复风格 | `replyStyle` | `"cute" \| "concise" \| "formal"` | 分段按钮 | — |
| 聊天记忆 | `chatMemory` | `boolean` | toggle switch | — |
| 聊天快捷键 | `chatHotkey` | `string` | 按键捕获 input | `tauri-plugin-global-shortcut` |
| 版本号 | `appVersion` | `string` (只读) | 纯文本展示 | `Cargo.toml` |

### 2.3 后期预留字段（不实现，仅占位）

| 设置项 | 说明 |
|--------|------|
| 天气 API Key | 用于切换 OpenWeatherMap provider |
| 语音对话 | TTS / STT 开关 |
| 主题色 | 宠物毛色 / UI 主题切换 |
| 多语言 | i18n 切换 |
| 通知开关 | 系统通知提醒 |
| 透明度 | 窗口透明度 slider |

---

## 3. 架构设计

### 3.1 新增 Store：`useSettingsStore`

将设置相关状态从 `useChatStore` 中分离，形成独立的 `useSettingsStore.ts`：

```typescript
// src/stores/useSettingsStore.ts

interface SettingsState {
  // 已有（从 useChatStore 迁移）
  config: ChatConfig;       // { baseUrl, apiKey, model }
  city: string;

  // UI flags（从 useChatStore 迁移）
  showSettings: boolean;

  // 本期新增 — 宠物
  petName: string;
  petAvatar: PetAvatar;

  // 本期新增 — 应用行为
  autoLaunch: boolean;
  startupBehavior: StartupBehavior;
  alwaysOnTop: boolean;
  windowScale: WindowScale;
  chatHotkey: string;

  // 本期新增 — AI 对话
  interactionFrequency: InteractionFrequency;
  replyStyle: ReplyStyle;
  chatMemory: boolean;

  // 只读
  appVersion: string;

  // 持久化状态
  _hydrated: boolean;
}

interface SettingsActions {
  // 已有
  setConfig: (cfg: Partial<ChatConfig>) => void;
  setCity: (city: string) => void;
  toggleSettings: () => void;

  // 宠物
  setPetName: (name: string) => void;
  setPetAvatar: (avatar: PetAvatar) => void;

  // 应用行为
  setAutoLaunch: (on: boolean) => void;
  setStartupBehavior: (b: StartupBehavior) => void;
  setAlwaysOnTop: (on: boolean) => void;
  setWindowScale: (scale: WindowScale) => void;
  setChatHotkey: (hk: string) => void;

  // AI 对话
  setInteractionFrequency: (f: InteractionFrequency) => void;
  setReplyStyle: (s: ReplyStyle) => void;
  setChatMemory: (on: boolean) => void;

  // 初始化
  hydrate: () => Promise<void>;
}

type PetAvatar = { type: "puppy" } | { type: "cat" } | { type: "custom"; path: string };
type StartupBehavior = "show" | "tray";
type WindowScale = 0.8 | 1.0 | 1.2;
type InteractionFrequency = "active" | "normal" | "quiet";
type ReplyStyle = "cute" | "concise" | "formal";
```

**关键设计：**
- 使用 Zustand `persist` 中间件，存储到 `localStorage`（前端轻量持久化，无需 Rust 侧 storage）
- `showInput` / `showSettings` 等 UI toggle 仍留在 store 中（不持久化）
- 向后兼容：`useChatStore` 中需要引用的设置字段通过 selector 桥接到新 store

### 3.2 重构影响范围（极简改造）

- `useChatStore` 删除 `config`、`city`、`showSettings`、`toggleSettings`、`setConfig`、`setCity`
- `SettingsPanel` 改为读写 `useSettingsStore`
- `chat.ts` 中的 `config` 和 `city` 改为从 `useSettingsStore` 读取
- `App.tsx` 中的 `showSettings` / `toggleSettings` 引用改为 `useSettingsStore`

**迁移原则：重构部分仅限于第 6 节所列文件，不动其他任何模块。**

### 3.3 组件拆分

`SettingsPanel.tsx` 当前是一个 77 行的单一组件。重构后拆分为：

```
src/components/overlays/
├── SettingsPanel.tsx         # 容器：遮罩 + 分组布局 + 关闭按钮
├── settings/
│   ├── ApiSettings.tsx       # API URL / Key / Model / City
│   ├── PetSettings.tsx       # 宠物名字 + 形象选择器
│   ├── BehaviorSettings.tsx  # 互动频率 / AI 回复风格 / 聊天记忆
│   ├── AppSettings.tsx       # 自启 / 启动显示 / 置顶 / 缩放 / 快捷键
│   └── AboutSection.tsx      # 版本号展示
```

### 3.4 Tauri 后端新增

#### a) `tauri-plugin-autostart`

```toml
# Cargo.toml 新增
tauri-plugin-autostart = "2"
```

前端通过 invoke 调用 `plugin:autostart|enable` / `plugin:autostart|disable` / `plugin:autostart|is_enabled`。

#### b) `tauri-plugin-global-shortcut`（聊天快捷键）

```toml
tauri-plugin-global-shortcut = "2"
```

注册全局快捷键，前端监听事件触发聊天输入框。

#### c) 版本号 command

```rust
// lib.rs 新增
#[tauri::command]
fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
```

#### d) 自定义宠物图片存取

```toml
tauri-plugin-dialog = "2"
```

打开文件选择器，复制图片到 app data dir。

#### e) 窗口控制 commands

```rust
// 置顶切换
#[tauri::command]
fn set_always_on_top(on: bool) { ... }

// 缩放切换（0.8 / 1.0 / 1.2）
#[tauri::command]
fn set_window_scale(scale: f64) { ... }
```

#### f) 系统托盘（启动显示 "tray" 模式）

Tauri v2 原生支持 `tauri::tray::TrayIconBuilder`，无需额外插件。启动时根据 `startupBehavior` 决定是否隐藏窗口到托盘。

---

## 4. 分支设计（并行开发 + 顺序合并）

```
main ────────────────────────────────────────────────────────
         ↘                                                    ↗
dev ────→ feature/settings-store-refactor ──────────────────→
              ↘                                                ↗
                feature/settings-api-server  ──────────────────→
              ↘                                                ↗
                feature/settings-pet ──────────────────────────→
              ↘                                                ↗
                feature/settings-app-behavior ─────────────────→
```

### 分支 Part 1：`feature/settings-store-refactor`（基础，必须先完成）

- 新建 `useSettingsStore.ts`（含 persist）
- 修改 `useChatStore.ts`（删除迁移走的字段）
- 修改所有引用旧字段的文件（`chat.ts` / `App.tsx` / `SettingsPanel.tsx` 等）
- 验证一切正常工作

**可并行开始：** Part 2 / 3 / 4 可以基于 Part 1 分支各自独立开发。

### 分支 Part 2：`feature/settings-api-server`（Tauri 后端基础设施）

- 添加 `get_version` command
- 添加 `tauri-plugin-autostart`、`tauri-plugin-dialog`、`tauri-plugin-global-shortcut` 依赖
- 封装 `set_always_on_top` / `set_window_scale` commands
- 构建系统托盘基础能力
- 在 `capabilities/default.json` 添加新权限
- 暴露所有新 command 类型定义给前端（`src/tauri/commands.ts`）

### 分支 Part 3：`feature/settings-pet`（宠物设置）

- 实现 `PetSettings.tsx`（名字 + 形象预设选择）
- 前端调用 Tauri dialog 选择自定义图片
- 预设形象至少包含：默认小狗、小猫、自定义图片
- `PetCanvas` 适配新 image 路径

### 分支 Part 4：`feature/settings-app-behavior`（应用行为 + AI 设置 + 关于）

- 实现 `BehaviorSettings.tsx`（互动频率 / AI 回复风格 / 聊天记忆）
- 实现 `AppSettings.tsx`（自启 / 启动显示 / 置顶 / 缩放 / 快捷键）
- 实现 `AboutSection.tsx`（版本号）
- `chat.ts` 根据 `replyStyle` 动态调整 system prompt
- `idle.ts` 根据 `interactionFrequency` 调整自主行为间隔
- 新 UI 组件的 CSS 样式

### 合并顺序

```
Part 1 → dev
  ↓
Part 2 → dev（依赖 Part 1 的 store 接口）
  ↓
Part 3 → dev（依赖 Part 1 + Part 2 的 Tauri API）
Part 4 → dev（依赖 Part 1 + Part 2，可与 Part 3 并行）
  ↓
dev → main（集成测试后合入主分支）
```

---

## 5. UI 布局设计

```
┌──────────────────────────────────────┐
│  ⚙ 设置                        ✕   │
├──────────────────────────────────────┤
│                                      │
│  🐾 宠物                             │
│  ┌──────────────────────────────┐   │
│  │ 名字: [______________]       │   │
│  │ 形象: [🐶小狗] [🐱猫] [📷自选]│   │
│  │       [当前预览图]           │   │
│  └──────────────────────────────┘   │
│                                      │
│  🔌 API                              │
│  ┌──────────────────────────────┐   │
│  │ URL:   [________________]    │   │
│  │ Key:   [________________]    │   │
│  │ Model: [________________]    │   │
│  │ City:  [________________]    │   │
│  └──────────────────────────────┘   │
│                                      │
│  🤖 AI 行为                          │
│  ┌──────────────────────────────┐   │
│  │ 回复风格  [可爱][简洁][正式]  │   │
│  │ 互动频率  [活跃][正常][安静]  │   │
│  │ 聊天记忆      [toggle]       │   │
│  └──────────────────────────────┘   │
│                                      │
│  ⚡ 应用                             │
│  ┌──────────────────────────────┐   │
│  │ 开机自启动      [toggle]     │   │
│  │ 启动显示    [显示][最小化]   │   │
│  │ 窗口置顶        [toggle]     │   │
│  │ 窗口缩放  [0.8x][1x][1.2x]  │   │
│  │ 聊天快捷键  [Ctrl+Space  ]  │   │
│  └──────────────────────────────┘   │
│                                      │
│  ℹ️ 关于                             │
│  ┌──────────────────────────────┐   │
│  │ Aeri v0.1.0                  │   │
│  │ Desktop AI Companion Pet     │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

**设计要点：**
- 面板高度自适应，内容可滚动
- 五个分组（宠物/API/AI行为/应用/关于）之间用分割线隔开
- 分组标题可折叠/展开 → **为后期扩展储备 UI 空间**
- Toggle 开关用纯 CSS 实现，不引入图标库
- 分段按钮用纯 CSS 实现，选中态高亮

### 3.5 新功能实现要点

#### AI 回复风格 (`replyStyle`)

修改 `chat.ts` 的 `buildSystemPrompt()`：不同风格附加不同 prompt 后缀：

| 风格 | prompt 后缀 |
|------|------------|
| `cute` | "Always respond in a cute, playful tone. Use Chinese." |
| `concise` | "Respond briefly and directly. Use Chinese." |
| `formal` | "Respond in a polite, professional manner. Use Chinese." |

#### 互动频率 (`interactionFrequency`)

修改 `idle.ts` 的随机间隔范围：

| 频率 | 间隔范围 |
|------|----------|
| `active` | 3-6 秒 |
| `normal` | 5-10 秒（当前默认） |
| `quiet` | 10-20 秒 |

#### 聊天记忆 (`chatMemory`)

在 `useChatStore.sendMessage()` 中：若 `chatMemory === false`，每次发送前清空 `messages` 数组，只保留当前 system prompt。

#### 窗口缩放 (`windowScale`)

调用 `getCurrentWindow().setSize()` 以 320×300 为基准等比缩放。CSS 中所有像素值无需变更——Tauri 的物理/逻辑像素机制会自动处理。

#### 启动显示 (`startupBehavior`)

- `"show"`：正常显示窗口（默认）
- `"tray"`：启动后隐藏窗口，仅在托盘留图标。结合 `autoLaunch` 实现"开机静默运行"

---

## 6. 涉及修改的文件清单

### 新建文件

| 文件 | 对应分支 |
|------|----------|
| `src/stores/useSettingsStore.ts` | Part 1 |
| `src/tauri/commands.ts` | Part 2 |
| `src/components/overlays/settings/ApiSettings.tsx` | Part 1 |
| `src/components/overlays/settings/PetSettings.tsx` | Part 3 |
| `src/components/overlays/settings/BehaviorSettings.tsx` | Part 4 |
| `src/components/overlays/settings/AppSettings.tsx` | Part 4 |
| `src/components/overlays/settings/AboutSection.tsx` | Part 4 |

### 修改文件

| 文件 | 对应分支 | 修改内容 |
|------|----------|----------|
| `src/stores/useChatStore.ts` | Part 1 | 删除 config/city/settings toggle |
| `src/components/overlays/SettingsPanel.tsx` | Part 1 | 重构为容器，引入子组件 |
| `src/systems/ai/chat.ts` | Part 1, Part 4 | 改从 useSettingsStore 读取 config；依据 replyStyle 调整 prompt；依据 chatMemory 决定是否清空历史 |
| `src/systems/behavior/idle.ts` | Part 4 | 依据 interactionFrequency 调整自主行为间隔 |
| `src/App.tsx` | Part 1 | toggleSettings 引用迁移 |
| `src/App.css` | Part 3/4 | 新增设置子组件样式 |
| `src-tauri/Cargo.toml` | Part 2 | 新增 autostart/dialog/global-shortcut 依赖 |
| `src-tauri/src/lib.rs` | Part 2 | 注册新 command + 托盘初始化 |
| `src-tauri/capabilities/default.json` | Part 2 | 新增权限 |
| `src-tauri/tauri.conf.json` | Part 2 | 可能调整窗口配置 |

---

## 7. 扩展性设计

### 7.1 后端扩展点

- Rust 侧所有 command 采用模块化注册，`lib.rs` 仅做路由分发
- 上下文模块 (`context/`) 设计为开放的一组 trait 实现，新增 provider 只需实现 trait

### 7.2 前端扩展点

- `useSettingsStore` 中的设置项设计为统一的 `SettingItem<T>` 泛型结构，后期添加字段只需扩展 state 类型
- 分组面板支持可折叠，后期添加 `AdvancedSettings.tsx` 等子组件可直接插入

### 7.3 预留分支命名

```
feature/settings-theme           # 主题色/毛色/暗色模式
feature/settings-i18n            # 多语言
feature/settings-tts-stt         # 语音输入/输出
feature/settings-notification    # 系统通知提醒
feature/settings-transparency    # 窗口透明度
feature/settings-data            # 数据管理（导出/清除聊天记录）
feature/settings-floating        # 悬浮窗模式（缩小为悬浮球）
feature/settings-screensaver     # 屏保模式（全屏宠物互动）
```

---

## 8. 功能建议（后期可加）

| 优先级 | 功能 | 一句话说明 | 复杂度 |
|--------|------|-----------|--------|
| ⭐⭐⭐ | **数据导出/清除** | 导出聊天记录为 JSON，一键清除对话历史 | 低 |
| ⭐⭐⭐ | **多宠物解锁** | 预设多套宠物（猫/兔/鸟），可切换 | 中 |
| ⭐⭐ | **窗口透明度** | Slider 调节窗口 + 宠物透明度 | 低 |
| ⭐⭐ | **快捷键设置** | 自定义唤出聊天的快捷键 | 中 |
| ⭐⭐ | **主题/毛色切换** | 宠物皮肤变体 + UI 明暗主题 | 中 |
| ⭐⭐ | **声音提示** | 宠物在 idle/互动时发出短音效 | 低 |
| ⭐ | **多语言** | 中文 / English / 日本語 切换 | 中 |
| ⭐ | **通知提醒** | 定时提醒（喝水/休息），系统通知推送 | 中 |
| ⭐ | **GIF/贴纸导出** | 将当前宠物动画导出为 GIF | 高 |
| ⭐ | **插件系统** | 第三方 behavior/sprite pack 加载 | 高 |
