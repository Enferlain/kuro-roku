// Tauri commands - exposed to the frontend via invoke()

pub mod fs;

pub use fs::{get_file_info, hash_file, scan_directory, select_directory};

/// Simple greeting command to verify frontend-backend communication
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Backend connected successfully.", name)
}
