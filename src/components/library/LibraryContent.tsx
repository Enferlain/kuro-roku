// LibraryContent - Main content area with file grid/list/treemap
// Uses semantic tokens from design-system.css

import {
  Grid,
  List,
  LayoutDashboard,
  Home,
  ChevronDown,
  Play,
  MoreVertical,
  FileVideo,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Card, Badge } from "@/components/ui/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewMode, ScannedFile } from "@/types";

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
  onClick: () => void;
}) {
  // Using file type colors from design system
  const bgColors: Record<string, string> = {
    video: "bg-violet-500/20",
    image: "bg-azure-500/20",
    audio: "bg-jade-500/20",
    document: "bg-gold-500/20",
    other: "bg-kuro-400",
  };

  return (
    <Card onClick={onClick} selected={selected} className="group flex flex-col">
      {/* Thumbnail */}
      <div
        className={`relative aspect-video ${bgColors[file.file_type] || bgColors.other} flex items-center justify-center overflow-hidden`}
      >
        <FileVideo size={32} className="text-foreground/20" />

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-secondary-background/50 backdrop-blur-md flex items-center justify-center border border-border-subtle hover:scale-110 transition-transform">
            <Play size={16} className="ml-0.5 text-foreground fill-foreground" />
          </div>
        </div>

        {/* Extension badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-kuro-800/80 backdrop-blur-md border border-border-subtle">
          <span className="text-[10px] font-mono text-foreground/90 uppercase">
            {file.file_extension}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors"
              title={file.file_name}
            >
              {file.file_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-muted-foreground">
                {formatFileSize(file.file_size)}
              </span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="flex gap-1 mt-3">
          <Badge variant="neutral">{file.file_type}</Badge>
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
    <div className="flex bg-secondary-background p-1 rounded-lg border border-border-subtle">
      {modes.map(({ mode, icon: Icon, title }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === mode
              ? "bg-secondary-background-selected text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary-background-hover"
          }`}
          title={title}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}

export function LibraryContent() {
  const { files, isScanning, scanError, currentPath, selectedFile, setSelectedFile, viewMode } =
    useAppStore();

  // Empty state
  if (!currentPath) {
    return (
      <main className="flex-1 flex flex-col bg-elevated-background/50 border border-border-subtle rounded-2xl shadow-xl overflow-hidden mx-2 my-2">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <FileVideo size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No folder selected</p>
            <p className="text-sm">Click "Scan" to add a folder</p>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isScanning) {
    return (
      <main className="flex-1 flex flex-col bg-elevated-background/50 border border-border-subtle rounded-2xl shadow-xl overflow-hidden mx-2 my-2">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto mb-4 animate-spin text-primary" />
            <p className="text-lg font-medium">Scanning...</p>
            <p className="text-sm text-muted-foreground">{currentPath}</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (scanError) {
    return (
      <main className="flex-1 flex flex-col bg-elevated-background/50 border border-border-subtle rounded-2xl shadow-xl overflow-hidden mx-2 my-2">
        <div className="flex-1 flex items-center justify-center text-error">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p className="text-lg font-medium">Scan failed</p>
            <p className="text-sm">{scanError}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-elevated-background/50 border border-border-subtle rounded-2xl shadow-xl overflow-hidden mx-2 my-2">
      {/* Toolbar */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-border-subtle bg-secondary-background/30 shrink-0">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm">
          <div className="p-1.5 bg-secondary-background rounded-md mr-3 text-muted-foreground">
            <Home size={14} />
          </div>
          <span className="text-muted-foreground">Library</span>
          <span className="mx-2 text-border-subtle">/</span>
          <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
            <span className="font-medium truncate max-w-[200px]">
              {currentPath.split("\\").pop()}
            </span>
            <ChevronDown size={12} />
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mr-2">
            {files.length} files
          </span>
          <ViewModeToggle />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {viewMode === "treemap" ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              TreeMap view coming soon
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedFile?.path === file.path
                      ? "border-primary bg-primary/10"
                      : "border-border-subtle hover:border-border-default hover:bg-secondary-background-hover"
                  }`}
                >
                  <FileVideo size={20} className="text-muted-foreground" />
                  <span className="flex-1 text-sm font-medium truncate">{file.file_name}</span>
                  <span className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</span>
                  <Badge variant="neutral">{file.file_type}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {files.map((file) => (
                <FileCard
                  key={file.path}
                  file={file}
                  selected={selectedFile?.path === file.path}
                  onClick={() => setSelectedFile(file)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
}
