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
- **Design System** (`src/styles/design-system.css`):
  - Layered token architecture (Base → Semantic → Component → Tailwind)
  - Base palette: kuro, smoke, slate, violet, azure, jade, gold, coral scales
  - Semantic tokens for foreground, background, borders, shadows
  - Dark theme support via `.dark` class
  - Tailwind bridge via `@theme inline`
- **UI Architecture** (4-tab structure):
  - Library - File browsing with Grid/List/TreeMap views
  - Staging - Pre-processing queue management
  - Monitor - Processing status and system metrics
  - Workbench - Post-processing (manifest review, duplicates)
- **App Shell** (`src/components/layout/`):
  - `AppShell` - Main layout wrapper with tab routing
  - `Header` - Navigation with tabs, search, and actions
  - `Background` - Animated gradient blobs with grid overlay
- **Library Tab Components** (`src/components/library/`):
  - `LibrarySidebar` - Explorer-style with Quick Access, Sources, Smart Views, Tags
  - `LibraryContent` - File grid/list with view mode toggle
  - `LibraryDetails` - Properties panel with metadata and analysis status
- **Shared Components** (`src/components/ui/shared.tsx`):
  - `Button` - Primary, secondary, ghost, icon variants
  - `Badge` - Success, warning, error, info, neutral variants
  - `Card` - Selectable card with hover effects
  - `SearchInput` - Search field with icon
  - `SectionHeader` - For sidebar/panel sections
- **Documentation**:
  - `docs/UI_ARCHITECTURE.md` - Tab structure, workflow, sidebar design
  - `docs/STYLING_GUIDE.md` - Token hierarchy, color classes, conventions
  - `docs/ROADMAP.md` - Updated project phases

### Changed

- Restructured App.tsx to use new AppShell component
- Replaced `fileStore.ts` with unified `appStore.ts`
- All components now use semantic design tokens (no hardcoded colors)
- CSS refactored: `index.css` imports modular `design-system.css`
- Added Inter + JetBrains Mono fonts from Google Fonts

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
