// Tauri commands - exposed to the frontend via invoke()

/// Simple greeting command to verify frontend-backend communication
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Backend connected successfully.", name)
}
