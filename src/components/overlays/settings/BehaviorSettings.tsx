import { useSettingsStore } from "../../../stores/useSettingsStore";
import type { InteractionFrequency, ReplyStyle } from "../../../stores/useSettingsStore";

const FREQ_OPTIONS: { value: InteractionFrequency; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "normal", label: "Normal" },
  { value: "quiet", label: "Quiet" },
];

const STYLE_OPTIONS: { value: ReplyStyle; label: string }[] = [
  { value: "cute", label: "Cute" },
  { value: "concise", label: "Concise" },
  { value: "formal", label: "Formal" },
];

export default function BehaviorSettings() {
  const interactionFrequency = useSettingsStore((s) => s.interactionFrequency);
  const setInteractionFrequency = useSettingsStore((s) => s.setInteractionFrequency);
  const replyStyle = useSettingsStore((s) => s.replyStyle);
  const setReplyStyle = useSettingsStore((s) => s.setReplyStyle);
  const chatMemory = useSettingsStore((s) => s.chatMemory);
  const setChatMemory = useSettingsStore((s) => s.setChatMemory);

  return (
    <div className="settings-section">
      <div className="settings-section-title">AI Behavior</div>

      <div className="settings-field">
        <span>Reply Style</span>
        <div className="segmented-row">
          {STYLE_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${replyStyle === o.value ? " active" : ""}`}
              onClick={() => setReplyStyle(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-field">
        <span>Interaction Frequency</span>
        <div className="segmented-row">
          {FREQ_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${interactionFrequency === o.value ? " active" : ""}`}
              onClick={() => setInteractionFrequency(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-field settings-field-row">
        <span>Chat Memory</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={chatMemory}
            onChange={(e) => setChatMemory(e.target.checked)}
          />
          <span className="toggle-slider" />
        </label>
      </div>
    </div>
  );
}
