# UI Architecture

> Kuro-Roku UI structure and workflow definition

---

## Tab Structure

| Tab           | Purpose                       | Key Features                                                |
| ------------- | ----------------------------- | ----------------------------------------------------------- |
| **Library**   | Browse, view, select files    | Grid/List/TreeMap views, file selection, properties panel   |
| **Staging**   | Pre-processing review         | Queue management, configure analysis, launch processing     |
| **Monitor**   | Track activity & system state | Processing progress, GPU/VRAM stats, library health metrics |
| **Workbench** | Post-processing & cleanup     | Manifest review, duplicate resolution, bulk operations      |

---

## Workflow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌───────────┐
│ Library │ ──► │ Staging │ ──► │ Monitor │ ──► │ Workbench │
└─────────┘     └─────────┘     └─────────┘     └───────────┘
   Browse         Review          Watch          Act on
   Select      Configure         Progress        Results
 Add to Queue    Launch                        Approve/Reject
```

---

## Tab Details

### 1. Library

**Main area**: File browser

- Grid view (thumbnails)
- List view (table)
- TreeMap view (WizTree-style storage visualization)
- View mode toggle in toolbar

**Left sidebar**: Explorer-style navigation

- Pinned folders
- Recent/frequent locations
- Scanned source folders
- Smart filters (by type, status)
- Tags section

**Right panel**: Properties

- File preview/thumbnail
- Metadata (size, duration, path)
- Analysis status indicators
- Tags (view/edit)

**Actions**: Select files → "Add to Queue" → redirects to Staging

---

### 2. Staging

**Purpose**: Mandatory review step before processing starts

**Main area**: Queue list

- All items staged for processing
- Reorder, remove, configure options
- Batch settings (model selection, priority)

**Actions**:

- Review what's about to be processed
- Remove unwanted items
- Set processing parameters
- **"Start Processing"** button → kicks off analysis

---

### 3. Monitor

**Purpose**: Observe ongoing work and system state

**Main area**: Activity dashboard

- Active processing tasks with progress
- GPU/VRAM usage gauges
- Estimated time remaining

**Stats section**:

- Files indexed vs pending
- Storage breakdown
- Recent activity log

**Note**: View-only tab, no actions to take here

---

### 4. Workbench

**Purpose**: Post-processing decisions and cleanup

**Main area**: Action items requiring decisions

**Sections**:

1. **Manifest Review** (VLM-proposed actions)
   - Proposed moves, tags, categories
   - Approve/reject per item or batch
   - Execute approved actions

2. **Duplicate Resolution** (Czkawka-style)
   - Groups of duplicate/similar files
   - Side-by-side comparison
   - Keep/delete/hardlink options

3. **Pending Cleanup**
   - Low-confidence items flagged for review
   - Untaggable/unrecognized content

Items appear here automatically after processing completes.

---

## Sidebar (Library Tab)

```
QUICK ACCESS
├── 📌 Downloads
├── 📌 Videos/Cooking
├── ⏱️ Recent: Japan Trip
└── ⏱️ Recent: Work Project

SOURCES
├── D:\Videos (scanned)
├── C:\Downloads (scanned)
└── + Add Source

SMART VIEWS
├── 🕒 Recently Added
├── ⚠️ Unindexed
├── 🔍 Needs Review
└── 📋 Duplicates

TAGS
├── #cooking (45)
├── #tutorial (30)
├── #travel (28)
├── [Search tags...]
└── [Show more...]
```

---

## Design Principles

1. **Tab = What you're doing** (browsing, staging, monitoring, acting)
2. **Sidebar = Where you're looking** (folder, filter, tag)
3. **No automatic processing** – staging is mandatory
4. **Results flow to Workbench** – users act on them later
5. **Monitor tab shows state, not file contents**

---

## Layout Considerations

### TreeMap Mode (Library)

When user selects TreeMap view, it should expand to use more of the viewport. Options:

- Hide sidebar temporarily
- Collapse details panel
- Or allow floating overlay mode

### Right Panel Consistency

- **Library**: Properties panel (always)
- **Staging**: Queue details/settings (optional)
- **Monitor**: Could be hidden (dashboard is the focus)
- **Workbench**: Comparison details / action preview

### Workbench Sub-navigation

Workbench has multiple concerns (manifest, duplicates, cleanup). Could use:

- Tabs within the Workbench tab
- Collapsible sections
- Left sub-menu within Workbench
