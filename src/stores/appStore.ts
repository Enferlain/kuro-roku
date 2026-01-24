// App store - global application state

import { create } from "zustand";
import { AppTab, ViewMode, ScannedFile } from "@/types";
import { invoke } from "@tauri-apps/api/core";

interface AppState {
  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Library view mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Current path and files
  currentPath: string | null;
  files: ScannedFile[];
  isScanning: boolean;
  scanError: string | null;

  // Selection
  selectedFile: ScannedFile | null;
  setSelectedFile: (file: ScannedFile | null) => void;

  // Actions
  selectDirectory: () => Promise<void>;
  scanDirectory: (path: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activeTab: "library",
  setActiveTab: (tab) => set({ activeTab: tab }),

  // View mode
  viewMode: "grid",
  setViewMode: (mode) => set({ viewMode: mode }),

  // Files
  currentPath: null,
  files: [],
  isScanning: false,
  scanError: null,

  // Selection
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),

  // Actions
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
