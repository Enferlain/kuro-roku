# Library Page Implementation Spec

Detailed specification for implementing the Library page in Kuro-Roku.

---

## Overview

The Library page is the main file browsing interface. It follows a 3-column layout:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                        │
│  [Logo] [Library|Staging|Monitor|Workbench]  [Search]  [Filter][Scan][⚙️] │
├──────────────┬─────────────────────────────────────────┬───────────────────┤
│              │                                         │                   │
│   SIDEBAR    │              CONTENT                    │     DETAILS       │
│   (256px)    │              (flex-1)                   │     (320px)       │
│              │                                         │                   │
│  Quick Access│   ┌──────────────────────────────┐     │   [Preview]       │
│  ├ Downloads │   │ Toolbar: Path | View Toggle  │     │                   │
│  ├ Videos    │   ├──────────────────────────────┤     │   File Name       │
│  └ Recent    │   │                              │     │   [type] [ext]    │
│              │   │   Grid / List / TreeMap      │     │                   │
│  SOURCES     │   │                              │     │   Metadata        │
│  ├ D:\Videos │   │   [File] [File] [File]       │     │   ├ Size          │
│  └ + Add     │   │   [File] [File] [File]       │     │   ├ Modified      │
│              │   │                              │     │   └ Path          │
│  SMART VIEWS │   │                              │     │                   │
│  ├ Recent    │   │                              │     │   Analysis Status │
│  ├ Unindexed │   │                              │     │   ├ VLM ○         │
│  └ Review    │   │                              │     │   ├ Audio ○       │
│              │   │                              │     │   └ Embed ○       │
│  TAGS        │   │                              │     │                   │
│  # cooking   │   └──────────────────────────────┘     │   [Add to Queue]  │
│  # tutorial  │                                         │                   │
│              │                                         │                   │
└──────────────┴─────────────────────────────────────────┴───────────────────┘
```

---

## Component Structure

```
src/components/
├── layout/
│   ├── AppShell.tsx      # Main wrapper, renders active tab
│   ├── Header.tsx        # Top bar with tabs, search, actions
│   └── Background.tsx    # Animated gradient background
├── library/
│   ├── LibrarySidebar.tsx    # Left navigation panel
│   ├── LibraryContent.tsx    # Center content with file grid
│   └── LibraryDetails.tsx    # Right properties panel
└── tabs/
    └── LibraryTab.tsx    # Composes the 3 library components
```

---

## Header Component

### Visual Design

- Height: 64px (`h-16`)
- Background: Transparent (background shows through)
- Layout: Flex, justify-between

### Sections

**Left: Brand + Navigation**

```tsx
<div className="flex items-center gap-6">
  {/* Logo */}
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_var(--primary-color)]">
      <span className="font-bold text-primary-foreground text-lg">黒</span>
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-base text-foreground">KURO-ROKU</span>
      <span className="text-[10px] text-muted-foreground tracking-wide">
        FILE ORGANIZER
      </span>
    </div>
  </div>

  <div className="h-8 w-px bg-border-subtle" />

  {/* Tab Navigation */}
  <nav className="flex bg-secondary-background p-1 rounded-lg border border-border-subtle">
    {TABS.map((tab) => (
      <Button
        variant="ghost"
        className={
          activeTab === tab.id ? "bg-secondary-background-selected" : ""
        }
      >
        {tab.label}
      </Button>
    ))}
  </nav>
</div>
```

**Center: Search (absolutely positioned)**

```tsx
<div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[420px] hidden lg:block">
  <SearchInput placeholder="Search library... (Cmd+K)" icon={<Search />} />
</div>
```

**Right: Actions**

```tsx
<div className="flex items-center gap-4">
  <Button variant="secondary" icon={<Filter />}>
    Filter
  </Button>
  <Button variant="primary" onClick={selectDirectory}>
    <ArrowUpRight /> Scan
  </Button>
  <div className="h-6 w-px bg-border-subtle" />
  <Button variant="icon">
    <Settings />
  </Button>
  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-violet-400" />
