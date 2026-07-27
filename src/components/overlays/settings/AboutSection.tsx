import { useSettingsStore } from "../../../stores/useSettingsStore";

export default function AboutSection() {
  const appVersion = useSettingsStore((s) => s.appVersion);

  return (
    <div className="settings-section">
      <div className="settings-section-title">About</div>
      <div className="about-info">
        <div className="about-name">Aeri</div>
        <div className="about-version">v{appVersion}</div>
        <div className="about-desc">Desktop AI Companion Pet</div>
      </div>
    </div>
  );
}
