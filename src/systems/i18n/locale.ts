import { useSettingsStore } from "../../stores/useSettingsStore";
import type { Language } from "../../stores/useSettingsStore";

type LocaleKey =
  | "pet"
  | "name"
  | "avatar"
  | "dog"
  | "cat"
  | "custom"
  | "ai_behavior"
  | "reply_style"
  | "cute"
  | "concise"
  | "formal"
  | "interaction"
  | "active"
  | "normal"
  | "quiet"
  | "chat_memory"
  | "api"
  | "api_url"
  | "api_key"
  | "model"
  | "city"
  | "application"
  | "auto_launch"
  | "startup_mode"
  | "show"
  | "tray"
  | "always_on_top"
  | "window_scale"
  | "chat_hotkey"
  | "about"
  | "about_desc"
  | "language";

const LOCALE: Record<Language, Record<LocaleKey, string>> = {
  zh: {
    pet: "宠物",
    name: "名字",
    avatar: "形象",
    dog: "小狗",
    cat: "小猫",
    custom: "自选",
    ai_behavior: "AI 行为",
    reply_style: "回复风格",
    cute: "可爱",
    concise: "简洁",
    formal: "正式",
    interaction: "互动频率",
    active: "活跃",
    normal: "正常",
    quiet: "安静",
    chat_memory: "聊天记忆",
    api: "API",
    api_url: "API URL",
    api_key: "API Key",
    model: "Model",
    city: "城市",
    application: "应用",
    auto_launch: "开机自启动",
    startup_mode: "启动模式",
    show: "显示",
    tray: "托盘",
    always_on_top: "窗口置顶",
    window_scale: "窗口缩放",
    chat_hotkey: "聊天快捷键",
    about: "关于",
    about_desc: "桌面 AI 伴侣宠物",
    language: "语言",
  },
  en: {
    pet: "Pet",
    name: "Name",
    avatar: "Avatar",
    dog: "Dog",
    cat: "Cat",
    custom: "Custom",
    ai_behavior: "AI Behavior",
    reply_style: "Reply Style",
    cute: "Cute",
    concise: "Concise",
    formal: "Formal",
    interaction: "Interaction",
    active: "Active",
    normal: "Normal",
    quiet: "Quiet",
    chat_memory: "Chat Memory",
    api: "API",
    api_url: "API URL",
    api_key: "API Key",
    model: "Model",
    city: "City",
    application: "Application",
    auto_launch: "Launch at Startup",
    startup_mode: "Startup Mode",
    show: "Show",
    tray: "Tray",
    always_on_top: "Always on Top",
    window_scale: "Window Scale",
    chat_hotkey: "Chat Hotkey",
    about: "About",
    about_desc: "Desktop AI Companion Pet",
    language: "Language",
  },
  ja: {
    pet: "ペット",
    name: "名前",
    avatar: "アバター",
    dog: "犬",
    cat: "猫",
    custom: "カスタム",
    ai_behavior: "AI 行動",
    reply_style: "返信スタイル",
    cute: "かわいい",
    concise: "簡潔",
    formal: "フォーマル",
    interaction: "インタラクション",
    active: "アクティブ",
    normal: "普通",
    quiet: "静か",
    chat_memory: "チャット記憶",
    api: "API",
    api_url: "API URL",
    api_key: "API Key",
    model: "Model",
    city: "都市",
    application: "アプリ",
    auto_launch: "起動時に実行",
    startup_mode: "起動モード",
    show: "表示",
    tray: "トレイ",
    always_on_top: "最前面に表示",
    window_scale: "ウィンドウ倍率",
    chat_hotkey: "チャットホットキー",
    about: "について",
    about_desc: "デスクトップ AI ペット",
    language: "言語",
  },
};

export function useLocale() {
  const language = useSettingsStore((s) => s.language);
  return (key: LocaleKey) => LOCALE[language][key];
}
