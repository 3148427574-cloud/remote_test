/**
 * MVP AI 对话
 * 调用 OpenAI 兼容 API，支持流式输出。
 * 后续可替换 provider 或走 Rust 代理。
 */

export interface ChatConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `你是一只可爱的桌面宠物小狗，名字叫 Aeri。
你的特点：
- 活泼、温暖、偶尔犯傻
- 回复简短（1~3 句话）
- 喜欢用"汪"结尾
- 会用颜文字 (｡･ω･｡)
- 对主人很亲切

请以 Aeri 的身份回复。`;

export async function* streamChat(
  config: ChatConfig,
  history: ChatMessage[],
  userMessage: string,
): AsyncGenerator<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-10), // 只保留最近 10 条上下文
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
