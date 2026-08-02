import { useSettingsStore } from "../../../stores/useSettingsStore";
import type { EmotionSensitivity } from "../../../stores/useSettingsStore";
import { usePetStore } from "../../../stores/usePetStore";
import { useLocale } from "../../../systems/i18n/locale";

const SENSITIVITY_OPTIONS: { value: EmotionSensitivity; labelKey: "sensitive" | "normal" | "stoic" }[] = [
  { value: "sensitive", labelKey: "sensitive" },
  { value: "normal", labelKey: "normal" },
  { value: "stoic", labelKey: "stoic" },
];

const METERS: { key: "joy" | "energy" | "affection"; color: string }[] = [
  { key: "joy", color: "#ff9f43" },
  { key: "energy", color: "#4caf50" },
  { key: "affection", color: "#e91e63" },
];

export default function EmotionSettings() {
  const emotion = usePetStore((s) => s.emotion);
  const sensitivity = useSettingsStore((s) => s.emotionSensitivity);
  const setSensitivity = useSettingsStore((s) => s.setEmotionSensitivity);
  const t = useLocale();

  const handleReset = () => {
    usePetStore.getState().emotionEngine.reset();
  };

  return (
    <div className="settings-section">
      <div className="settings-section-title">{t("emotion")}</div>

      {METERS.map((m) => (
        <div key={m.key} className="emotion-meter">
          <span className="emotion-meter-label">{t(m.key)}</span>
          <div className="emotion-meter-bar">
            <div
              className="emotion-meter-fill"
              style={{
                width: `${Math.round((emotion[m.key] as number) * 100)}%`,
                background: m.color,
              }}
            />
          </div>
          <span className="emotion-meter-value">
            {Math.round((emotion[m.key] as number) * 100)}
          </span>
        </div>
      ))}

      <div className="settings-field">
        <span>{t("emotion_sensitivity")}</span>
        <div className="segmented-row">
          {SENSITIVITY_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${sensitivity === o.value ? " active" : ""}`}
              onClick={() => setSensitivity(o.value)}
            >
              {t(o.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <button className="emotion-reset-btn" onClick={handleReset}>
        {t("reset_emotion")}
      </button>
    </div>
  );
}
