# Kuro-Roku Architecture

> Local file organization tool with ML-powered video analysis

## Overview

Kuro-roku is a local-first application for organizing videos, images, documents, and other files. The initial focus is on video organization using Vision-Language Models (VLM) for visual analysis and automatic transcription for audio content.

---

## Technology Stack

### Decided

| Layer                 | Technology        | Rationale                                           |
| --------------------- | ----------------- | --------------------------------------------------- |
| **Desktop Framework** | Tauri v2          | Native feel, small bundle, full filesystem access   |
| **Frontend**          | Vite + React      | Best LLM assistance, excellent component ecosystem  |
| **Backend Core**      | Rust (via Tauri)  | File ops, database, task queue management           |
| **ML Processing**     | Python (sidecar)  | VLM and transcription model ecosystem               |
| **Database**          | SQLite (rusqlite) | Simple, file-based, cross-platform                  |
| **Vector Store**      | Qdrant (embedded) | Multi-vector support, Rust client, production-ready |

### Under Consideration

| Component            | Options                     | Notes                                   |
| -------------------- | --------------------------- | --------------------------------------- |
| **VLM**              | Qwen3-VL, Gemma             | Need to evaluate speed/quality tradeoff |
| **Embedding**        | SigLIP2                     | Need to evaluate and check more options |
| **Transcription**    | Whisper.cpp, faster-whisper | faster-whisper is ~4x faster            |
| **UI Components**    | shadcn/ui, Radix            | Likely shadcn for flexibility           |
| **State Management** | Zustand, Jotai              | Zustand is simpler                      |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Kuro-Roku (Tauri App)                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Frontend (Vite + React)                                ││
│  │  - File browser UI                                      ││
│  │  - Video player with metadata overlay                   ││
│  │  - Search & organization interface                      ││
│  │  - Processing queue dashboard                           ││
│  └─────────────────────────────────────────────────────────┘│
│                           │ Tauri IPC                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Rust Core (Tauri Commands)                             ││
│  │  - File system operations (scan, watch, read)           ││
│  │  - Database operations (SQLite via rusqlite)            ││
│  │  - Task queue management                                ││
│  │  - Video metadata extraction (ffprobe)                  ││
│  │  - File hashing and deduplication                       ││
│  └─────────────────────────────────────────────────────────┘│
│                           │ HTTP / Subprocess                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Python Sidecar                                         ││
│  │  - VLM inference (visual content analysis)              ││
│  │  - Whisper transcription                                ││
│  │  - Embedding generation for semantic search             ││
│  │  - Language detection                                   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Video Processing Pipeline

### Philosophy: Separate Analysis Streams

Visual and audio analysis run independently to avoid bias:

- VLM analyzes frames without knowing transcript content
- Transcription captures dialogue/narration from audio
- Results are fused at the end for richer categorization

### Pipeline Flow

```
┌─────────────┐
│   Video     │
│   Input     │
└──────┬──────┘
       │
       ├────────────────────────────────────────┐
       │                                        │
       ▼                                        ▼
┌──────────────────┐                 ┌──────────────────┐
│  Frame Extractor │                 │  Audio Extractor │
│  (keyframes)     │                 │  (ffmpeg)        │
└────────┬─────────┘                 └────────┬─────────┘
         │                                    │
         ▼                                    ▼
┌──────────────────┐                 ┌──────────────────┐
│  VLM Analysis    │                 │  Transcription   │
│  (visual only)   │                 │  (Whisper)       │
└────────┬─────────┘                 └────────┬─────────┘
         │                                    │
         │    ┌──────────────────┐            │
         └───►│   Aggregation    │◄───────────┘
              │   + Fusion       │
              │   Layer          │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Categorization  │
              │  + Storage       │
              └──────────────────┘
```

### Video Understanding

**The core challenge**: We need to understand _what happens in a video_, not just describe individual frames.

```
❌ Frame captions:          ✅ Video understanding:
"Person in kitchen"         "Cooking tutorial demonstrating
"Hands on counter"           homemade pasta from scratch -
"Pot on stove"               mixing, kneading, rolling, and
"Plated food"                cooking the final dish"
```

#### Solution: Qwen3-VL (Native Video Support) ✅

**Qwen3-VL supports native video input** with temporal understanding:

- Configurable `fps` and `num_frames` settings
- Processes video directly, not just frames

**Model variants:**
| Size | Type | Notes |
|------|------|-------|
| 30B A3B | MoE | Very easy to run (active ~3B params) |
| 32B | Dense | Full capability |
| 8B | Dense | Good balance |
| 4B | Dense | Lighter |
| 2B | Dense | Fastest |

