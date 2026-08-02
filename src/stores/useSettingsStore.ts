import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatConfig } from "../systems/ai/chat";
import { getVersion } from "../tauri/commands";

export type PetAvatar = { type: "puppy" } | { type: "cat" } | { type: "custom"; dataUrl: string };
export type StartupBehavior = "show" | "tray";
export type WindowScale = 0.8 | 1.0 | 1.2;
export type InteractionFrequency = "active" | "normal" | "quiet";
export type ReplyStyle = "cute" | "concise" | "formal";
export type Language = "zh" | "en" | "ja";
export type EmotionSensitivity = "sensitive" | "normal" | "stoic";
export type Theme = "frosted" | "dark" | "kawaii" | "wabisabi" | "neon";

interface SettingsState {
  config: ChatConfig;
  city: string;
  showSettings: boolean;

  petName: string;
  petAvatar: PetAvatar;

  autoLaunch: boolean;
  startupBehavior: StartupBehavior;
  alwaysOnTop: boolean;
  windowScale: WindowScale;
  chatHotkey: string;

  language: Language;
  interactionFrequency: InteractionFrequency;
  replyStyle: ReplyStyle;
  chatMemory: boolean;

  emotionSensitivity: EmotionSensitivity;
  theme: Theme;

  appVersion: string;
}

interface SettingsActions {
  setConfig: (cfg: Partial<ChatConfig>) => void;
  setCity: (city: string) => void;
  toggleSettings: () => void;

  setPetName: (name: string) => void;
  setPetAvatar: (avatar: PetAvatar) => void;

  setAutoLaunch: (on: boolean) => void;
  setStartupBehavior: (b: StartupBehavior) => void;
  setAlwaysOnTop: (on: boolean) => void;
  setWindowScale: (scale: WindowScale) => void;
  setChatHotkey: (hk: string) => void;

  setLanguage: (l: Language) => void;
  setInteractionFrequency: (f: InteractionFrequency) => void;
  setReplyStyle: (s: ReplyStyle) => void;
  setChatMemory: (on: boolean) => void;

  setEmotionSensitivity: (s: EmotionSensitivity) => void;
  setTheme: (t: Theme) => void;

  hydrate: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      config: {
        baseUrl: "https://api.deepseek.com/v1",
        apiKey: "sk-4d5256e1e6c249469ce19c374ecb47bb",
        model: "deepseek-chat",
      },
      city: "",
      showSettings: false,

      petName: "Aeri",
      petAvatar: { type: "puppy" },

      autoLaunch: false,
      startupBehavior: "show",
      alwaysOnTop: true,
      windowScale: 1.0,
      chatHotkey: "Ctrl+Space",

      language: "zh",
      interactionFrequency: "normal",
      replyStyle: "cute",
      chatMemory: true,

      emotionSensitivity: "normal",
      theme: "frosted",

      appVersion: "0.1.0",

      setConfig: (partial) =>
        set((s) => ({ config: { ...s.config, ...partial } })),

      setCity: (city) => set({ city }),

      toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),

      setPetName: (petName) => set({ petName }),
      setPetAvatar: (petAvatar) => set({ petAvatar }),

      setAutoLaunch: (autoLaunch) => set({ autoLaunch }),
      setStartupBehavior: (startupBehavior) => set({ startupBehavior }),
      setAlwaysOnTop: (alwaysOnTop) => set({ alwaysOnTop }),
      setWindowScale: (windowScale) => set({ windowScale }),
      setChatHotkey: (chatHotkey) => set({ chatHotkey }),

      setLanguage: (language) => set({ language }),
      setInteractionFrequency: (interactionFrequency) => set({ interactionFrequency }),
      setReplyStyle: (replyStyle) => set({ replyStyle }),
      setChatMemory: (chatMemory) => set({ chatMemory }),

      setEmotionSensitivity: (emotionSensitivity) => set({ emotionSensitivity }),
      setTheme: (theme) => set({ theme }),

      hydrate: async () => {
        try {
          const version = await getVersion();
          set({ appVersion: version });
        } catch {
          // 获取失败时保留默认版本号
        }
      },
    }),
    {
      name: "aeri-settings",
      partialize: (state) => {
        const { showSettings, ...persisted } = state;
        void showSettings;
        return persisted;
      },
    },
  ),
);
