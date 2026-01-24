export interface Video {
  id: string;
  title: string;
  thumbnail: string; // URL
  duration: string;
  size: string;
  path: string;
  status: 'ready' | 'processing' | 'error';
  progress?: number; // For processing status
  tags: string[];
  analysis: {
    vlm: boolean;
    audio: boolean;
    embed: boolean;
  };
  dateAdded: string;
}

export type ViewMode = 'grid' | 'list' | 'treemap';
export type SortMode = 'date' | 'name' | 'size';