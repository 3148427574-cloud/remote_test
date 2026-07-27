import { useSettingsStore } from "../../../stores/useSettingsStore";
import type { InteractionFrequency, ReplyStyle } from "../../../stores/useSettingsStore";
import { useLocale } from "../../../systems/i18n/locale";

const FREQ_OPTIONS: { value: InteractionFrequency; labelKey: "active" | "normal" | "quiet" }[] = [
  { value: "active", labelKey: "active" },
  { value: "normal", labelKey: "normal" },
  { value: "quiet", labelKey: "quiet" },
];

const STYLE_OPTIONS: { value: ReplyStyle; labelKey: "cute" | "concise" | "formal" }[] = [
  { value: "cute", labelKey: "cute" },
  { value: "concise", labelKey: "concise" },
  { value: "formal", labelKey: "formal" },
];

export default function BehaviorSettings() {
  const interactionFrequency = useSettingsStore((s) => s.interactionFrequency);
  const setInteractionFrequency = useSettingsStore((s) => s.setInteractionFrequency);
  const replyStyle = useSettingsStore((s) => s.replyStyle);
  const setReplyStyle = useSettingsStore((s) => s.setReplyStyle);
  const chatMemory = useSettingsStore((s) => s.chatMemory);
  const setChatMemory = useSettingsStore((s) => s.setChatMemory);
  const t = useLocale();

  return (
    <div className="settings-section">
      <div className="settings-section-title">{t("ai_behavior")}</div>

      <div className="settings-field">
        <span>{t("reply_style")}</span>
        <div className="segmented-row">
          {STYLE_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${replyStyle === o.value ? " active" : ""}`}
              onClick={() => setReplyStyle(o.value)}
            >
              {t(o.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-field">
        <span>{t("interaction")}</span>
        <div className="segmented-row">
          {FREQ_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${interactionFrequency === o.value ? " active" : ""}`}
              onClick={() => setInteractionFrequency(o.value)}
            >
              {t(o.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-field settings-field-row">
        <span>{t("chat_memory")}</span>
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
