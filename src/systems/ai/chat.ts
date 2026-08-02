import { invoke } from "@tauri-apps/api/core";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { usePetStore } from "../../stores/usePetStore";
import type { ReplyStyle, Language } from "../../stores/useSettingsStore";
import type { EmotionState } from "../emotion/engine";

export interface ChatConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const LANG_INSTRUCTION: Record<Language, string> = {
  zh: "Always reply in Chinese.",
  en: "Always reply in English.",
  ja: "Always reply in Japanese.",
};

const STYLE_SUFFIX: Record<ReplyStyle, string> = {
  cute: " Always respond in a cute, playful tone. Use emojis and kaomoji like (｡･ω･｡). End sentences with 'Woof~' occasionally.",
  concise: " Respond briefly and directly. No extra fluff.",
  formal: " Respond in a polite, professional manner. Use complete sentences.",
};

/** 根据当前情感状态生成语气提示，注入到 system prompt */
function moodHint(emo: EmotionState, affection: number): string {
  if (affection < 0.1 && emo.joy > 0.4) return "You just met this human. Be a little shy and curious.";
  if (affection > 0.6 && emo.joy > 0.6) return "You deeply love this human. Be warm, affectionate, and clearly happy to see them.";
  if (affection > 0.4 && emo.joy > 0.5) return "You've built a good bond with this human. Be friendly and relaxed.";

  if (emo.joy < 0.2) return "You're feeling down today. Sound a little melancholic, maybe the human can cheer you up.";
  if (emo.joy < 0.35) return "You're in a quiet mood. Replies should feel subdued and calm.";
  if (emo.joy > 0.75) return "You're in an extra playful and excited mood. Be energetic and enthusiastic!";

  if (emo.energy < 0.2) return "You're feeling very tired. Yawn occasionally (virtually). Keep replies extra short.";
  if (emo.energy < 0.35) return "You're a bit sleepy. Sound relaxed and low-energy.";

  return "You're feeling pretty normal. Be your usual self.";
}

async function buildSystemPrompt(city?: string): Promise<string> {
  const settings = useSettingsStore.getState();
  const langInstr = LANG_INSTRUCTION[settings.language];
  const styleInstr = STYLE_SUFFIX[settings.replyStyle];
  const emotion = usePetStore.getState().getEmotion();

  let contextText = "";
  try {
    contextText = await invoke<string>("get_context_text", { city: city || null });
  } catch {
    // 上下文获取失败时静默降级，不影响对话
  }

  const mood = moodHint(emotion, emotion.affection);
  const prompt = `You are a cute desktop pet puppy named Aeri. Reply in 1-3 short sentences. ${langInstr}${styleInstr}\n\nCurrent mood: ${mood}`;

  if (contextText) {
    return `${prompt}\n\nCurrent context:\n${contextText}\n\nUse the context naturally in your response (greet by time of day, care about weather, etc).`;
  }

  return prompt;
}

export async function* streamChat(
  config: ChatConfig,
  history: ChatMessage[],
  userMessage: string,
  city?: string,
): AsyncGenerator<string> {
  const systemPrompt = await buildSystemPrompt(city);

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10),
    { role: "user", content: userMessage },
  ];

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const json = JSON.parse(data);
        const content = json.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // 忽略解析失败的行
      }
    }
  }
}
