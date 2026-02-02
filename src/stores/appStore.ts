// App store - global application state

import { create } from "zustand";
import { AppTab, ViewMode, ScannedFile } from "@/types";
import { invoke } from "@tauri-apps/api/core";

interface AppState {
  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;

  // Library view mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Current path and files
  currentPath: string | null;
  files: ScannedFile[];
  isScanning: boolean;
  scanError: string | null;

  // Selection
  selectedFileIds: string[];
  toggleSelection: (id: string, isMulti: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;
  getSelectedFiles: () => ScannedFile[];

  // Actions
  selectDirectory: () => Promise<void>;
  scanDirectory: (path: string) => Promise<void>;
  resetToMock: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activeTab: "library",
  setActiveTab: (tab) => set({ activeTab: tab }),
  activeSidebarItem: "Recent Scans",
  setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),

  // View mode
  viewMode: "grid",
  setViewMode: (mode) => set({ viewMode: mode }),

  // Files
  currentPath: null,
  files: [],
  isScanning: false,
  scanError: null,

  // Selection
  selectedFileIds: [],
  toggleSelection: (id, isMulti) => {
    const { selectedFileIds } = get();
    if (isMulti) {
      if (selectedFileIds.includes(id)) {
        set({
          selectedFileIds: selectedFileIds.filter((fid) => fid !== id),
        });
      } else {
        set({ selectedFileIds: [...selectedFileIds, id] });
      }
    } else {
      set({ selectedFileIds: [id] });
    }
  },
  selectAll: () => set({ selectedFileIds: get().files.map((f) => f.path) }),
  deselectAll: () => set({ selectedFileIds: [] }),
  getSelectedFiles: () => {
    const { files, selectedFileIds } = get();
    return files.filter((f) => selectedFileIds.includes(f.path));
  },

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
    set({ isScanning: true, scanError: null, selectedFileIds: [] });
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

  resetToMock: () => {
    // Basic mock implementation for UI development
    set({
      currentPath: "D:\\Videos\\Cooking",
      files: [
        {
          path: "Nested_Folder",
          file_name: "Nested Folder",
          file_extension: "",
          file_type: "directory",
          file_size: 0,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
        {
          path: "tutorial_introduction.mp4",
          file_name: "tutorial_introduction.mp4",
          file_extension: "mp4",
          file_type: "video",
          file_size: 1024 * 1024 * 850,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          modified_at: new Date(Date.now() - 86400000).toISOString(),
        } as ScannedFile,
        {
          path: "ingredient_prep_01.mp4",
          file_name: "ingredient_prep_01.mp4",
          file_extension: "mp4",
          file_type: "video",
          file_size: 1024 * 1024 * 420,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          modified_at: new Date(Date.now() - 172800000).toISOString(),
        } as ScannedFile,
        {
          path: "thumbnail_final.jpg",
          file_name: "thumbnail_final.jpg",
          file_extension: "jpg",
          file_type: "image",
          file_size: 1024 * 512,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
        {
          path: "recipe_notes.txt",
          file_name: "recipe_notes.txt",
          file_extension: "txt",
          file_type: "other",
          file_size: 1024 * 12,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
        {
          path: "raw_footage_4k.mov",
          file_name: "raw_footage_4k.mov",
          file_extension: "mov",
          file_type: "video",
          file_size: 1024 * 1024 * 1024 * 2.5,
          created_at: new Date(Date.now() - 604800000).toISOString(),
          modified_at: new Date(Date.now() - 604800000).toISOString(),
        } as ScannedFile,
        {
          path: "bg_music_loop.wav",
          file_name: "bg_music_loop.wav",
          file_extension: "wav",
          file_type: "audio",
          file_size: 1024 * 1024 * 45,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
        {
          path: "camera_b_roll.mp4",
          file_name: "camera_b_roll.mp4",
          file_extension: "mp4",
          file_type: "video",
          file_size: 1024 * 1024 * 120,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
        {
          path: "stovetop_shot_02.mp4",
          file_name: "stovetop_shot_02.mp4",
          file_extension: "mp4",
          file_type: "video",
          file_size: 1024 * 1024 * 65,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
        {
          path: "chef_interview.mp4",
          file_name: "chef_interview.mp4",
          file_extension: "mp4",
          file_type: "video",
          file_size: 1024 * 1024 * 1400,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
        {
          path: "color_grade_lut.cube",
          file_name: "color_grade_lut.cube",
          file_extension: "cube",
          file_type: "other",
          file_size: 1024 * 256,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        } as ScannedFile,
      ],
      selectedFileIds: [],
    });
  },
}));
