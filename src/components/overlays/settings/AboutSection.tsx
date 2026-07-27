import { useSettingsStore } from "../../../stores/useSettingsStore";
import { useLocale } from "../../../systems/i18n/locale";

export default function AboutSection() {
  const appVersion = useSettingsStore((s) => s.appVersion);
  const t = useLocale();

  return (
    <div className="settings-section">
      <div className="settings-section-title">{t("about")}</div>
      <div className="about-info">
        <div className="about-name">Aeri</div>
        <div className="about-version">v{appVersion}</div>
        <div className="about-desc">{t("about_desc")}</div>
      </div>
    </div>
  );
}
