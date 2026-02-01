// LibraryContent - Main content area with file grid/list/treemap
// Uses semantic tokens from design-system.css

import {
  Grid,
  List,
  LayoutDashboard,
  Home,
  ChevronDown,
  MoreVertical,
  FileVideo,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  MinusSquare,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Card, Badge } from "@/components/ui/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewMode, ScannedFile } from "@/types";
import { TreeMap } from "./TreeMap";
// CSS Module - will be used in subsequent tasks
// @ts-expect-error - CSS module imported for future use
import styles from "./LibraryContent.module.css";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function FileCard({
  file,
  selected,
  onClick,
}: {
  file: ScannedFile;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <Card 
      onClick={onClick} 
      selected={selected} 
      className={`group flex flex-col relative overflow-hidden transition-all duration-300 border-white/5 ${selected ? 'ring-1 ring-primary shadow-[0_0_20px_rgba(139,92,246,0.1)] bg-primary/5' : 'hover:bg-white/4'}`}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-black/40 flex items-center justify-center border-b border-white/5">
        {/* Type Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-all duration-700">
           <FileVideo size={36} className="text-primary/40 group-hover:scale-110" />
        </div>
        
        {/* Selection Dot */}
        {selected && (
          <div className="absolute top-3 left-3 w-4 h-4 bg-primary rounded shadow-[0_0_10px_rgba(139,92,246,0.5)] flex items-center justify-center animate-in zoom-in-50">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        )}

        {/* Extension badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 shadow-lg border border-white/10 uppercase text-[9px] font-mono font-bold text-white/40">
          {file.file_extension}
        </div>
      </div>

      {/* Meta Area */}
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="text-[12px] font-bold text-foreground/90 truncate tracking-tight group-hover:text-primary transition-colors leading-none">
          {file.file_name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-50">
            <span className="text-[9px] font-mono font-bold tracking-tighter">{formatFileSize(file.file_size)}</span>
            <span className="text-[9px]">•</span>
            <span className="text-[9px] font-mono font-bold tracking-tighter">{new Date(file.modified_at).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-1">
             <Badge variant="neutral" className="text-[8px] uppercase tracking-tighter h-3.5 px-1 py-0 border-white/5 bg-white/5 text-muted-foreground font-bold">
               {file.file_type}
             </Badge>
             {file.file_size > 1024 * 1024 * 1024 && (
               <Badge variant="warning" className="text-[8px] uppercase tracking-tighter h-3.5 px-1 py-0 font-bold">LARGE</Badge>
             )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ViewModeToggle() {
  const { viewMode, setViewMode } = useAppStore();

  const modes: { mode: ViewMode; icon: React.ElementType; title: string }[] = [
    { mode: "grid", icon: Grid, title: "Grid View" },
    { mode: "list", icon: List, title: "List View" },
    { mode: "treemap", icon: LayoutDashboard, title: "TreeMap View" },
  ];

  return (
    <div className="flex bg-white/3 p-0.5 rounded-lg border border-white/5 shadow-sm">
      {modes.map(({ mode, icon: Icon, title }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            viewMode === mode
              ? "bg-white/8 text-foreground shadow-sm ring-1 ring-white/5"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
          title={title}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

function SelectAllButton() {
  const { files, selectedFileIds, selectAll, deselectAll } = useAppStore();
  
  const allSelected = files.length > 0 && selectedFileIds.length === files.length;
  const someSelected = selectedFileIds.length > 0 && !allSelected;
  
  const handleClick = () => {
    if (allSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  };
  
  const Icon = allSelected ? CheckSquare : someSelected ? MinusSquare : Square;
  
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 active:scale-[0.98] transition-all text-xs font-semibold text-foreground/80 hover:text-foreground shadow-sm"
      title={allSelected ? "Deselect All" : "Select All"}
    >
      <Icon size={13} className={allSelected || someSelected ? "text-primary" : "text-muted-foreground"} />
      <span>{allSelected ? "Deselect All" : "Select All"}</span>
    </button>
  );
}

export function LibraryContent() {
  const { 
    files, 
    isScanning, 
    scanError, 
    currentPath, 
    selectedFileIds, 
    toggleSelection, 
    viewMode,
    activeSidebarItem,
    setActiveSidebarItem
  } = useAppStore();

  if (!currentPath) {
    return (
      <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
        <div className="flex-1 flex items-center justify-center text-muted-foreground/30">
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-white/3 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl backdrop-blur-xl">
              <FileVideo size={40} className="opacity-20" />
            </div>
            <p className="text-xl font-bold text-foreground/80 mb-2">No library source</p>
            <p className="text-sm text-muted-foreground max-w-[200px] mx-auto opacity-60">Add a source folder from the sidebar to start browsing</p>
          </div>
        </div>
      </main>
    );
  }

  if (isScanning) {
    return (
      <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <Loader2 size={48} className="relative animate-spin text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground">Analyzing Index...</p>
            <p className="text-sm text-muted-foreground mt-2 font-mono opacity-60 truncate max-w-md mx-auto">{currentPath}</p>
          </div>
        </div>
      </main>
    );
  }

  if (scanError) {
    return (
      <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-2xl">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <p className="text-xl font-bold text-foreground mb-2">Scan failed</p>
            <p className="text-sm text-muted-foreground font-mono leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">{scanError}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
      {/* Toolbar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0 z-20">
        {/* Left section: Breadcrumbs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs">
            <div 
              onClick={() => setActiveSidebarItem("Recent Scans")}
              className="p-1 bg-white/5 rounded-md mr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-white/5 active:scale-95"
            >
              <Home size={12} />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">LIBRARY</span>
            <span className="mx-2 text-[10px] opacity-20 font-light">/</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 text-foreground rounded-lg border border-white/5 hover:bg-white/8 transition-all cursor-pointer group">
              <span className="text-[11px] font-bold uppercase tracking-tight">
                {activeSidebarItem}
              </span>
              <ChevronDown size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="h-5 w-px bg-white/10" />
          
          <SelectAllButton />
          
          {selectedFileIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               <span className="text-xs text-foreground font-bold italic tracking-tight">
                {selectedFileIds.length} SELECTED
              </span>
            </div>
          )}
        </div>

        {/* Right section: View Controls */}
        <div className="flex items-center gap-5">
          <div className="hidden xl:flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
              Count:
            </span>
            <span className="text-xs font-bold text-foreground/80">
              {files.length}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest hidden lg:block">
              Layout
            </span>
            <ViewModeToggle />
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-8">
          {viewMode === "treemap" ? (
            <TreeMap 
              files={files} 
              onSelect={toggleSelection} 
              selectedIds={selectedFileIds} 
            />
          ) : viewMode === "list" ? (
            <div className="space-y-1.5">
              {files.map((file) => (
                <div
                  key={file.path}
                  onClick={(e) => {
                    const isMultiSelect = e.ctrlKey || e.metaKey;
                    toggleSelection(file.path, isMultiSelect);
                  }}
                  className={`group flex items-center gap-4 px-5 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedFileIds.includes(file.path)
                      ? "border-primary/40 bg-primary/5 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
                      : "border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5 bg-black/20 group-hover:bg-primary/10 transition-colors`}>
                    <FileVideo size={16} className={`text-muted-foreground group-hover:text-primary transition-colors ${selectedFileIds.includes(file.path) ? "text-primary" : ""}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-foreground/90 truncate block group-hover:text-primary transition-colors">{file.file_name}</span>
                    <div className="flex items-center gap-2 mt-0.5 opacity-40">
                      <span className="text-[10px] font-mono">{formatFileSize(file.file_size)}</span>
                      <span className="text-[10px]">•</span>
                      <span className="text-[10px] uppercase font-bold tracking-tighter">{file.file_extension}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-medium text-muted-foreground mr-4 hidden sm:block">{new Date(file.modified_at).toLocaleDateString()}</span>
                    <Badge variant="neutral" className="text-[9px] uppercase tracking-wider h-5 px-1.5">{file.file_type}</Badge>
                    <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {files.map((file) => (
                <FileCard
                  key={file.path}
                  file={file}
                  selected={selectedFileIds.includes(file.path)}
                  onClick={(e) => {
                    const isMultiSelect = e.ctrlKey || e.metaKey;
                    toggleSelection(file.path, isMultiSelect);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
}
