import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatConfig } from "../systems/ai/chat";

export type PetAvatar = { type: "puppy" } | { type: "cat" } | { type: "custom"; path: string };
export type StartupBehavior = "show" | "tray";
export type WindowScale = 0.8 | 1.0 | 1.2;
export type InteractionFrequency = "active" | "normal" | "quiet";
export type ReplyStyle = "cute" | "concise" | "formal";

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

  interactionFrequency: InteractionFrequency;
  replyStyle: ReplyStyle;
  chatMemory: boolean;

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

  setInteractionFrequency: (f: InteractionFrequency) => void;
  setReplyStyle: (s: ReplyStyle) => void;
  setChatMemory: (on: boolean) => void;

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

      interactionFrequency: "normal",
      replyStyle: "cute",
      chatMemory: true,

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

      setInteractionFrequency: (interactionFrequency) => set({ interactionFrequency }),
      setReplyStyle: (replyStyle) => set({ replyStyle }),
      setChatMemory: (chatMemory) => set({ chatMemory }),

      hydrate: async () => {
        // Part 2 实现：从 Rust 后端获取版本号等系统信息
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
