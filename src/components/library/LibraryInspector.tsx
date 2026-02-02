import {
  FileVideo,
  Clock,
  FolderOpen,
  CheckCircle2,
  Loader2,
  MoreHorizontal,
  Play,
  Plus,
  Layers,
  ChevronRight,
  Activity,
  Zap,
  MousePointer2,
  X,
  Cpu,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Button, Badge } from "@/components/ui/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// --- Reusable Collapsible Section ---
const DetailSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  action,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-glass-border-low/50 last:border-0 hover-section">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-glass-low select-none group transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              isOpen ? "rotate-90" : ""
            )}
          >
            <ChevronRight size={12} />
          </div>
          <div className="flex items-center gap-2">
            {Icon && <Icon size={14} className="text-muted-foreground" />}
            <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase font-medium group-hover:text-foreground-hover transition-colors">
              {title}
            </span>
          </div>
        </div>
        {action && (
          <div onClick={(e) => e.stopPropagation()}>{action}</div>
        )}
      </div>

      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-1 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

function AnalysisRow({
  label,
  status,
}: {
  label: string;
  status: "done" | "pending" | "processing" | "idle";
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-glass-border-low/30 last:border-0 group">
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {status === "done" && (
          <CheckCircle2 size={14} className="text-jade-400" />
        )}
        {status === "pending" && (
          <div className="w-3.5 h-3.5 rounded-full border border-glass-border-low" />
        )}
        {status === "processing" && (
          <Loader2 size={14} className="animate-spin text-primary" />
        )}
        {status === "idle" && (
          <span className="text-[10px] text-muted-foreground/30 font-mono">IDLE</span>
        )}
      </div>
    </div>
  );
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <span>{label}</span>
      </div>
      <span
        className="font-mono text-foreground truncate max-w-[150px]"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

const EmptySelectionState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-xl bg-linear-to-b from-glass-low to-transparent border border-glass-border-low group relative overflow-hidden mt-2">
    <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="w-16 h-16 rounded-2xl bg-glass-low border border-glass-border-low flex items-center justify-center mb-4 shadow-inner relative z-10 group-hover:scale-105 transition-transform duration-300">
      <MousePointer2 className="w-6 h-6 text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors" />
    </div>
    <div className="relative z-10">
      <p className="text-sm font-medium text-foreground">No Selection</p>
      <p className="text-[10px] text-secondary-foreground mt-1.5 leading-relaxed max-w-[200px] mx-auto">
        Select an item from the library grid to view detailed properties and
        analysis data.
      </p>
    </div>
  </div>
);

