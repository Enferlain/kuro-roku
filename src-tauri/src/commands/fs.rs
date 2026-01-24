// File system commands - exposed to frontend via Tauri IPC

use crate::models::{FileType, ScannedFile};
use anyhow::Context;
use chrono::{DateTime, Utc};
use std::fs;
use std::path::Path;
use tauri_plugin_dialog::DialogExt;
use walkdir::WalkDir;

/// Open folder picker dialog and return selected path
#[tauri::command]
pub async fn select_directory(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let folder = app.dialog().file().blocking_pick_folder();

    Ok(folder.map(|p| p.to_string()))
}

/// Scan a directory recursively and return file information
#[tauri::command]
pub async fn scan_directory(path: String) -> Result<Vec<ScannedFile>, String> {
    let path = Path::new(&path);

    if !path.exists() {
        return Err(format!("Path does not exist: {}", path.display()));
    }

    if !path.is_dir() {
        return Err(format!("Path is not a directory: {}", path.display()));
    }

    let mut files = Vec::new();

    for entry in WalkDir::new(path)
        .follow_links(false)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let entry_path = entry.path();

        // Skip directories
        if entry_path.is_dir() {
            continue;
        }

        match get_scanned_file(entry_path) {
            Ok(file) => files.push(file),
            Err(e) => {
                log::warn!("Failed to read file {:?}: {}", entry_path, e);
            }
        }
    }

    log::info!("Scanned {} files from {:?}", files.len(), path);
    Ok(files)
}

/// Get detailed file information
#[tauri::command]
pub async fn get_file_info(path: String) -> Result<ScannedFile, String> {
    let path = Path::new(&path);
    get_scanned_file(path).map_err(|e| e.to_string())
}

/// Compute BLAKE3 hash of a file
#[tauri::command]
pub async fn hash_file(path: String) -> Result<String, String> {
    let path = Path::new(&path);

    if !path.exists() {
        return Err(format!("File does not exist: {}", path.display()));
    }

    // Read file and hash it
    let contents = fs::read(path).map_err(|e| format!("Failed to read file: {}", e))?;

    let hash = blake3::hash(&contents);
    Ok(hash.to_hex().to_string())
}

/// Helper to create ScannedFile from a path
fn get_scanned_file(path: &Path) -> anyhow::Result<ScannedFile> {
    let metadata = fs::metadata(path).context("Failed to read metadata")?;

    let file_name = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();

    let file_extension = path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_string();

    let file_type = FileType::from_extension(&file_extension);

    let created_at = metadata
        .created()
        .ok()
        .and_then(|t| DateTime::<Utc>::from(t).to_rfc3339().into())
        .unwrap_or_else(|| Utc::now().to_rfc3339());

    let modified_at = metadata
        .modified()
        .ok()
        .and_then(|t| DateTime::<Utc>::from(t).to_rfc3339().into())
        .unwrap_or_else(|| Utc::now().to_rfc3339());

    Ok(ScannedFile {
        path: path.to_string_lossy().to_string(),
        file_name,
        file_extension,
        file_type,
        file_size: metadata.len(),
        created_at,
        modified_at,
    })
}
