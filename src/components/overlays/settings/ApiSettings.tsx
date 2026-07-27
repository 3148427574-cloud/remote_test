import { useSettingsStore } from "../../../stores/useSettingsStore";
import { useLocale } from "../../../systems/i18n/locale";

export default function ApiSettings() {
  const config = useSettingsStore((s) => s.config);
  const setConfig = useSettingsStore((s) => s.setConfig);
  const city = useSettingsStore((s) => s.city);
  const setCity = useSettingsStore((s) => s.setCity);
  const t = useLocale();

  return (
    <div className="settings-section">
      <div className="settings-section-title">{t("api")}</div>

      <label className="settings-field">
        <span>{t("api_url")}</span>
        <input
          value={config.baseUrl}
          onChange={(e) => setConfig({ baseUrl: e.target.value })}
          placeholder="https://api.openai.com/v1"
        />
      </label>

      <label className="settings-field">
        <span>{t("api_key")}</span>
        <input
          type="password"
          value={config.apiKey}
          onChange={(e) => setConfig({ apiKey: e.target.value })}
          placeholder="sk-..."
        />
      </label>

      <label className="settings-field">
        <span>{t("model")}</span>
        <input
          value={config.model}
          onChange={(e) => setConfig({ model: e.target.value })}
          placeholder="gpt-4o-mini"
        />
      </label>

      <label className="settings-field">
        <span>{t("city")}</span>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Beijing"
        />
      </label>
    </div>
  );
}
