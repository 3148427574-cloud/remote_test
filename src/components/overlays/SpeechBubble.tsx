import { useChatStore } from "../../stores/useChatStore";
import { usePetStore } from "../../stores/usePetStore";

export default function SpeechBubble() {
  const isStreaming = useChatStore((s) => s.isStreaming);
  const currentReply = useChatStore((s) => s.currentReply);
  const playAnimation = usePetStore((s) => s.playAnimation);

  if (!currentReply) return null;

  return (
    <div
      onAnimationStart={() => playAnimation("thinking")}
      style={{
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: 8,
        maxWidth: 180,
        padding: "8px 12px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontSize: 13,
        lineHeight: 1.5,
        color: "#333",
        wordBreak: "break-word",
      }}
    >
      {currentReply}
      {isStreaming && (
        <span style={{ display: "inline-block", width: 4, height: 14, background: "#999", marginLeft: 2 }} />
      )}
    </div>
  );
}
