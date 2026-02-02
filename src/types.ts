// Global types for the application

export type AppTab = "library" | "staging" | "monitor" | "workbench";

export type ViewMode = "grid" | "list" | "treemap";

export type FileType = "directory" | "video" | "image" | "audio" | "document" | "other";

export type FileStatus = "indexed" | "pending" | "processing" | "error";

export type AnalysisStatus = "done" | "pending" | "processing" | "error";

export interface ScannedFile {
  path: string;
  file_name: string;
  file_extension: string;
  file_type: FileType;
  file_size: number;
  created_at: string;
  modified_at: string;
}

export interface IndexedFile extends ScannedFile {
  id: string;
  content_hash?: string;
  duration_ms?: number;
  indexed_at?: string;
  duplicate_of?: string;
  tags: string[];
  analysis: {
    vlm: AnalysisStatus;
    audio: AnalysisStatus;
    embed: AnalysisStatus;
  };
}

export interface QueueItem {
  id: string;
  file_path: string;
  file_name: string;
  task_type: "vlm" | "transcription" | "embedding";
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  error_message?: string;
}

export interface ManifestAction {
  id: string;
  file_id: string;
  file_name: string;
  action_type: "move" | "tag" | "rename" | "dedupe";
  reason: string;
  confidence: number;
  original_value: string;
  proposed_value: string;
  status: "pending" | "approved" | "rejected";
}
