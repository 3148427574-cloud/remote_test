import { useState } from "react";
import { useChatStore } from "../../stores/useChatStore";

export default function ChatInput() {
  const showInput = useChatStore((s) => s.showInput);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const toggleInput = useChatStore((s) => s.toggleInput);
  const [text, setText] = useState("");

  if (!showInput) return null;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      toggleInput();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: -48,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 4,
        padding: 6,
        borderRadius: 10,
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 10,
      }}
    >
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="和 Aeri 说话..."
        style={{
          width: 140,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 13,
          color: "#333",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          border: "none",
          background: "#ff9f43",
          color: "#fff",
          borderRadius: 6,
          padding: "2px 10px",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        发送
      </button>
    </div>
  );
}
