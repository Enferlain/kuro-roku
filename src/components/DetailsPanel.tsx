// Details panel - shows selected file information

import { FileVideo, FileImage, FileAudio, FileText, File, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useFileStore, FileType } from "@/stores/fileStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(type: FileType) {
  switch (type) {
    case "video":
      return FileVideo;
    case "image":
      return FileImage;
    case "audio":
      return FileAudio;
    case "document":
      return FileText;
    default:
      return File;
  }
}

interface StatusRowProps {
  label: string;
  status: "done" | "pending" | "processing";
}

function StatusRow({ label, status }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      {status === "done" && <CheckCircle size={16} className="text-green-500" />}
      {status === "pending" && <Clock size={16} className="text-muted-foreground" />}
      {status === "processing" && <Loader2 size={16} className="text-primary animate-spin" />}
    </div>
  );
}

export function DetailsPanel() {
  const { selectedFile } = useFileStore();

  if (!selectedFile) {
    return (
      <aside className="w-72 border-l border-border bg-card p-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          Select a file to view details
        </p>
      </aside>
    );
  }

  const Icon = getFileIcon(selectedFile.file_type);

  return (
    <aside className="w-72 border-l border-border bg-card flex flex-col">
      {/* Preview area */}
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Icon size={48} className="text-muted-foreground" />
      </div>

      {/* File info */}
      <div className="p-4 space-y-4 flex-1 overflow-auto">
        <div>
          <h2 className="font-semibold truncate" title={selectedFile.file_name}>
            {selectedFile.file_name}
          </h2>
          <p className="text-xs text-muted-foreground font-mono truncate mt-1">
            {selectedFile.path}
          </p>
        </div>

        <Separator />

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Size</span>
            <span>{formatFileSize(selectedFile.file_size)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Type</span>
            <span className="uppercase">{selectedFile.file_type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Extension</span>
            <span>.{selectedFile.file_extension}</span>
          </div>
        </div>

        <Separator />

        {/* Analysis Status (placeholder for future) */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Analysis Status
          </h3>
          <div className="space-y-2">
            <StatusRow label="VLM" status="pending" />
            <StatusRow label="Audio" status="pending" />
            <StatusRow label="Embed" status="pending" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full">
          Open Full Details
        </Button>
      </div>
    </aside>
  );
}
