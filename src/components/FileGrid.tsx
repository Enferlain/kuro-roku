// File grid component - displays scanned files as cards

import { FileVideo, FileImage, FileAudio, FileText, File, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useFileStore, ScannedFile, FileType } from "@/stores/fileStore";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function getTypeColor(type: FileType): string {
  // Uses CSS variables defined in index.css for theme support
  switch (type) {
    case "video":
      return "var(--file-video)";
    case "image":
      return "var(--file-image)";
    case "audio":
      return "var(--file-audio)";
    case "document":
      return "var(--file-document)";
    default:
      return "var(--file-other)";
  }
}

interface FileCardProps {
  file: ScannedFile;
  selected: boolean;
  onClick: () => void;
}

function FileCard({ file, selected, onClick }: FileCardProps) {
  const Icon = getFileIcon(file.file_type);
  const typeColor = getTypeColor(file.file_type);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        selected
          ? "border-primary bg-accent"
          : "border-border hover:border-muted-foreground/50 hover:bg-accent/30"
      }`}
    >
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center">
        <Icon size={32} style={{ color: typeColor }} />
      </div>

      {/* File info */}
      <div className="space-y-1">
        <p className="text-sm font-medium truncate" title={file.file_name}>
          {file.file_name}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatFileSize(file.file_size)}</span>
          <span className="uppercase" style={{ color: typeColor }}>{file.file_type}</span>
        </div>
      </div>
    </button>
  );
}

export function FileGrid() {
  const { files, isScanning, scanError, selectedFile, setSelectedFile, currentPath } =
    useFileStore();

  if (!currentPath) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileVideo size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No folder selected</p>
          <p className="text-sm">Use "Scan Folder" to get started</p>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="mx-auto mb-4 animate-spin text-primary" />
          <p className="text-lg font-medium">Scanning...</p>
          <p className="text-sm text-muted-foreground">{currentPath}</p>
        </div>
      </div>
    );
  }

  if (scanError) {
    return (
      <div className="flex-1 flex items-center justify-center text-destructive">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p className="text-lg font-medium">Scan failed</p>
          <p className="text-sm">{scanError}</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No files found</p>
          <p className="text-sm">This folder is empty</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        {/* Path header */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground font-mono truncate">
            {currentPath}
          </p>
          <p className="text-sm text-muted-foreground">
            {files.length} files
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((file) => (
            <FileCard
              key={file.path}
              file={file}
              selected={selectedFile?.path === file.path}
              onClick={() => setSelectedFile(file)}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
