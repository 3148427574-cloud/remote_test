import { create } from "zustand";
import { streamChat, type ChatConfig, type ChatMessage } from "../systems/ai/chat";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  currentReply: string;
  showInput: boolean;
  config: ChatConfig;
}

interface ChatActions {
  sendMessage: (text: string) => Promise<void>;
  toggleInput: () => void;
  setConfig: (config: Partial<ChatConfig>) => void;
  clearReply: () => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  messages: [],
  isStreaming: false,
  currentReply: "",
  showInput: false,
  config: {
    baseUrl: "https://api.openai.com/v1",
    apiKey: "",
    model: "gpt-4o-mini",
  },

  sendMessage: async (text: string) => {
    const { config, messages } = get();
    set({ isStreaming: true, currentReply: "", showInput: false });

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    set({ messages: newMessages });

    try {
      let reply = "";
      for await (const chunk of streamChat(config, messages, text)) {
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

  setConfig: (partial) =>
    set((s) => ({ config: { ...s.config, ...partial } })),

  clearReply: () => set({ currentReply: "" }),
}));
