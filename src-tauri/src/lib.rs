mod context;

use context::{format_context, gather_context, TimeInfo, WeatherInfo, SystemInfo, ContextInfo};
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_current_time() -> TimeInfo {
    context::time::get_time_info()
}

#[tauri::command]
async fn get_weather(city: String) -> Result<WeatherInfo, String> {
    context::weather::get_weather(&city).await
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    context::system::get_system_info()
}

#[tauri::command]
async fn get_context(city: Option<String>) -> Result<ContextInfo, String> {
    let city_ref = city.as_deref();
    Ok(gather_context(city_ref).await)
}

#[tauri::command]
async fn get_context_text(city: Option<String>) -> Result<String, String> {
    let city_ref = city.as_deref();
    let ctx = gather_context(city_ref).await;
    Ok(format_context(&ctx))
}

#[tauri::command]
fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn set_always_on_top(app: tauri::AppHandle, on: bool) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_always_on_top(on);
    }
}

#[tauri::command]
fn set_window_scale(app: tauri::AppHandle, scale: f64) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_size(tauri::LogicalSize::new(
            (320.0 * scale).round(),
            (300.0 * scale).round(),
        ));
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            let _tray = tauri::tray::TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click { .. } = event {
                        if let Some(window) = tray.app_handle().get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_current_time,
            get_weather,
            get_system_info,
            get_context,
            get_context_text,
            get_version,
            set_always_on_top,
            set_window_scale,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
