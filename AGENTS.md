# AGENTS.md

Guidelines for AI agents and contributors working on Kuro-Roku.

## Project Overview

Kuro-Roku is a local-first file organization tool with ML-powered video analysis. The primary goal is to help users organize videos (and eventually other files) using vision-language models and transcription.

**Key constraint**: Local-only is mandatory for baseline functionality. Users may have private/sensitive content.

## Architecture

Read `docs/ARCHITECTURE.md` for detailed technical documentation. Quick summary:

| Layer      | Technology                | Location         |
| ---------- | ------------------------- | ---------------- |
| Desktop    | Tauri v2                  | `src-tauri/`     |
| Frontend   | React 19.2.3              | `src/`           |
| Frontend   | Vite 7.3.1                | `src/`           |
| Frontend   | TypeScript 5.9.3          | `src/`           |
| Backend    | Rust 1.89                 | `src-tauri/src/` |
| ML Sidecar | Python 3.13 (3.11+)       | `python/`        |
| Database   | SQLite + Qdrant           | Runtime          |

## Development Commands

```bash
# Run in development mode (requires admin cmd on Windows for first build)
npm run tauri dev

# Build for production
npm run tauri build

# Frontend only (for UI development)
npm run dev

# Python sidecar (when implemented, use venv with uv)
cd python && uv venv && .venv\Scripts\activate && uv pip install -e . && python -m kuro_ml.server
```

## Code Organization

### Rust Backend (`src-tauri/src/`)

```
src/
├── lib.rs          # Main entry, Tauri builder setup
├── main.rs         # Binary entry point
└── commands/       # Tauri IPC commands (exposed to frontend)
    └── mod.rs
```

**Adding new commands:**

1. Create the function in `commands/mod.rs` or a new submodule
2. Add `#[tauri::command]` attribute
3. Register in `lib.rs` via `generate_handler![]`

### React Frontend (`src/`)

```
src/
├── main.tsx        # React entry point
├── App.tsx         # Main app component
├── styles/         # CSS files
├── components/     # React components (to be added)
├── hooks/          # Custom hooks (to be added)
└── stores/         # Zustand stores (to be added)
```

**Communicating with Rust:**

```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke<string>("command_name", { arg1: value1 });
```

### Python Sidecar (`python/`)

```
python/
├── kuro_ml/
│   ├── __init__.py
│   ├── server.py       # FastAPI endpoints
│   ├── vlm.py          # Qwen3-VL inference
│   ├── transcription.py # Whisper integration
│   └── embeddings.py   # SigLIP2/embedding generation
└── pyproject.toml
```

**Not yet implemented** - placeholder structure only.

## Coding Conventions

- Use absolute paths for imports

### Rust

- Use `thiserror` for error types, `anyhow` for error propagation
- Async where appropriate (tokio runtime available)
- Log with `log::info!`, `log::error!`, etc.
- Keep commands thin - delegate to dedicated modules

### TypeScript/React

- Functional components with hooks
- Path alias `@/` maps to `src/`
- Zustand for state management (when needed)
- CSS Modules or plain CSS (no Tailwind unless explicitly requested)

### Python

- Type hints required
- FastAPI for HTTP endpoints
- Models loaded lazily to reduce startup time

## Key Design Decisions

### Manifest-based Processing

Files are never moved/modified automatically. The system:

1. Analyzes files and proposes actions
2. Creates a manifest of proposed changes
3. User reviews and approves/rejects
4. Only then executes the approved actions

### Duplicate Handling

- Index first, dedupe later
- Mark duplicates in DB, don't auto-delete
- Use BLAKE3 full-file hash (fast enough for large files)

### Video Understanding

- Qwen3-VL with native video input (not frame-by-frame captioning)
- Temporal understanding required for proper categorization
- Confidence scoring against user-defined taxonomy

## Testing

```bash
# Rust tests
cd src-tauri && cargo test

# TypeScript checks
npm run build  # includes tsc

# Python tests (when implemented)
cd python && pytest
```

## Important Files

| File                        | Purpose                      |
| --------------------------- | ---------------------------- |
| `docs/ARCHITECTURE.md`      | Full technical documentation |
| `CHANGELOG.md`              | Version history              |
| `src-tauri/Cargo.toml`      | Rust dependencies            |
| `package.json`              | Node dependencies & scripts  |
| `src-tauri/tauri.conf.json` | Tauri configuration          |

## Common Tasks

### Adding a new Rust dependency

```bash
cd src-tauri
cargo add <crate-name>
```

### Adding a new npm dependency

```bash
npm install <package-name>
# or for dev dependencies
npm install -D <package-name>
```

### Creating a new Tauri command

1. Add function to `src-tauri/src/commands/mod.rs`:

```rust
#[tauri::command]
pub fn my_command(arg: String) -> Result<String, String> {
    Ok(format!("Processed: {}", arg))
}
```

2. Register in `src-tauri/src/lib.rs`:

```rust
.invoke_handler(tauri::generate_handler![greet, my_command])
```

3. Call from React:

```typescript
const result = await invoke<string>("my_command", { arg: "test" });
```

## Current Status

🚧 **Early Development** - Core skeleton complete, features in progress.

See `docs/ARCHITECTURE.md` Open Questions section for pending decisions.
