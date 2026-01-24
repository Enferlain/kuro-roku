# Kuro-Roku Roadmap

> Last updated: 2026-01-24

## Current Status

**Phase 1: Foundation** - In Progress

The core scaffolding is complete with database, file system commands, and basic UI layout implemented.

---

## Completed ✅

### Phase 1.1 - Database & File System

- [x] SQLite database initialization with schema
- [x] File system Tauri commands (scan, hash, metadata)
- [x] Data models (FileEntry, ScannedFile, FileType)

### Phase 1.2 - Basic UI Layout

- [x] 3-column layout (Sidebar | Content | Details)
- [x] Zustand store for file state
- [x] Sidebar navigation component
- [x] FileGrid with loading states
- [x] DetailsPanel with file metadata

---

## In Progress 🚧

### Phase 1.2 - UI Polish

- [ ] Test scan functionality with Tauri backend
- [ ] Improve visual styling (colors, spacing, typography)
- [ ] Hide details panel when no file selected
- [ ] Add view toggle (grid/list)
- [ ] Sort/filter options in header

---

## Upcoming 📋

### Phase 1.3 - File Indexing

- [ ] Index scanned files to SQLite database
- [ ] Display indexed vs pending status
- [ ] File deduplication (BLAKE3 hash comparison)
- [ ] Basic file type statistics

### Phase 2 - Processing Queue View

- [ ] Processing queue UI (from ui_sketches.md)
- [ ] Task status display (pending, processing, completed, failed)
- [ ] VRAM/GPU usage indicators
- [ ] Estimated completion time

### Phase 3 - Manifest Review View

- [ ] Manifest review UI (from ui_sketches.md)
- [ ] Proposed actions display (move, tag, dedupe)
- [ ] Approve/reject workflow
- [ ] Batch execution

### Phase 4 - Analytics View (WizTree-inspired)

- [ ] Treemap visualization for storage breakdown
- [ ] File type statistics
- [ ] Extension breakdown with bar charts
- [ ] Color by file type or AI category

### Phase 5 - Duplicate Resolution (Czkawka-inspired)

- [ ] Side-by-side comparison view
- [ ] Metadata comparison (size, date, hash)
- [ ] Action selection (keep, delete, hardlink)
- [ ] Batch duplicate resolution

### Phase 6 - Python Sidecar (ML)

- [ ] FastAPI server setup
- [ ] Qwen3-VL integration for video analysis
- [ ] Whisper transcription
- [ ] SigLIP2 embeddings
- [ ] Qdrant vector store integration

---

## Design References

See `ui_sketches.md` for ASCII mockups of:

- Library view (3-column layout) ✅ Implemented
- Video detail view
- Processing queue view
- Manifest review view
- WizTree-inspired analytics
- Czkawka-inspired duplicate resolution

---

## Notes for Future Sessions

1. **UI-first approach**: Build UI components first, connect to backend as needed
2. **Tailwind + shadcn**: Project uses Tailwind CSS v4 with shadcn/ui components
3. **CSS Modules**: Available for custom component styling alongside shadcn
4. **Tauri commands ready**: `select_directory`, `scan_directory`, `get_file_info`, `hash_file`
5. **Database ready**: SQLite schema in place, just needs to be used

---

## Quick Start Commands

```bash
# Frontend development (Vite only)
npm run dev

# Full app with Tauri backend
npm run tauri dev

# Rust tests
cd src-tauri && cargo test
```
