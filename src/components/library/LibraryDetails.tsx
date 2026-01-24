// LibraryDetails - Right panel showing file properties
// Uses semantic tokens from design-system.css

import {
  FileVideo,
  HardDrive,
  Clock,
  FolderOpen,
  CheckCircle2,
  Circle,
  Maximize2,
  Share2,
  Download,
  MoreHorizontal,
  Play,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Button, Badge } from "@/components/ui/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
// CSS Module - will be used in subsequent tasks
// @ts-expect-error - CSS module imported for future use
import styles from "./LibraryDetails.module.css";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function AnalysisItem({
  label,
  status,
}: {
  label: string;
  status: "done" | "pending" | "processing";
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0 group">
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {status === "done" && <CheckCircle2 size={14} className="text-jade-400" />}
        {status === "pending" && <Circle size={14} className="text-muted-foreground/30" />}
        {status === "processing" && (
          <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        )}
      </div>
    </div>
  );
}

export function LibraryDetails() {
  const { selectedFile } = useAppStore();

  if (!selectedFile) {
    return (
      <aside className="w-80 flex flex-col h-full pt-4 pb-6 pl-2 pr-4">
        <div className="flex-1 flex flex-col bg-elevated-background/50 border border-border-subtle rounded-2xl overflow-hidden items-center justify-center">
          <FileVideo className="w-12 h-12 mb-4 opacity-20 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Select a file to view details</p>
        </div>
      </aside>
    );
  }

  // File type colors from design system
  const bgColors: Record<string, string> = {
    video: "bg-violet-500/20",
    image: "bg-azure-500/20",
    audio: "bg-jade-500/20",
    document: "bg-gold-500/20",
    other: "bg-kuro-400",
  };

  return (
    <aside className="w-80 flex flex-col h-full pt-6 pb-6 pl-3 pr-6 shrink-0">
      <div className="flex-1 flex flex-col bg-elevated-background/50 backdrop-blur-xl border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border-subtle">
          <h2 className="text-xs font-mono text-muted-foreground tracking-widest opacity-60">
            PROPERTIES
          </h2>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-secondary-background-hover rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Share2 size={14} />
            </button>
            <button className="p-1.5 hover:bg-secondary-background-hover rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Download size={14} />
            </button>
            <button className="p-1.5 hover:bg-secondary-background-hover rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {/* Preview */}
          <div className="p-4 pb-0">
            <div
              className={`group relative aspect-video w-full rounded-lg overflow-hidden border border-border-subtle ${bgColors[selectedFile.file_type]} flex items-center justify-center cursor-pointer shadow-lg transition-transform duration-500 hover:scale-[1.02]`}
            >
              <FileVideo size={40} className="text-foreground/20" />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-12 h-12 rounded-full bg-secondary-background/50 backdrop-blur-md flex items-center justify-center border border-border-subtle hover:scale-110 transition-transform duration-200">
                  <Play size={18} className="ml-0.5 text-foreground fill-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Title */}
            <div>
              <h3 className="text-base font-semibold text-foreground leading-tight break-words tracking-tight">
                {selectedFile.file_name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="neutral">{selectedFile.file_type}</Badge>
                <div className="px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground border border-border-subtle uppercase">
                  {selectedFile.file_extension}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3 bg-secondary-background p-3 rounded-lg border border-border-subtle">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HardDrive size={14} />
                  <span>Size</span>
                </div>
                <span className="font-mono text-foreground">
                  {formatFileSize(selectedFile.file_size)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={14} />
                  <span>Modified</span>
                </div>
                <span className="font-mono text-foreground text-xs">
                  {new Date(selectedFile.modified_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FolderOpen size={14} />
                  <span>Path</span>
                </div>
                <span
                  className="font-mono text-foreground truncate max-w-[120px] text-xs"
                  title={selectedFile.path}
                >
                  ...{selectedFile.path.split("\\").slice(-2).join("\\")}
                </span>
              </div>
            </div>

            {/* Analysis Status */}
            <div>
              <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3 px-1">
                Analysis Status
              </h4>
              <div className="bg-secondary-background border border-border-subtle rounded-xl px-4 py-1">
                <AnalysisItem label="VLM Indexing" status="pending" />
                <AnalysisItem label="Audio Transcribe" status="pending" />
                <AnalysisItem label="Vector Embed" status="pending" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3 px-1">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {/* Example tags - these will come from IndexedFile.tags in the future */}
                <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 hover:bg-primary/20 hover:border-primary/30 cursor-pointer transition-all">
                  #sample
                </span>
                <button className="text-xs text-muted-foreground bg-transparent border border-dashed border-border-default px-2 py-1 rounded-md hover:text-foreground hover:border-border-strong transition-colors">
                  + Add
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-secondary-background/50">
          <Button variant="secondary" className="w-full justify-between group">
            <span>Add to Queue</span>
            <Maximize2
              size={14}
              className="opacity-50 group-hover:opacity-100 transition-opacity"
            />
          </Button>
        </div>
      </div>
    </aside>
  );
}
