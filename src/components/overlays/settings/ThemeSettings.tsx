import { useSettingsStore } from "../../../stores/useSettingsStore";
import type { Theme } from "../../../stores/useSettingsStore";
import { useLocale } from "../../../systems/i18n/locale";

const THEME_OPTIONS: { value: Theme; labelKey: "theme_frosted" | "theme_dark" | "theme_kawaii" | "theme_wabisabi" | "theme_neon" }[] = [
  { value: "frosted", labelKey: "theme_frosted" },
  { value: "dark", labelKey: "theme_dark" },
  { value: "kawaii", labelKey: "theme_kawaii" },
  { value: "wabisabi", labelKey: "theme_wabisabi" },
  { value: "neon", labelKey: "theme_neon" },
];

export default function ThemeSettings() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const t = useLocale();

  return (
    <div className="settings-section">
      <div className="settings-section-title">{t("theme")}</div>
      <div className="settings-field">
        <div className="segmented-row theme-segmented">
          {THEME_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${theme === o.value ? " active" : ""}`}
              onClick={() => setTheme(o.value)}
            >
              {t(o.labelKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
