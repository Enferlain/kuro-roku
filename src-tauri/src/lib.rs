// Kuro-Roku - Local File Organization Tool
// Main library entry point

mod commands;
mod db;
mod models;

use commands::{get_file_info, greet, hash_file, scan_directory, select_directory};
use db::{init_database, DbState};
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            select_directory,
            scan_directory,
            get_file_info,
            hash_file
        ])
        .setup(|app| {
            log::info!("Kuro-Roku starting up...");

            // Initialize database
            match init_database(&app.handle()) {
                Ok(conn) => {
                    app.manage(DbState(Mutex::new(conn)));
                    log::info!("Database ready");
                }
                Err(e) => {
                    log::error!("Failed to initialize database: {}", e);
                    // Continue without database for now - allow UI to load
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
