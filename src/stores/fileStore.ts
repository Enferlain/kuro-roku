// File store - state management for file browsing

import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";

export type FileType = "video" | "image" | "audio" | "document" | "other";
export type ViewState = "library" | "manifest" | "queue" | "analytics";

export interface ScannedFile {
  path: string;
  file_name: string;
  file_extension: string;
  file_type: FileType;
  file_size: number;
  created_at: string;
  modified_at: string;
}

interface FileStore {
  // View state
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;

  // Current path
  currentPath: string | null;
  setCurrentPath: (path: string | null) => void;

  // File list
  files: ScannedFile[];
  isScanning: boolean;
  scanError: string | null;

  // Selected file (for details panel)
  selectedFile: ScannedFile | null;
  setSelectedFile: (file: ScannedFile | null) => void;

  // Actions
  selectDirectory: () => Promise<void>;
  scanDirectory: (path: string) => Promise<void>;
}

export const useFileStore = create<FileStore>((set, get) => ({
  currentView: "library",
  setCurrentView: (view) => set({ currentView: view }),

  currentPath: null,
  setCurrentPath: (path) => set({ currentPath: path }),

  files: [],
  isScanning: false,
  scanError: null,

  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),

  selectDirectory: async () => {
    try {
      const path = await invoke<string | null>("select_directory");
      if (path) {
        set({ currentPath: path });
        get().scanDirectory(path);
      }
    } catch (error) {
      console.error("Failed to select directory:", error);
    }
  },

  scanDirectory: async (path: string) => {
    set({ isScanning: true, scanError: null });
    try {
      const files = await invoke<ScannedFile[]>("scan_directory", { path });
      set({ files, isScanning: false });
    } catch (error) {
      set({
        scanError: error instanceof Error ? error.message : String(error),
        isScanning: false,
      });
    }
  },
}));
