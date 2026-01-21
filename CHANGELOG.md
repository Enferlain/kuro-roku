# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
