# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0-dev] - 2026-01-24

### Added

- **SQLite database module** (`db.rs`): Schema initialization with files, tags, processing_queue tables
- **Data models** (`models.rs`): FileEntry, ScannedFile, FileType enum with extension detection
- **File system commands** (`commands/fs.rs`):
  - `select_directory` - Folder picker dialog (Tauri dialog plugin)
  - `scan_directory` - Recursive directory scanning with walkdir
  - `get_file_info` - File metadata extraction
  - `hash_file` - BLAKE3 content hashing
- **Frontend stack**: Added Tailwind CSS v4, shadcn/ui, Zustand, Lucide icons
- **Zustand store** (`fileStore.ts`): File browsing state with Tauri IPC integration
- **UI Components**:
  - `Sidebar` - Navigation with Library, Smart Views, Tags sections
  - `FileGrid` - Grid display with file cards and loading states
  - `DetailsPanel` - File preview and metadata display
- **3-column layout**: Sidebar | Content | Details panel (from ui_sketches.md)

### Changed

- Restructured App.tsx to use new component architecture
- Updated vite.config.ts with Tailwind plugin
- CSS now uses shadcn/ui theming with dark mode

## [0.1.0] - 2026-01-21

### Added

- **Project scaffolding**: Tauri v2 + React + Vite + TypeScript
- **Rust backend**: Initial structure with Tauri commands, logging
- **Rust dependencies**: rusqlite, blake3, tokio, walkdir, chrono, thiserror, anyhow
- **React frontend**: Basic app shell with dark theme, IPC connection test
- **Python sidecar**: Placeholder structure for ML processing (VLM, transcription, embeddings)
- **Architecture documentation**: Comprehensive `docs/ARCHITECTURE.md` covering:
  - Technology stack decisions (Tauri, React, SQLite, Qdrant, Qwen3-VL)
  - Video processing pipeline design
  - Database schema draft
  - Manifest-based processing workflow
  - Duplicate handling strategy
