import { useSettingsStore } from "../../stores/useSettingsStore";
import ApiSettings from "./settings/ApiSettings";
import PetSettings from "./settings/PetSettings";
import LanguageSettings from "./settings/LanguageSettings";
import BehaviorSettings from "./settings/BehaviorSettings";
import EmotionSettings from "./settings/EmotionSettings";
import ThemeSettings from "./settings/ThemeSettings";
import AppSettings from "./settings/AppSettings";
import AboutSection from "./settings/AboutSection";

export default function SettingsPanel() {
  const showSettings = useSettingsStore((s) => s.showSettings);
  const toggleSettings = useSettingsStore((s) => s.toggleSettings);
  const theme = useSettingsStore((s) => s.theme);

  return (
    <>
      <button className="toolbar-btn" onClick={toggleSettings} title="设置">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.2s",
            transform: showSettings ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {showSettings && (
        <div className="settings-overlay" onClick={toggleSettings}>
          <div className="settings-panel" data-theme={theme} onClick={(e) => e.stopPropagation()}>
            <button className="settings-close-btn" onClick={toggleSettings} aria-label="关闭">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <PetSettings />
            <LanguageSettings />
            <BehaviorSettings />
            <EmotionSettings />
            <ApiSettings />
            <AppSettings />
            <ThemeSettings />
            <AboutSection />
          </div>
        </div>
      )}
    </>
  );
}
