# 黒録 Kuro-Roku

Local file organization tool with ML-powered video analysis.

## Features (Planned)

- 📁 **File Browser** - Browse and manage local files
- 🎬 **Video Analysis** - Understand video content using Qwen3-VL
- 🎤 **Transcription** - Audio transcription with Whisper
- 🏷️ **Smart Tagging** - Auto-categorization with confidence scoring
- 🔍 **Semantic Search** - Find files by meaning, not just keywords
- 📋 **Manifest-based Workflow** - Review proposed changes before execution

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Desktop  | Tauri v2                            |
| Frontend | React + Vite + TypeScript           |
| Backend  | Rust                                |
| Database | SQLite + Qdrant                     |
| ML       | Python (Qwen3-VL, Whisper, SigLIP2) |

## Development

### Prerequisites

- Node.js 18+
- Rust 1.77+
- Python 3.10+

### Setup

```bash
# Install frontend dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Project Structure

```
kuro-roku/
├── src/                 # React frontend
├── src-tauri/           # Rust backend
├── python/              # ML sidecar
└── docs/                # Architecture docs
```

## Status

🚧 **Early Development** - Core skeleton in place, features coming soon.

## License

MIT