Both **thinking** and **instruct** variants available.

#### Categorization Strategy

Use confidence/"temperature" scoring against existing categories:

- Compare video description to user's taxonomy
- Score how well content fits each category
- High confidence → auto-categorize, low confidence → flag for review

> [!IMPORTANT]
> **Local-only is mandatory for baseline functionality.**
>
> - Users may have content that violates API provider ToS
> - Privacy-sensitive personal content
> - API can be optional future feature, but core must work offline

### Frame Extraction Strategy (if using frame-based approach)

Options to evaluate:

1. **Scene change detection** - Extract frames when visual content changes significantly
2. **Fixed interval** - Extract every N seconds (simpler, predictable)
3. **Hybrid** - Fixed interval + scene changes for long videos
4. **Adaptive** - More frames for ambiguous content, fewer for clear content

---

## File Identification

Each file gets a composite identifier for tracking and deduplication:

```rust
struct FileIdentifier {
    // Full content hash - BLAKE3 is fast enough even for large files
    content_hash: String,  // BLAKE3 (full file)

    // File metadata
    file_size: u64,
    file_extension: String,  // e.g., "mp4", "mkv", "avi"

    // For videos specifically
    duration_ms: Option<u64>,

    // Generated short ID for references
    short_id: String,  // e.g., "v_a7f3b2c1"
}
```

**Why BLAKE3 full hash:**

- BLAKE3 is extremely fast (~7GB/s on modern CPUs)
- Tested fast on 7GB+ SDXL models, acceptable for video files
- Exact duplicate detection with no false positives
- Can benchmark later and optimize if needed

---

## Duplicate Handling

Inspired by [czkawka](https://github.com/qarmin/czkawka) - duplicates should not block the workflow:

### Strategy: Non-blocking Detection

1. **Index first, dedupe later** - Files are always indexed on discovery
2. **Mark, don't delete** - Duplicates are flagged in DB, not auto-removed
3. **User decides** - UI shows duplicate groups for manual resolution
4. **Soft links optional** - Option to replace dupes with symlinks/hardlinks

### Duplicate Types

| Type               | Detection                    | Notes                        |
| ------------------ | ---------------------------- | ---------------------------- |
| **Exact**          | Same BLAKE3 hash             | Identical files              |
| **Near-duplicate** | Same duration + similar size | Re-encodes, quality variants |
| **Perceptual**     | Similar keyframe pHashes     | Visual similarity (future)   |

---

## Processing Workflow: Manifest-based

Instead of automatically moving/organizing files, the system uses a **propose → review → execute** pattern:

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐
│ User selects │────►│ System analyzes  │────►│ Manifest created │────►│ User reviews│
│ folders      │     │ files (VLM, etc) │     │ with proposals   │     │ & approves  │
└──────────────┘     └──────────────────┘     └──────────────────┘     └──────┬──────┘
                                                                              │
      ┌───────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────┐
│ Execute batch   │
│ (moves, tags,   │
│  dedup choices) │
└─────────────────┘
```

### Why This Pattern

1. **Non-destructive** - Nothing moves until user approves
2. **Batch review** - Review 100 proposals at once, not one-by-one
3. **Bundled decisions** - File moves + tags + duplicate choices in one step
4. **Undo-friendly** - Manifest records what was done, enables reversal
5. **Transparency** - User can see exactly what the system wants to do

### Folder Monitoring (Optional)

- **Default**: User manually triggers scans
- **Optional**: Enable watchers on specific folders (e.g., Downloads)
- When monitored folder gets new files → adds to pending manifest
- User reviews accumulated proposals when convenient

---

## Database Schema (Draft)

```sql
-- Core file tracking
CREATE TABLE files (
    id TEXT PRIMARY KEY,           -- short_id
    path TEXT NOT NULL,
    file_name TEXT NOT NULL,       -- basename for display
    file_extension TEXT NOT NULL,  -- 'mp4', 'mkv', 'jpg', etc.
    file_type TEXT NOT NULL,       -- 'video', 'image', 'document', etc.
    content_hash TEXT NOT NULL,    -- BLAKE3 full hash
    file_size INTEGER NOT NULL,
    duration_ms INTEGER,           -- for videos/audio
    created_at TEXT NOT NULL,
    modified_at TEXT NOT NULL,
    indexed_at TEXT,
    duplicate_of TEXT,             -- points to canonical file ID if duplicate

    UNIQUE(path)
);

-- Processing state tracking
CREATE TABLE processing_queue (
    id INTEGER PRIMARY KEY,
    file_id TEXT NOT NULL REFERENCES files(id),
    task_type TEXT NOT NULL,       -- 'vlm', 'transcription', 'embedding'
    status TEXT NOT NULL,          -- 'pending', 'processing', 'completed', 'failed'
    priority INTEGER DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    error_message TEXT,

    UNIQUE(file_id, task_type)
);

-- VLM analysis results
CREATE TABLE vlm_analysis (
    id INTEGER PRIMARY KEY,
    file_id TEXT NOT NULL REFERENCES files(id),
    frame_timestamp_ms INTEGER,    -- which frame this is from
    description TEXT,              -- VLM's description
    detected_objects TEXT,         -- JSON array
    detected_text TEXT,            -- OCR'd text in frame
    scene_type TEXT,               -- e.g., 'outdoor', 'indoor', 'animation'
    analyzed_at TEXT NOT NULL
);

-- Transcription results
CREATE TABLE transcriptions (
    id INTEGER PRIMARY KEY,
    file_id TEXT NOT NULL REFERENCES files(id),
    language TEXT,
    full_text TEXT,
    segments TEXT,                 -- JSON array with timestamps
    confidence REAL,
    transcribed_at TEXT NOT NULL,

    UNIQUE(file_id)
);

-- User-defined and auto-generated tags
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    tag_type TEXT NOT NULL,        -- 'auto', 'user'
    color TEXT
);

