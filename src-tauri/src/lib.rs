// Kuro-Roku - Local File Organization Tool
// Main library entry point

mod commands;

use commands::greet;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|_app| {
            log::info!("Kuro-Roku starting up...");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
