import { useSettingsStore } from "../../../stores/useSettingsStore";

export default function ApiSettings() {
  const config = useSettingsStore((s) => s.config);
  const setConfig = useSettingsStore((s) => s.setConfig);
  const city = useSettingsStore((s) => s.city);
  const setCity = useSettingsStore((s) => s.setCity);

  return (
    <div className="settings-section">
      <div className="settings-section-title">API</div>

      <label className="settings-field">
        <span>API URL</span>
        <input
          value={config.baseUrl}
          onChange={(e) => setConfig({ baseUrl: e.target.value })}
          placeholder="https://api.openai.com/v1"
        />
      </label>

      <label className="settings-field">
        <span>API Key</span>
        <input
          type="password"
          value={config.apiKey}
          onChange={(e) => setConfig({ apiKey: e.target.value })}
          placeholder="sk-..."
        />
      </label>

      <label className="settings-field">
        <span>Model</span>
        <input
          value={config.model}
          onChange={(e) => setConfig({ model: e.target.value })}
          placeholder="gpt-4o-mini"
        />
      </label>

      <label className="settings-field">
        <span>City</span>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Beijing"
        />
      </label>
    </div>
  );
}
