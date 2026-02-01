// LibraryDetails - Right panel showing file properties
// Uses semantic tokens from design-system.css

import {
  FileVideo,
  HardDrive,
  Clock,
  FolderOpen,
  CheckCircle2,
  Loader2,
  Share2,
  MoreHorizontal,
  Play,
  Hash,
  Plus,
  Layers,
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
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${
          status === "done" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : 
          status === "processing" ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.4)]" : 
          "bg-white/10 ring-1 ring-white/5"
        }`} />
        <span className="text-[11px] font-bold text-foreground/80 group-hover:text-foreground transition-colors tracking-tight uppercase">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {status === "done" && (
          <div className="flex items-center gap-1.5 text-emerald-400">
             <span className="text-[9px] font-mono font-bold tracking-tighter">DONE</span>
             <CheckCircle2 size={11} strokeWidth={3} />
          </div>
        )}
        {status === "pending" && (
          <div className="flex items-center gap-1.5 text-muted-foreground/20">
             <span className="text-[9px] font-mono tracking-tighter">WAITING</span>
          </div>
        )}
        {status === "processing" && (
          <div className="flex items-center gap-1.5 text-primary">
             <span className="text-[9px] font-mono font-bold tracking-tighter">BUSY</span>
             <Loader2 size={11} className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] group/row py-0.5">
      <div className="flex items-center gap-2 text-muted-foreground/60 group-hover/row:text-muted-foreground transition-colors">
        <Icon size={13} />
        <span className="font-medium">{label}</span>
      </div>
      <span className="font-mono font-bold text-foreground/80 truncate max-w-[140px] tracking-tight" title={value}>
        {value}
      </span>
    </div>
  );
}

export function LibraryDetails() {
  const { selectedFile } = useAppStore();

  if (!selectedFile) {
    return (
      <div className="w-full flex flex-col h-full bg-transparent overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/20 px-6 text-center">
          <Layers size={40} className="mb-4 opacity-10" />
          <p className="text-xs font-bold tracking-widest uppercase opacity-40">Select items</p>
          <p className="text-[10px] max-w-[140px] opacity-20 mt-2">Properties and analysis status will appear here</p>
        </div>
      </div>
    );
  }

  const bgColors: Record<string, string> = {
    video: "bg-violet-500/10",
    image: "bg-blue-500/10",
    audio: "bg-emerald-500/10",
    document: "bg-amber-500/10",
    other: "bg-zinc-500/10",
  };

  return (
    <div className="w-full flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-5 border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0">
        <h2 className="text-[10px] font-mono font-bold text-muted-foreground/60 tracking-[0.2em] uppercase">
          Properties
        </h2>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/5 rounded-md text-muted-foreground/40 hover:text-foreground transition-colors">
            <Share2 size={13} />
          </button>
          <button className="p-1.5 hover:bg-white/5 rounded-md text-muted-foreground/40 hover:text-foreground transition-colors">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-7">
          {/* Preview */}
          <div className="relative">
            <div
              className={`group relative aspect-video w-full rounded-xl overflow-hidden border border-white/5 ${bgColors[selectedFile.file_type]} flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-500 hover:border-white/20`}
            >
              <FileVideo size={48} className="text-foreground/10 group-hover:scale-110 transition-transform duration-700" />
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl scale-90 group-hover:scale-100 transition-all duration-300">
                  <Play size={18} className="ml-1 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-foreground leading-tight tracking-tight break-all">
              {selectedFile.file_name}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral" className="text-[9px] uppercase tracking-wider h-4.5 px-1.5 font-bold">{selectedFile.file_type}</Badge>
              <div className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono font-bold text-muted-foreground/60 border border-white/5 uppercase tracking-tighter">
                {selectedFile.file_extension}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Metadata Section */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-[0.15em] px-1">
              Technical info
            </h4>
            <div className="space-y-3 bg-white/3 p-3 rounded-lg border border-white/4">
              <MetaRow icon={HardDrive} label="Size" value={formatFileSize(selectedFile.file_size)} />
              <MetaRow icon={Clock} label="Modified" value={new Date(selectedFile.modified_at).toLocaleDateString()} />
              <div className="pt-1 mt-1 border-t border-white/5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
                    <FolderOpen size={13} />
                    <span className="font-medium">File Path</span>
                  </div>
                  <div className="p-2.5 bg-black/20 rounded-lg border border-white/5 group hover:border-white/10 transition-colors cursor-pointer">
                    <span className="text-[10px] font-mono text-muted-foreground/40 break-all leading-relaxed group-hover:text-muted-foreground/70" title={selectedFile.path}>
                      {selectedFile.path}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Status */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-[0.15em] px-1">
              Analysis pipeline
            </h4>
            <div className="bg-white/2 border border-white/4 rounded-xl px-4 py-1 shadow-inner">
              <AnalysisItem label="Vision Indexing" status={selectedFile?.file_type === 'video' ? 'done' : 'pending'} />
              <AnalysisItem label="Audio Transcribe" status={selectedFile?.file_type === 'video' ? 'processing' : 'pending'} />
              <AnalysisItem label="Vector Mapping" status="pending" />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4 pb-4">
            <h4 className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-[0.15em] px-1">
              Assigned tags
            </h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/10 cursor-pointer transition-all shadow-sm">
                <Hash size={10} strokeWidth={3} />
                <span>CINEMATIC</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:text-foreground hover:bg-white/8 cursor-pointer transition-all shadow-sm">
                <Hash size={10} />
                <span>4K_RAW</span>
              </div>
              <button className="w-8 h-8 rounded-full border border-dashed border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/30 transition-all active:scale-90">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-5 border-t border-white/5 bg-black/20 shrink-0 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-50" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground/30 uppercase tracking-widest">Target Queue</span>
            <span className="text-[10px] font-mono font-bold text-primary flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               ACTIVE
            </span>
          </div>
          <Button 
            variant="primary" 
            className="w-full h-11 text-xs font-bold tracking-widest uppercase shadow-[0_0_25px_-5px_var(--primary-color)] hover:shadow-primary/40 transition-all rounded-xl gap-2"
          >
            <Plus size={16} /> Add to Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
