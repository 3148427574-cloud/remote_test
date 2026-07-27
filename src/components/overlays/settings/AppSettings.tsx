import { useEffect } from "react";
import { useSettingsStore } from "../../../stores/useSettingsStore";
import type { StartupBehavior, WindowScale } from "../../../stores/useSettingsStore";
import {
  setAlwaysOnTop,
  setWindowScale,
  isAutoLaunchEnabled,
  enableAutoLaunch,
  disableAutoLaunch,
} from "../../../tauri/commands";
import { useLocale } from "../../../systems/i18n/locale";

type ScaleLabel = "0.8x" | "1x" | "1.2x";
const SCALE_OPTIONS: { value: WindowScale; label: ScaleLabel }[] = [
  { value: 0.8, label: "0.8x" },
  { value: 1.0, label: "1x" },
  { value: 1.2, label: "1.2x" },
];

const STARTUP_OPTIONS: { value: StartupBehavior; labelKey: "show" | "tray" }[] = [
  { value: "show", labelKey: "show" },
  { value: "tray", labelKey: "tray" },
];

export default function AppSettings() {
  const autoLaunch = useSettingsStore((s) => s.autoLaunch);
  const setAutoLaunch = useSettingsStore((s) => s.setAutoLaunch);
  const startupBehavior = useSettingsStore((s) => s.startupBehavior);
  const setStartupBehavior = useSettingsStore((s) => s.setStartupBehavior);
  const alwaysOnTop = useSettingsStore((s) => s.alwaysOnTop);
  const setAlwaysOnTopState = useSettingsStore((s) => s.setAlwaysOnTop);
  const windowScale = useSettingsStore((s) => s.windowScale);
  const setWindowScaleState = useSettingsStore((s) => s.setWindowScale);
  const chatHotkey = useSettingsStore((s) => s.chatHotkey);
  const setChatHotkey = useSettingsStore((s) => s.setChatHotkey);
  const t = useLocale();

  useEffect(() => {
    isAutoLaunchEnabled().then(setAutoLaunch).catch(() => {});
  }, []);

  const handleAutoLaunch = (on: boolean) => {
    setAutoLaunch(on);
    if (on) {
      enableAutoLaunch().catch(() => {});
    } else {
      disableAutoLaunch().catch(() => {});
    }
  };

  const handleAlwaysOnTop = (on: boolean) => {
    setAlwaysOnTopState(on);
    setAlwaysOnTop(on).catch(() => {});
  };

  const handleWindowScale = (scale: WindowScale) => {
    setWindowScaleState(scale);
    setWindowScale(scale).catch(() => {});
  };

  return (
    <div className="settings-section">
      <div className="settings-section-title">{t("application")}</div>

      <div className="settings-field settings-field-row">
        <span>{t("auto_launch")}</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={autoLaunch}
            onChange={(e) => handleAutoLaunch(e.target.checked)}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      <div className="settings-field">
        <span>{t("startup_mode")}</span>
        <div className="segmented-row">
          {STARTUP_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${startupBehavior === o.value ? " active" : ""}`}
              onClick={() => setStartupBehavior(o.value)}
            >
              {t(o.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-field settings-field-row">
        <span>{t("always_on_top")}</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={alwaysOnTop}
            onChange={(e) => handleAlwaysOnTop(e.target.checked)}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      <div className="settings-field">
        <span>{t("window_scale")}</span>
        <div className="segmented-row">
          {SCALE_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${windowScale === o.value ? " active" : ""}`}
              onClick={() => handleWindowScale(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <label className="settings-field">
        <span>{t("chat_hotkey")}</span>
        <input
          value={chatHotkey}
          onChange={(e) => setChatHotkey(e.target.value)}
          placeholder="Ctrl+Space"
        />
      </label>
    </div>
  );
}
