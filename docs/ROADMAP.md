# Kuro-Roku Roadmap

> Last updated: 2026-01-24

## Current Status

**Phase 1: Foundation** - In Progress

Core scaffolding complete. UI architecture defined.

---

## UI Architecture

See [UI_ARCHITECTURE.md](./UI_ARCHITECTURE.md) for complete details.

| Tab           | Purpose                                         |
| ------------- | ----------------------------------------------- |
| **Library**   | Browse, view, select files (Grid/List/TreeMap)  |
| **Staging**   | Queue management, configure & launch processing |
| **Monitor**   | Processing progress, system metrics             |
| **Workbench** | Manifest review, duplicates, cleanup            |

---

## Completed ✅

### Phase 1.1 - Database & File System

- [x] SQLite database initialization with schema
- [x] File system Tauri commands (scan, hash, metadata)
- [x] Data models (FileEntry, ScannedFile, FileType)

### Phase 1.2 - Basic UI Scaffold

- [x] 3-column layout (Sidebar | Content | Details)
- [x] Zustand store for file state
- [x] Sidebar navigation component
- [x] FileGrid with loading states
- [x] DetailsPanel with file metadata

---

## In Progress 🚧

### Phase 1.3 - Library Tab (Full Implementation)

- [ ] Header with tab navigation (Library active)
- [ ] Explorer-style sidebar (pinned, recent, sources, tags)
- [ ] Grid/List/TreeMap view toggles
- [ ] Improved visual design (per library_sketch reference)
- [ ] Wire scan functionality to Tauri backend
- [ ] Index files to database on scan

---

## Upcoming 📋

### Phase 2 - Staging Tab

- [ ] Queue list view
- [ ] Add to queue action from Library
- [ ] Configure processing options
- [ ] Start processing action

### Phase 3 - Monitor Tab

- [ ] Active task progress display
- [ ] GPU/VRAM usage indicators
- [ ] Processing history/log
- [ ] Library health metrics

### Phase 4 - Workbench Tab

- [ ] Manifest review (proposed actions)
- [ ] Approve/reject workflow
- [ ] Duplicate resolution (Czkawka-style comparison)
- [ ] Bulk operations execution

### Phase 5 - Python Sidecar (ML)

- [ ] FastAPI server setup
- [ ] Qwen3-VL integration for video analysis
- [ ] Whisper transcription
- [ ] SigLIP2 embeddings
- [ ] Qdrant vector store integration

---

## Design References

- `ui_references/library_sketch/` - Detailed Library view reference
- `ui_references/ui_sketches.md` - ASCII layouts for other views

---

## Notes for Future Sessions

1. **UI-first approach**: Build UI, connect backend as needed
2. **Tailwind + shadcn**: Tailwind v4 with shadcn/ui components
3. **Staging is mandatory**: No automatic processing
4. **Tauri commands ready**: `select_directory`, `scan_directory`, `get_file_info`, `hash_file`

---

## Quick Start

```bash
npm run dev          # Frontend only (Vite)
npm run tauri dev    # Full app with backend
cd src-tauri && cargo test  # Rust tests
```
