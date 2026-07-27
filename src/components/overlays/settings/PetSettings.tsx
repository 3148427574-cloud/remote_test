import { useSettingsStore } from "../../../stores/useSettingsStore";
import { pickImageFile, readImageBase64 } from "../../../tauri/commands";

export default function PetSettings() {
  const petName = useSettingsStore((s) => s.petName);
  const setPetName = useSettingsStore((s) => s.setPetName);
  const petAvatar = useSettingsStore((s) => s.petAvatar);
  const setPetAvatar = useSettingsStore((s) => s.setPetAvatar);

  const handlePreset = (type: "puppy" | "cat") => {
    setPetAvatar({ type });
  };

  const handleCustom = async () => {
    const path = await pickImageFile();
    if (!path) return;
    const dataUrl = await readImageBase64(path);
    setPetAvatar({ type: "custom", dataUrl });
  };

  return (
    <div className="settings-section">
      <div className="settings-section-title">Pet</div>

      <label className="settings-field">
        <span>Name</span>
        <input
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Aeri"
        />
      </label>

      <div className="settings-field">
        <span>Avatar</span>
        <div className="pet-avatar-selector">
          <button
            className={`pet-avatar-btn${petAvatar.type === "puppy" ? " active" : ""}`}
            onClick={() => handlePreset("puppy")}
          >
            Dog
          </button>
          <button
            className={`pet-avatar-btn${petAvatar.type === "cat" ? " active" : ""}`}
            onClick={() => handlePreset("cat")}
          >
            Cat
          </button>
          <button
            className={`pet-avatar-btn${petAvatar.type === "custom" ? " active" : ""}`}
            onClick={handleCustom}
          >
            Custom
          </button>
        </div>
      </div>
    </div>
  );
}
