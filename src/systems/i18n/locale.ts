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
  | "language"
  | "emotion"
  | "emotion_sensitivity"
  | "joy"
  | "energy"
  | "affection"
  | "sensitive"
  | "stoic"
  | "reset_emotion"
  | "reset"
  | "theme"
  | "theme_frosted"
  | "theme_dark"
  | "theme_kawaii"
  | "theme_wabisabi"
  | "theme_neon";

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
    emotion: "情感",
    emotion_sensitivity: "情感敏感度",
    joy: "快乐",
    energy: "精力",
    affection: "好感",
    sensitive: "敏感",
    stoic: "淡定",
    reset_emotion: "重置情感",
    reset: "重置",
    theme: "风格",
    theme_frosted: "磨砂玻璃",
    theme_dark: "深色玻璃",
    theme_kawaii: "软萌粉彩",
    theme_wabisabi: "侘寂极简",
    theme_neon: "霓虹紫夜",
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
    emotion: "Emotion",
    emotion_sensitivity: "Sensitivity",
    joy: "Joy",
    energy: "Energy",
    affection: "Affection",
    sensitive: "Sensitive",
    stoic: "Stoic",
    reset_emotion: "Reset Emotions",
    reset: "Reset",
    theme: "Theme",
    theme_frosted: "Frosted Glass",
    theme_dark: "Dark Glass",
    theme_kawaii: "Kawaii",
    theme_wabisabi: "Wabi-Sabi",
    theme_neon: "Neon Play",
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
    emotion: "感情",
    emotion_sensitivity: "感度",
    joy: "喜び",
    energy: "元気",
    affection: "好感度",
    sensitive: "敏感",
    stoic: "冷静",
    reset_emotion: "感情リセット",
    reset: "リセット",
    theme: "テーマ",
    theme_frosted: "フロストガラス",
    theme_dark: "ダークガラス",
    theme_kawaii: "カワイイ",
    theme_wabisabi: "侘び寂び",
    theme_neon: "ネオン",
  },
};

export function useLocale() {
  const language = useSettingsStore((s) => s.language);
  return (key: LocaleKey) => LOCALE[language][key];
}
