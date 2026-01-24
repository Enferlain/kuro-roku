// Data models for Kuro-Roku
// Matches the SQLite schema in docs/ARCHITECTURE.md

use serde::{Deserialize, Serialize};

/// File type classification
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum FileType {
    Video,
    Image,
    Audio,
    Document,
    Other,
}

impl FileType {
    /// Detect file type from extension
    pub fn from_extension(ext: &str) -> Self {
        match ext.to_lowercase().as_str() {
            // Video
            "mp4" | "mkv" | "avi" | "mov" | "wmv" | "flv" | "webm" | "m4v" | "mpeg" | "mpg" => {
                FileType::Video
            }
            // Image
            "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp" | "svg" | "ico" | "tiff" | "tif" => {
                FileType::Image
            }
            // Audio
            "mp3" | "wav" | "flac" | "aac" | "ogg" | "wma" | "m4a" | "opus" => FileType::Audio,
            // Document
            "pdf" | "doc" | "docx" | "txt" | "rtf" | "odt" | "xls" | "xlsx" | "ppt" | "pptx" => {
                FileType::Document
            }
            _ => FileType::Other,
        }
    }
}

/// Core file entry - matches `files` table
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEntry {
    pub id: String,
    pub path: String,
    pub file_name: String,
    pub file_extension: String,
    pub file_type: FileType,
    pub content_hash: Option<String>,
    pub file_size: u64,
    pub duration_ms: Option<u64>,
    pub created_at: String,
    pub modified_at: String,
    pub indexed_at: Option<String>,
    pub duplicate_of: Option<String>,
}

/// Simplified file info for scanning (before full indexing)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScannedFile {
    pub path: String,
    pub file_name: String,
    pub file_extension: String,
    pub file_type: FileType,
    pub file_size: u64,
    pub created_at: String,
    pub modified_at: String,
}

/// Processing task status
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TaskStatus {
    Pending,
    Processing,
    Completed,
    Failed,
}

/// Processing task type
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TaskType {
    Vlm,
    Transcription,
    Embedding,
    Hash,
}