</div>
```

---

## Sidebar Component

### Visual Design

- Width: 256px (`w-64`)
- Padding: `pt-4 pb-6 pl-4 pr-2`
- Background: Transparent (inherits from page)

### Sections

Each section is collapsible with this pattern:

```tsx
function SidebarSection({ title, children, action }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2">
      <div
        className="group flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-secondary-background-hover rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ChevronRight className={isOpen ? "rotate-90" : ""} />
          <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
            {title}
          </span>
        </div>
        {action}
      </div>
      {isOpen && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}
```

**Sections:**

1. **QUICK ACCESS** - Pinned folders, frequently accessed
2. **SOURCES** - Scanned directories (from `currentPath` in store)
3. **SMART VIEWS** - Recently Added, Unindexed, Needs Review
4. **TAGS** - Tag list with counts, expandable

### NavItem Component

```tsx
function NavItem({ icon: Icon, label, active, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ml-2
        ${
          active
            ? "bg-secondary-background-selected text-foreground ring-1 ring-border-subtle"
            : "text-muted-foreground hover:bg-secondary-background-hover hover:text-foreground"
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={active ? "text-primary" : "text-muted-foreground"} />
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-[10px] font-mono">{count}</span>
      )}
    </div>
  );
}
```

---

## Content Component

### Visual Design

- Flex: 1 (takes remaining space)
- Background: `bg-elevated-background/50`
- Border: `border border-border-subtle rounded-2xl`
- Margin: `mx-2 my-2`
- Shadow: `shadow-xl`

### Toolbar

Height: 56px (`h-14`), contains:

**Left: Breadcrumbs**

```tsx
<div className="flex items-center text-sm">
  <div className="p-1.5 bg-secondary-background rounded-md mr-3">
    <Home size={14} />
  </div>
  <span className="text-muted-foreground">Library</span>
  <span className="mx-2 text-border-subtle">/</span>
  <div className="flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
    <span className="font-medium">{currentFolder}</span>
    <ChevronDown size={12} />
  </div>
</div>
```

**Right: View Mode Toggle**

```tsx
<div className="flex bg-secondary-background p-1 rounded-lg border border-border-subtle">
  <button
    className={viewMode === "grid" ? "bg-secondary-background-selected" : ""}
  >
    <Grid size={16} />
  </button>
  <button
    className={viewMode === "list" ? "bg-secondary-background-selected" : ""}
  >
    <List size={16} />
  </button>
  <button
    className={viewMode === "treemap" ? "bg-secondary-background-selected" : ""}
  >
    <LayoutDashboard size={16} />
  </button>
</div>
```

### Content Area

**Grid View (default)**

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
  {files.map((file) => (
    <FileCard file={file} />
  ))}
</div>
```

**List View**

```tsx
<div className="space-y-2">
  {files.map((file) => (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border-subtle">
      <FileIcon />
      <span className="flex-1 text-sm font-medium">{file.name}</span>
      <span className="text-xs text-muted-foreground">{file.size}</span>
      <Badge>{file.type}</Badge>
    </div>
  ))}
</div>
```

**TreeMap View** (WizTree-style, future)

- Full-width visualization of storage
- Color-coded by file type
- Click-to-zoom functionality

### FileCard Component

```tsx
function FileCard({ file, selected, onClick }) {
  const bgColors = {
    video: "bg-violet-500/20",
    image: "bg-azure-500/20",
    audio: "bg-jade-500/20",
    document: "bg-gold-500/20",
    other: "bg-kuro-400",
  };

  return (
    <Card onClick={onClick} selected={selected} className="group flex flex-col">
      {/* Thumbnail area */}
      <div
        className={`relative aspect-video ${bgColors[file.type]} flex items-center justify-center`}
      >
        <FileVideo size={32} className="text-foreground/20" />

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-10 h-10 rounded-full bg-secondary-background/50 backdrop-blur-md">
            <Play size={16} />
          </div>
        </div>

        {/* Extension badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-kuro-800/80">
          <span className="text-[10px] font-mono uppercase">
            {file.extension}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="p-4">
        <h3 className="text-sm font-medium truncate group-hover:text-primary">
          {file.name}
        </h3>
        <span className="text-[10px] text-muted-foreground">{file.size}</span>
        <Badge variant="neutral" className="mt-3">
          {file.type}
        </Badge>
      </div>
    </Card>
  );
}
```

### States

**Empty State** (no folder selected)

```tsx
<div className="flex-1 flex items-center justify-center text-muted-foreground">
  <div className="text-center">
    <FileVideo size={48} className="mx-auto mb-4 opacity-30" />
    <p className="text-lg font-medium">No folder selected</p>
    <p className="text-sm">Click "Scan" to add a folder</p>
  </div>
</div>
```

**Loading State**

```tsx
<div className="flex-1 flex items-center justify-center">
  <Loader2 size={48} className="animate-spin text-primary" />
  <p className="text-lg font-medium">Scanning...</p>
</div>
```

**Error State**

```tsx
<div className="flex-1 flex items-center justify-center text-error">
  <AlertCircle size={48} />
  <p className="text-lg font-medium">Scan failed</p>
  <p className="text-sm">{errorMessage}</p>
</div>
```

---

## Details Panel Component

### Visual Design

- Width: 320px (`w-80`)
- Padding: `pt-4 pb-6 pl-2 pr-4`
- Content: `bg-elevated-background/50 backdrop-blur-xl border border-border-subtle rounded-2xl`

### Sections

**Header**

```tsx
<div className="p-4 border-b border-border-subtle">
  <h2 className="text-xs font-mono text-muted-foreground tracking-widest">
    PROPERTIES
  </h2>
</div>
```

**Preview**

