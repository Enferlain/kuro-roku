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
  Folder,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Card, Badge, Button } from "@/components/ui/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewMode, ScannedFile } from "@/types";
import { TreeMap } from "./TreeMap";
import { cn } from "@/lib/utils";

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
      className={cn(
        "group flex flex-col relative overflow-hidden transition-all duration-300 border-glass-border-low",
        selected ? 'ring-1 ring-primary shadow-primary-glow bg-primary/5' : 'hover:bg-glass-low'
      )}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-glass-dark flex items-center justify-center border-b border-glass-border-low">
        {/* Type Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-all duration-700">
           {file.file_type === 'directory' ? (
             <Folder size={36} className="text-primary/40 group-hover:scale-110" />
           ) : (
             <FileVideo size={36} className="text-primary/40 group-hover:scale-110" />
           )}
        </div>
        
        {/* Selection Dot */}
        {selected && (
          <div className="absolute top-3 left-3 w-4 h-4 bg-primary rounded shadow-[0_0_10px_rgba(139,92,246,0.5)] flex items-center justify-center animate-in zoom-in-50">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        )}

        {/* Extension badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-glass-dark shadow-lg border border-glass-border-low uppercase text-[9px] font-mono font-bold text-muted-foreground/40">
          {file.file_extension}
        </div>
      </div>

      {/* Meta Area */}
      <div className="p-4 pt-3 flex flex-col gap-0.5">
        <h3 className={cn(
          "text-sm truncate group-hover:text-primary transition-colors",
          file.file_type === 'directory' ? "font-bold text-foreground-hover" : "font-normal text-foreground/80"
        )} title={file.file_name}>
          {file.file_name}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-secondary-foreground font-medium">
          <span>{formatFileSize(file.file_size)}</span>
          {file.file_type === "video" && (
             <>
               <span>•</span>
               <span className="font-mono uppercase">{file.file_extension}</span>
             </>
          )}
        </div>
        <div className="mt-3">
          <Badge variant="neutral" className="text-[9px] h-4 px-1.5 py-0 font-medium rounded-sm bg-glass-mid border-glass-border-low text-secondary-foreground">
            {file.file_type}
          </Badge>
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
    <div className="flex bg-glass-low p-0.5 rounded-lg border border-glass-border-low shadow-sm">
      {modes.map(({ mode, icon: Icon, title }) => (
        <Button
          key={mode}
          onClick={() => setViewMode(mode)}
          variant={viewMode === mode ? "secondary" : "ghost"}
          size="icon-xs"
          className={cn(
            "p-1.5 rounded-md transition-all duration-200",
            viewMode === mode
              ? "bg-glass-high text-foreground-hover shadow-sm ring-1 ring-glass-border-low"
              : "text-muted-foreground hover:text-foreground-hover"
          )}
          title={title}
        >
          <Icon size={14} />
        </Button>
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
    <Button
      onClick={handleClick}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 h-8 px-3 rounded-lg border border-glass-border-low bg-glass-low hover:bg-glass-mid hover:border-glass-border-mid active:scale-[0.98] transition-all text-xs font-bold text-foreground/80 hover:text-foreground-hover shadow-sm uppercase tracking-tight"
      title={allSelected ? "Deselect All" : "Select All"}
    >
      <Icon size={13} className={cn(allSelected || someSelected ? "text-primary" : "text-muted-foreground")} />
      <span>{allSelected ? "Deselect All" : "Select All"}</span>
    </Button>
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
    setActiveSidebarItem
  } = useAppStore();

  if (!currentPath) {
    return (
      <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
        <div className="flex-1 flex items-center justify-center text-muted-foreground/30">
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-glass-low rounded-3xl flex items-center justify-center mx-auto mb-6 border border-glass-border-low shadow-2xl backdrop-blur-xl">
              <FileVideo size={40} className="opacity-20" />
            </div>
            <p className="text-xl font-bold text-foreground/60 mb-2">No library source</p>
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
            <p className="text-sm text-muted-foreground font-mono leading-relaxed bg-glass-dark p-3 rounded-lg border border-glass-border-low">{scanError}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 h-full flex flex-col bg-transparent overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-glass-border-low bg-glass-low shrink-0 z-20">
        {/* Left section: Breadcrumbs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm">
            <div 
              onClick={() => setActiveSidebarItem("Recent Scans")}
              className="p-1.5 bg-glass-mid rounded-md mr-3 text-secondary-foreground hover:text-foreground-hover transition-all cursor-pointer border border-glass-border-low"
            >
              <Home size={14} />
            </div>
            <span className="text-muted-foreground hover:text-foreground-hover transition-colors cursor-pointer font-medium">Library</span>
            <span className="mx-2 text-muted-foreground/20">/</span>
            <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 text-primary-hover rounded-md border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors shadow-sm">
              <span className="font-bold tracking-tight">Recent scans</span>
              <ChevronDown size={12} />
            </div>
          </div>
          
          <div className="h-5 w-px bg-glass-border-mid" />
          
          <SelectAllButton />
          
          {selectedFileIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
               <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-primary-glow" />
               <span className="text-[10px] text-primary font-bold tracking-widest uppercase">
                {selectedFileIds.length} SELECTED
              </span>
            </div>
          )}
        </div>

        {/* Right section: View Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground/80">
              {files.length}
            </span>
          </div>
          <div className="h-4 w-px bg-glass-border-mid" />
          <div className="flex items-center gap-2">
            <ViewModeToggle />
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "treemap" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <TreeMap 
            files={files} 
            onSelect={toggleSelection} 
            selectedIds={selectedFileIds} 
          />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-6">
            {viewMode === "list" ? (
              <div className="space-y-1.5">
                {files.map((file) => (
                  <div
                    key={file.path}
                    onClick={(e) => {
                      const isMultiSelect = e.ctrlKey || e.metaKey;
                      toggleSelection(file.path, isMultiSelect);
                    }}
                    className={cn(
                      "group flex items-center gap-4 px-5 py-3 rounded-xl border transition-all duration-200 cursor-pointer active:scale-[0.99]",
                      selectedFileIds.includes(file.path)
                        ? "border-primary/40 bg-primary/5 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
                        : "border-glass-border-low bg-glass-low hover:bg-glass-mid hover:border-glass-border-mid"
                    )}
                  >
                    <div className={cn(
                      selectedFileIds.includes(file.path) ? "bg-primary/20 border-primary/30" : ""
                    )}>
                      {file.file_type === 'directory' ? (
                        <Folder size={16} className={cn(
                          "text-muted-foreground group-hover:text-primary transition-colors",
                          selectedFileIds.includes(file.path) ? "text-primary" : ""
                        )} />
                      ) : (
                        <FileVideo size={16} className={cn(
                          "text-muted-foreground group-hover:text-primary transition-colors",
                          selectedFileIds.includes(file.path) ? "text-primary" : ""
                        )} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "text-sm truncate block group-hover:text-primary transition-colors",
                        file.file_type === 'directory' ? "font-bold text-foreground-hover" : "font-normal text-foreground/80"
                      )}>{file.file_name}</span>
                      <div className="flex items-center gap-2 mt-0.5 opacity-40 font-medium tracking-tight">
                        <span className="text-[10px] font-mono">{formatFileSize(file.file_size)}</span>
                        <span className="text-[10px]">•</span>
                        <span className="text-[10px] uppercase font-bold">{file.file_extension}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-medium text-muted-foreground mr-4 hidden sm:block tracking-tight">{new Date(file.modified_at).toLocaleDateString()}</span>
                      <Badge variant="neutral" className="text-[10px] h-5 px-1.5 font-medium rounded-sm">{file.file_type}</Badge>
                      <button className="text-secondary-foreground hover:text-foreground-hover p-1 transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {files.map((file) => (
                  <div key={file.path} className="active:scale-[0.98] transition-transform duration-200">
                    <FileCard
                      file={file}
                      selected={selectedFileIds.includes(file.path)}
                      onClick={(e) => {
                        const isMultiSelect = e.ctrlKey || e.metaKey;
                        toggleSelection(file.path, isMultiSelect);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </main>
  );
}
