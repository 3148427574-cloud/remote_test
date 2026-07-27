import { create } from "zustand";
import { streamChat, type ChatMessage } from "../systems/ai/chat";
import { useSettingsStore } from "./useSettingsStore";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  currentReply: string;
  showInput: boolean;
}

interface ChatActions {
  sendMessage: (text: string) => Promise<void>;
  toggleInput: () => void;
  clearReply: () => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  messages: [],
  isStreaming: false,
  currentReply: "",
  showInput: false,

  sendMessage: async (text: string) => {
    const { config, city } = useSettingsStore.getState();
    const { messages } = get();
    set({ isStreaming: true, currentReply: "", showInput: false });

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    set({ messages: newMessages });

    try {
      let reply = "";
      for await (const chunk of streamChat(config, messages, text, city || undefined)) {
        reply += chunk;
        set({ currentReply: reply });
      }
      set({
        messages: [...newMessages, { role: "assistant", content: reply }],
      });
    } catch (err) {
      set({ currentReply: `(出错了: ${String(err)})` });
    } finally {
      set({ isStreaming: false });
    }
  },

  toggleInput: () => set((s) => ({ showInput: !s.showInput })),

  clearReply: () => set({ currentReply: "" }),
}));