CREATE TABLE file_tags (
    file_id TEXT NOT NULL REFERENCES files(id),
    tag_id INTEGER NOT NULL REFERENCES tags(id),
    confidence REAL,               -- for auto-tags, how confident the model is
    source TEXT,                   -- 'vlm', 'transcription', 'user'

    PRIMARY KEY(file_id, tag_id)
);

-- Embedding metadata (actual vectors stored in Qdrant)
CREATE TABLE embedding_refs (
    id INTEGER PRIMARY KEY,
    file_id TEXT NOT NULL REFERENCES files(id),
    qdrant_point_id TEXT NOT NULL,  -- Reference to Qdrant point
    embedding_type TEXT NOT NULL,   -- 'visual', 'transcript', 'combined'
    model_name TEXT NOT NULL,
    created_at TEXT NOT NULL,

    UNIQUE(file_id, embedding_type)
);

-- Action manifest for batch operations
CREATE TABLE action_manifest (
    id INTEGER PRIMARY KEY,
    batch_id TEXT NOT NULL,          -- Groups related actions
    file_id TEXT NOT NULL REFERENCES files(id),
    action_type TEXT NOT NULL,       -- 'move', 'tag', 'delete', 'dedupe_keep', 'dedupe_remove'
    proposed_path TEXT,              -- For move actions
    proposed_tags TEXT,              -- JSON array for tag actions
    status TEXT DEFAULT 'pending',   -- 'pending', 'approved', 'rejected', 'executed'
    created_at TEXT NOT NULL,
    executed_at TEXT
);
```

---

## Open Questions

### Technical Decisions Needed

1. ~~**Vector Store Choice**~~ → **Decided: Qdrant (embedded mode)**
   - Split architecture: SQLite for metadata, Qdrant for vectors
   - Multi-vector support (visual, transcript, combined per file)
   - Native Rust client for Tauri integration

2. ~~**VLM / Video Understanding**~~ → **Decided: Qwen3-VL**
   - Native video input with temporal understanding
   - MoE 30B A3B variant recommended (easy to run)
   - Confidence scoring against user taxonomy
   - See: https://huggingface.co/collections/Qwen/qwen3-vl

3. **Transcription Model** _(User researching)_
   - Candidates: Whisper.cpp, faster-whisper
   - Whisper sizes: tiny → large (speed vs accuracy)
   - Language detection strategy

4. **Python Sidecar Communication**
   - HTTP API (FastAPI in separate process)
   - Direct subprocess with stdio JSON
   - Tauri's built-in sidecar feature

5. **Agent-based vs Fully Automated Processing**
   - **Decided**: Hybrid approach
   - Automated for common cases, agent for edge cases/low confidence
   - See discussion in Appendix

6. **Tagging System Schema**
   - Booru-style tagging system needed
   - Schema details TBD (consider: namespaces, tag relationships, aliases)
   - Current basic schema in place, may need expansion

### UX Decisions Made

1. **Processing Workflow: Manifest-based**
   - User manually launches scans on selected folders (not auto-watch by default)
   - Optional: folder monitoring for new items (Downloads, etc.)
   - System proposes actions → creates manifest → user reviews → executes batch
   - Bundles: file moves, tagging, duplicate decisions all in one review step

2. **Categorization**
   - Must be adjustable/configurable by user
   - Allow custom taxonomies and rules
   - Preset templates (e.g., "media library", "tutorial archive")

3. **Search Interface** _(Open)_
   - Text search, semantic search, content filtering all planned
   - Exact implementation TBD as system matures

---

## Project Structure (Proposed)

```
kuro-roku/
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands/       # Tauri command handlers
│   │   ├── db/             # Database operations
│   │   ├── fs/             # File system operations
│   │   ├── processing/     # Task queue, job management
│   │   └── utils/          # Hashing, etc.
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── src/                    # React frontend
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── stores/             # Zustand stores
│   ├── lib/                # Utilities
│   ├── App.tsx
│   └── main.tsx
│
├── python/                 # ML sidecar
│   ├── kuro_ml/
│   │   ├── __init__.py
│   │   ├── vlm.py          # Vision-language model inference
│   │   ├── transcription.py # Whisper integration
│   │   ├── embeddings.py   # Embedding generation
│   │   └── server.py       # FastAPI or stdio interface
│   ├── pyproject.toml
│   └── requirements.txt
│
├── docs/
│   ├── ARCHITECTURE.md     # This file
│   └── ...
│
└── README.md
```

---

## Development Phases (High Level)

### Phase 1: Foundation

- [ ] Tauri + React project scaffolding
- [ ] Basic file browser UI
- [ ] SQLite database setup
- [ ] File scanning and metadata extraction

### Phase 2: Video Processing

- [ ] Python sidecar setup
- [ ] Keyframe extraction
- [ ] VLM integration
- [ ] Transcription integration
- [ ] Processing queue with status UI

### Phase 3: Organization

- [ ] Tagging system (auto + manual)
- [ ] Search functionality
- [ ] Category views
- [ ] Duplicate detection

### Phase 4: Polish

- [ ] Semantic search with embeddings
- [ ] Folder watching for new files
- [ ] Settings and preferences
- [ ] Performance optimization

---

## References

- [Tauri v2 Documentation](https://v2.tauri.app/)
- [Vite + React Setup](https://vitejs.dev/guide/)
- [rusqlite](https://docs.rs/rusqlite/)
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- [Qwen3-VL](https://huggingface.co/collections/Qwen/qwen3-vl)
- [czkawka](https://github.com/qarmin/czkawka) - Duplicate finder inspiration
- [BLAKE3](https://github.com/BLAKE3-team/BLAKE3) - Fast cryptographic hash

---

## Appendix: Agent-based Processing Discussion

### The Question

Should the processing pipeline be:

1. **Fully automated** - Deterministic pipeline, same input → same output
2. **Agent-based** - LLM decides processing steps, can adapt to content
3. **Hybrid** - Automated by default, agent for edge cases/review

### Fully Automated Pros/Cons

| Pros                               | Cons                              |
| ---------------------------------- | --------------------------------- |
| Predictable, reproducible          | Inflexible to edge cases          |
| Faster (no LLM reasoning overhead) | May miss nuanced categorization   |
| Lower resource usage               | Static rules need manual updating |
| Easier to debug                    |                                   |

### Agent-based Pros/Cons

| Pros                      | Cons                                |
| ------------------------- | ----------------------------------- |
| Adapts to unusual content | Slower (LLM reasoning per decision) |
| Can ask for clarification | Non-deterministic outputs           |
| Better at ambiguous cases | Higher resource usage               |
| Can explain its decisions | Harder to debug                     |

### Potential Hybrid Approach

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ New Video   │────►│ Automated    │────►│ Standard        │
│             │     │ Pipeline     │     │ Categorization  │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
                    (confidence < threshold)
                           │
                           ▼
                    ┌──────────────┐     ┌─────────────────┐
                    │ Agent Review │────►│ Enhanced        │
                    │ (LLM)        │     │ Categorization  │
                    └──────────────┘     └─────────────────┘
```

**Triggers for agent intervention:**

- Low confidence scores from VLM/transcription
- Conflicting signals (visual vs audio)
- Content type not matching known categories
- User-flagged for review

### Decision: Hybrid (Decided)

Automated processing with confidence thresholds:

- High confidence → auto-categorize
- Low confidence → flag for review with suggestions
- User can always override
