// Database module - SQLite initialization and operations

use anyhow::{Context, Result};
use rusqlite::Connection;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

/// Database state managed by Tauri
pub struct DbState(pub Mutex<Connection>);

/// Get the database path in app data directory
fn get_db_path(app: &AppHandle) -> Result<PathBuf> {
    let app_data = app
        .path()
        .app_data_dir()
        .context("Failed to get app data directory")?;

    // Ensure directory exists
    std::fs::create_dir_all(&app_data).context("Failed to create app data directory")?;

    Ok(app_data.join("kuro-roku.db"))
}

/// Initialize the database connection and create schema
pub fn init_database(app: &AppHandle) -> Result<Connection> {
    let db_path = get_db_path(app)?;
    log::info!("Initializing database at: {:?}", db_path);

    let conn = Connection::open(&db_path).context("Failed to open database")?;

    // Enable foreign keys
    conn.execute_batch("PRAGMA foreign_keys = ON;")
        .context("Failed to enable foreign keys")?;

    create_schema(&conn)?;

    log::info!("Database initialized successfully");
    Ok(conn)
}

/// Create database schema (from ARCHITECTURE.md)
fn create_schema(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        r#"
        -- Core file tracking
        CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            path TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_extension TEXT NOT NULL,
            file_type TEXT NOT NULL,
            content_hash TEXT,
            file_size INTEGER NOT NULL,
            duration_ms INTEGER,
            created_at TEXT NOT NULL,
            modified_at TEXT NOT NULL,
            indexed_at TEXT,
            duplicate_of TEXT,
            UNIQUE(path)
        );

        -- Processing state tracking
        CREATE TABLE IF NOT EXISTS processing_queue (
            id INTEGER PRIMARY KEY,
            file_id TEXT NOT NULL REFERENCES files(id),
            task_type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            priority INTEGER DEFAULT 0,
            started_at TEXT,
            completed_at TEXT,
            error_message TEXT,
            UNIQUE(file_id, task_type)
        );

        -- User-defined and auto-generated tags
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            tag_type TEXT NOT NULL,
            color TEXT
        );

        CREATE TABLE IF NOT EXISTS file_tags (
            file_id TEXT NOT NULL REFERENCES files(id),
            tag_id INTEGER NOT NULL REFERENCES tags(id),
            confidence REAL,
            source TEXT,
            PRIMARY KEY(file_id, tag_id)
        );

        -- Create indexes for common queries
        CREATE INDEX IF NOT EXISTS idx_files_hash ON files(content_hash);
        CREATE INDEX IF NOT EXISTS idx_files_type ON files(file_type);
        CREATE INDEX IF NOT EXISTS idx_queue_status ON processing_queue(status);
        "#,
    )
    .context("Failed to create schema")?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_schema_creation() {
        let conn = Connection::open_in_memory().unwrap();
        create_schema(&conn).unwrap();

        // Verify tables exist
        let tables: Vec<String> = conn
            .prepare("SELECT name FROM sqlite_master WHERE type='table'")
            .unwrap()
            .query_map([], |row| row.get(0))
            .unwrap()
            .filter_map(Result::ok)
            .collect();

        assert!(tables.contains(&"files".to_string()));
        assert!(tables.contains(&"tags".to_string()));
        assert!(tables.contains(&"processing_queue".to_string()));
    }
}
