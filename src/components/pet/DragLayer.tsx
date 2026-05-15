import { getCurrentWindow } from "@tauri-apps/api/window";
import { useChatStore } from "../../stores/useChatStore";

export default function DragLayer() {
  const toggleInput = useChatStore((s) => s.toggleInput);
  const showInput = useChatStore((s) => s.showInput);
  const isStreaming = useChatStore((s) => s.isStreaming);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        // 透明区域可穿透，但图片区域接收鼠标
        pointerEvents: "none",
      }}
    >
      {/* 拖动区域：覆盖在图片上方 */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          getCurrentWindow().startDragging();
        }}
        onClick={() => {
          // 仅在非流式状态下打开输入框
          if (!isStreaming) toggleInput();
        }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "auto",
          cursor: showInput ? "pointer" : "grab",
        }}
      />
    </div>
  );
}
