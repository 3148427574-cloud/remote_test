import { invoke } from "@tauri-apps/api/core";

// ─── Version ────────────────────────────────────────────

export function getVersion(): Promise<string> {
  return invoke<string>("get_version");
}

// ─── Window control ─────────────────────────────────────

export function setAlwaysOnTop(on: boolean): Promise<void> {
  return invoke("set_always_on_top", { on });
}

export function setWindowScale(scale: number): Promise<void> {
  return invoke("set_window_scale", { scale });
}

// ─── Autostart ──────────────────────────────────────────

export function isAutoLaunchEnabled(): Promise<boolean> {
  return invoke("plugin:autostart|is_enabled");
}

export function enableAutoLaunch(): Promise<void> {
  return invoke("plugin:autostart|enable");
}

export function disableAutoLaunch(): Promise<void> {
  return invoke("plugin:autostart|disable");
}

// ─── Dialog ─────────────────────────────────────────────

export function pickImageFile(): Promise<string | null> {
  return invoke<string | null>("plugin:dialog|open", {
    options: {
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp"] }],
    },
  });
}

// ─── Global shortcut ────────────────────────────────────

export function registerShortcut(shortcut: string): Promise<void> {
  return invoke("plugin:global-shortcut|register", { shortcut });
}

export function unregisterShortcut(shortcut: string): Promise<void> {
  return invoke("plugin:global-shortcut|unregister", { shortcut });
}