const MultiFileView = ({
  files,
  deselectAll,
}: {
  files: any[];
  deselectAll: () => void;
}) => {
  const totalSize = files.reduce((acc, f) => acc + f.file_size, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center py-6 text-center bg-glass-low border border-glass-border-low rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={deselectAll}
            className="h-6 w-6 opacity-30 hover:opacity-100"
          >
            <X size={12} />
          </Button>
        </div>
        <Layers size={32} className="text-primary mb-2 opacity-50" />
        <h3 className="text-lg font-medium text-foreground">
          {files.length} Items
        </h3>
        <p className="text-xs text-secondary-foreground font-mono">
          {formatFileSize(totalSize)} Total
        </p>
      </div>

      <div className="bg-glass-low border border-glass-border-low rounded-xl overflow-hidden max-h-[200px] overflow-y-auto custom-scrollbar">
        {files.map((file) => (
          <div
            key={file.path}
            className="flex items-center justify-between p-2 border-b border-glass-border-low last:border-0 hover:bg-glass-low"
          >
            <span className="text-xs text-secondary-foreground truncate pl-1">
              {file.file_name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground pr-1">
              {formatFileSize(file.file_size)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SingleFileView = ({ file }: { file: any }) => {
  const bgColors: Record<string, string> = {
    video: "bg-violet-500/10",
    image: "bg-azure-500/10",
    audio: "bg-jade-500/10",
    document: "bg-gold-500/10",
    other: "bg-zinc-500/10",
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        className={cn(
          "group relative aspect-video w-full rounded-lg overflow-hidden border border-glass-border-low flex items-center justify-center cursor-pointer transition-all duration-500 hover:border-glass-border-mid",
          bgColors[file.file_type]
        )}
      >
        <FileVideo
          size={32}
          className="text-foreground/10 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-glass-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-glass-high backdrop-blur-md flex items-center justify-center border border-glass-border-mid hover:scale-110 transition-transform shadow-lg">
            <Play size={16} className="ml-0.5 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="px-1">
        <h3 className="text-base font-semibold text-foreground leading-snug mb-2 wrap-break-word">
          {file.file_name}
        </h3>
        <div className="flex gap-2">
          <Badge variant="neutral" className="text-xs px-2.5 py-1 rounded-md">
            {file.file_type}
          </Badge>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-secondary-foreground border border-glass-border-mid uppercase bg-glass-mid">
            {file.file_extension}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-glass-low p-3 rounded-lg border border-glass-border-low space-y-1">
        <MetaRow label="Size" value={formatFileSize(file.file_size)} />
        <MetaRow label="Modified" value={new Date(file.modified_at).toLocaleDateString()} />
        <MetaRow label="Path" value={file.path} />
      </div>

      {/* Tags */}
      <div className="px-1">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
          Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 hover:bg-primary/20 hover:border-primary/30 cursor-pointer transition-all font-medium">
            cinematic
          </span>
          <span className="text-xs text-muted-foreground bg-glass-mid px-2.5 py-1 rounded border border-glass-border-mid hover:text-foreground hover:bg-glass-high cursor-pointer transition-all font-medium">
            raw
          </span>
          <button className="text-xs text-secondary-foreground border border-dashed border-glass-border-mid px-2 py-1 rounded hover:border-glass-border-mid hover:text-foreground-hover transition-colors">
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export function LibraryInspector() {
  const { files, selectedFileIds, deselectAll } = useAppStore();
  const selectedFiles = files.filter((f) => selectedFileIds.includes(f.path));
  const hasSelection = selectedFiles.length > 0;
  const isMulti = selectedFiles.length > 1;
  const singleFile = isMulti ? null : selectedFiles[0];

  return (
    <div className="w-full flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-glass-border-low bg-transparent shrink-0">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary opacity-70" />
          <h2 className="text-xs font-mono text-muted-foreground tracking-widest uppercase font-medium">
            Inspector
          </h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-foreground">
          <MoreHorizontal size={14} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {/* Properties Section */}
          <DetailSection
            title={isMulti ? "Batch Properties" : "Properties"}
            icon={Layers}
            defaultOpen={true}
          >
            {!hasSelection && <EmptySelectionState />}
            {hasSelection && isMulti && (
              <MultiFileView files={selectedFiles} deselectAll={deselectAll} />
            )}
            {hasSelection && !isMulti && singleFile && (
              <SingleFileView file={singleFile} />
            )}
          </DetailSection>

          {/* Analysis Status */}
          <DetailSection title="Analysis Status" icon={Cpu} defaultOpen={true}>
            <div className="bg-glass-low border border-glass-border-low rounded-xl px-4 py-1">
              {hasSelection && !isMulti && singleFile ? (
                <>
                  <AnalysisRow
                    label="VLM Indexing"
                    status={singleFile.file_type === "video" ? "done" : "pending"}
                  />
                  <AnalysisRow
                    label="Audio Transcribe"
                    status={
                      singleFile.file_type === "video" ? "processing" : "pending"
                    }
                  />
                  <AnalysisRow label="Vector Mapping" status="pending" />
                </>
              ) : (
                <>
                  <div className="py-2 border-b border-glass-border-low">
                    <div className="flex justify-between text-xs text-muted-foreground/60 mb-2">
                      <span>Queue Capacity</span>
                      <span className="font-mono text-[10px] opacity-40">IDLE</span>
                    </div>
                    <div className="h-1 w-full bg-glass-low rounded-full overflow-hidden">
                      <div className="h-full w-[0%] bg-primary rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                  <div className="py-2 text-[10px] text-muted-foreground/20 text-center italic">
                    Select a file to view specific status
                  </div>
                </>
              )}
            </div>
          </DetailSection>

          {/* Target Queue */}
          <DetailSection
            title="Target Queue"
            icon={Zap}
            defaultOpen={true}
            action={
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-mono text-primary font-bold">
                  ACTIVE
                </span>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-glass-dark border border-glass-border-low space-y-2">
                <div className="flex justify-between items-center text-xs text-secondary-foreground">
                  <span>Dest:</span>
                  <span className="font-mono text-foreground truncate ml-2">
                    /Staging/Workspace_01
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-secondary-foreground">
                  <span>Preset:</span>
                  <span className="font-mono text-foreground">Standard VLM</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="default"
                  className="w-full h-10 text-[11px] font-bold tracking-tight shadow-primary-glow hover:shadow-primary/40 transition-all rounded-lg gap-2"
                  disabled={!hasSelection}
                >
                  <Plus size={16} />
                  {hasSelection
                    ? `Add ${selectedFiles.length} item${
                        selectedFiles.length > 1 ? "s" : ""
                      } to queue`
                    : "Add selection to queue"}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    className="h-9 text-[10px] font-bold tracking-tight rounded-lg gap-1.5"
                    disabled={!hasSelection}
                  >
                    <FolderOpen size={14} />
                    Open folder
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-9 text-[10px] font-bold tracking-tight rounded-lg gap-1.5"
                  >
                    <Clock size={14} />
                    View history
                  </Button>
                </div>
              </div>
            </div>
          </DetailSection>
        </div>
      </ScrollArea>
    </div>
  );
}
