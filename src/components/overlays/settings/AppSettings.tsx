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

const SCALE_OPTIONS: { value: WindowScale; label: string }[] = [
  { value: 0.8, label: "0.8x" },
  { value: 1.0, label: "1x" },
  { value: 1.2, label: "1.2x" },
];

const STARTUP_OPTIONS: { value: StartupBehavior; label: string }[] = [
  { value: "show", label: "Show" },
  { value: "tray", label: "Tray" },
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

  // Sync autolaunch state from system on mount
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
      <div className="settings-section-title">Application</div>

      <div className="settings-field settings-field-row">
        <span>Launch at Startup</span>
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
        <span>Startup Mode</span>
        <div className="segmented-row">
          {STARTUP_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`segmented-btn${startupBehavior === o.value ? " active" : ""}`}
              onClick={() => setStartupBehavior(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-field settings-field-row">
        <span>Always on Top</span>
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
        <span>Window Scale</span>
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
        <span>Chat Hotkey</span>
        <input
          value={chatHotkey}
          onChange={(e) => setChatHotkey(e.target.value)}
          placeholder="Ctrl+Space"
        />
      </label>
    </div>
  );
}
