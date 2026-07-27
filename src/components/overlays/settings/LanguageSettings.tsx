import { useSettingsStore } from "../../../stores/useSettingsStore";
import type { Language } from "../../../stores/useSettingsStore";
import { useLocale } from "../../../systems/i18n/locale";

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

export default function LanguageSettings() {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const t = useLocale();

  return (
    <div className="settings-section">
      <div className="settings-section-title">{t("language")}</div>
      <div className="settings-field">
        <div className="segmented-row">
          {LANG_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${language === o.value ? " active" : ""}`}
              onClick={() => setLanguage(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