```tsx
<div className="p-4">
  <div
    className={`aspect-video rounded-lg ${bgColors[file.type]} flex items-center justify-center`}
  >
    <FileVideo size={40} className="text-foreground/20" />
  </div>
</div>
```

**Title + Badges**

```tsx
<div>
  <h3 className="text-base font-semibold text-foreground">{file.name}</h3>
  <div className="flex gap-2 mt-2">
    <Badge>{file.type}</Badge>
    <span className="px-1.5 py-0.5 text-[10px] font-mono border border-border-subtle uppercase">
      {file.extension}
    </span>
  </div>
</div>
```

**Metadata Grid**

```tsx
<div className="space-y-3 bg-secondary-background p-3 rounded-lg">
  <MetaRow icon={HardDrive} label="Size" value={formatSize(file.size)} />
  <MetaRow icon={Clock} label="Modified" value={file.modified} />
  <MetaRow icon={FolderOpen} label="Path" value={file.path} />
</div>
```

**Analysis Status**

```tsx
<div>
  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3">
    Analysis Status
  </h4>
  <div className="bg-secondary-background border border-border-subtle rounded-xl px-4 py-1">
    <AnalysisItem label="VLM Indexing" status="pending" />
    <AnalysisItem label="Audio Transcribe" status="pending" />
    <AnalysisItem label="Vector Embed" status="pending" />
  </div>
</div>
```

Status icons:

- `done`: `<CheckCircle2 className="text-jade-400" />`
- `pending`: `<Circle className="text-muted-foreground/30" />`
- `processing`: Spinning border animation

**Tags**

```tsx
<div>
  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3">
    Tags
  </h4>
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
        #{tag}
      </span>
    ))}
    <button className="text-xs text-muted-foreground border border-dashed border-border-default px-2 py-1 rounded-md">
      + Add Tag
    </button>
  </div>
</div>
```

**Footer Action**

```tsx
<div className="p-4 border-t border-border-subtle bg-secondary-background/50">
  <Button variant="secondary" className="w-full justify-between">
    <span>Add to Queue</span>
    <Maximize2 size={14} />
  </Button>
</div>
```

**Empty State** (no file selected)

```tsx
<div className="flex-1 flex items-center justify-center">
  <FileVideo className="w-12 h-12 mb-4 opacity-20" />
  <p className="text-sm text-muted-foreground">Select a file to view details</p>
</div>
```

---

## State Management

### App Store (`src/stores/appStore.ts`)

```typescript
interface AppState {
  // Navigation
  activeTab: AppTab; // 'library' | 'staging' | 'monitor' | 'workbench'
  setActiveTab: (tab: AppTab) => void;

  // Library view mode
  viewMode: ViewMode; // 'grid' | 'list' | 'treemap'
  setViewMode: (mode: ViewMode) => void;

  // Current path and files
  currentPath: string | null;
  files: ScannedFile[];
  isScanning: boolean;
  scanError: string | null;

  // Selection
  selectedFile: ScannedFile | null;
  setSelectedFile: (file: ScannedFile | null) => void;

  // Actions
  selectDirectory: () => Promise<void>; // Opens folder picker
  scanDirectory: (path: string) => Promise<void>; // Scans and populates files
}
```

---

## Interactions

| Action                  | Result                                            |
| ----------------------- | ------------------------------------------------- |
| Click "Scan" button     | Opens folder picker dialog, scans selected folder |
| Click file card         | Selects file, populates details panel             |
| Click view mode toggle  | Switches between grid/list/treemap                |
| Click sidebar nav item  | Filters files by that category                    |
| Click "Add to Queue"    | Adds selected file to staging queue               |
| Hover file card         | Shows play button overlay                         |
| Collapse/expand section | Toggles sidebar section visibility                |

---

## Responsive Behavior

| Breakpoint  | Changes                                       |
| ----------- | --------------------------------------------- |
| `lg` and up | Full 3-column layout, centered search visible |
| `md`        | Grid reduces to 3 columns                     |
| Below `md`  | Grid reduces to 2 columns                     |
| Mobile      | Consider hiding sidebar, details as overlays  |

---

## File Type Colors

| Type     | Background         | Purpose            |
| -------- | ------------------ | ------------------ |
| video    | `bg-violet-500/20` | Videos, animations |
| image    | `bg-azure-500/20`  | Images, photos     |
| audio    | `bg-jade-500/20`   | Music, sounds      |
| document | `bg-gold-500/20`   | PDFs, docs, text   |
| other    | `bg-kuro-400`      | Unknown types      |

---

## Design Tokens Used

See `docs/STYLING_GUIDE.md` for complete token reference.

Key tokens for Library page:

- `text-foreground`, `text-muted-foreground`
- `bg-elevated-background`, `bg-secondary-background`
- `border-border-subtle`, `border-primary`
- `text-primary`, `bg-primary`
