import React, { useMemo, useState, useEffect } from 'react';
import { Video } from '../../types';
import { ChevronRight, ChevronDown, Folder, FileVideo, HardDrive } from 'lucide-react';

// --- Helpers ---
const parseSize = (str: string) => {
  const units: { [key: string]: number } = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 };
  const match = str.match(/([\d.]+)([A-Z]+)/);
  if (!match) return 0;
  return parseFloat(match[1]) * (units[match[2] as keyof typeof units] || 1);
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [260, 240, 220, 190, 320];
  const hueIndex = Math.abs(hash) % hues.length;
  const hue = hues[hueIndex];
  const sat = 60 + (Math.abs(hash >> 8) % 20); 
  const light = 40 + (Math.abs(hash >> 16) % 15);
  return `hsl(${hue}, ${sat}%, ${light}%)`;
};

// --- Tree Logic ---
interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'file';
  sizeBytes: number;
  dateModified: string;
  children: TreeNode[];
  video?: Video;
  percentage: number;
}

const buildFileTree = (videos: Video[]): TreeNode => {
  const root: TreeNode = {
    id: 'root',
    name: '[Library Root]',
    path: '/',
    type: 'folder',
    sizeBytes: 0,
    dateModified: '-',
    children: [],
    percentage: 100,
  };

  videos.forEach(video => {
    // Remove leading slash and split
    const parts = video.path.replace(/^\//, '').split('/');
    let currentLevel = root;

    // Traverse/Build Folders
    parts.forEach((part, index) => {
      if (!part) return;
      let existingPath = currentLevel.children.find(c => c.name === part && c.type === 'folder');
      if (!existingPath) {
        existingPath = {
          id: `${currentLevel.id}-${part}`,
          name: part,
          path: currentLevel.path === '/' ? `/${part}` : `${currentLevel.path}/${part}`,
          type: 'folder',
          sizeBytes: 0,
          dateModified: video.dateAdded, // Approximation
          children: [],
          percentage: 0,
        };
        currentLevel.children.push(existingPath);
      }
      currentLevel = existingPath;
    });

    // Add File
    const size = parseSize(video.size);
    currentLevel.children.push({
      id: video.id,
      name: video.title,
      path: video.path,
      type: 'file',
      sizeBytes: size,
      dateModified: video.dateAdded,
      children: [],
      video: video,
      percentage: 0,
    });
  });

  // Calculate Sizes Recursively
  const calculateSize = (node: TreeNode): number => {
    if (node.type === 'file') return node.sizeBytes;
    const total = node.children.reduce((acc, child) => acc + calculateSize(child), 0);
    node.sizeBytes = total;
    // Sort children by size descending
    node.children.sort((a, b) => b.sizeBytes - a.sizeBytes);
    return total;
  };
  calculateSize(root);

  // Calculate Percentages
  const calculatePercentages = (node: TreeNode) => {
    if (node.children.length > 0) {
      node.children.forEach(child => {
        child.percentage = node.sizeBytes > 0 ? (child.sizeBytes / node.sizeBytes) * 100 : 0;
        calculatePercentages(child);
      });
    }
  };
  calculatePercentages(root);

  return root;
};

// --- Squarified Treemap Logic (Reused) ---
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  item: Video & { sizeBytes: number };
}

const getTiling = (items: (Video & { sizeBytes: number })[], width: number, height: number): Rect[] => {
  if (items.length === 0 || width === 0 || height === 0) return [];
  const rects: Rect[] = [];
  const totalValue = items.reduce((sum, item) => sum + item.sizeBytes, 0);
  const totalArea = width * height;
  
  // Sort items by size descending for algorithm
  const nodes = items.map(item => ({
    ...item,
    area: (item.sizeBytes / totalValue) * totalArea
  })).sort((a, b) => b.area - a.area);

  let x = 0, y = 0, w = width, h = height;

  const layoutRow = (row: typeof nodes, vertical: boolean) => {
    const rowArea = row.reduce((s, n) => s + n.area, 0);
    const side = vertical ? h : w;
    const thickness = rowArea / side;
    let offset = 0;
    row.forEach(node => {
      const length = node.area / thickness;
      if (vertical) {
        rects.push({ x: x + offset, y, width: length, height: thickness, item: node });
        offset += length;
      } else {
        rects.push({ x, y: y + offset, width: thickness, height: length, item: node });
        offset += length;
      }
    });
    if (vertical) { y += thickness; h -= thickness; } else { x += thickness; w -= thickness; }
  };

  const worstAspectRatio = (row: typeof nodes, length: number) => {
    if (row.length === 0) return Infinity;
    const min = row[row.length - 1].area;
    const max = row[0].area;
    const sum = row.reduce((s, n) => s + n.area, 0);
    return Math.max((length ** 2 * max) / (sum ** 2), (sum ** 2) / (length ** 2 * min));
  };

  let currentRow: typeof nodes = [];
  nodes.forEach(node => {
    const vertical = w > h;
    const side = vertical ? h : w;
    const currentWorst = worstAspectRatio(currentRow, side);
    const nextWorst = worstAspectRatio([...currentRow, node], side);
    if (currentRow.length === 0 || nextWorst <= currentWorst) currentRow.push(node);
    else { layoutRow(currentRow, vertical); currentRow = [node]; }
  });
  if (currentRow.length > 0) layoutRow(currentRow, w > h);
  return rects;
};

// --- Components ---

// 1. Recursive Table Row
const TreeRow: React.FC<{ 
  node: TreeNode; 
  depth: number; 
  onSelect: (v: Video) => void;
  selectedId?: string;
  forceExpand?: boolean;
}> = ({ node, depth, onSelect, selectedId, forceExpand }) => {
  const [expanded, setExpanded] = useState(depth < 1); // Expand first level by default

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    if (node.type === 'file' && node.video) {
      onSelect(node.video);
    } else {
      setExpanded(!expanded);
    }
  };

  const isSelected = node.type === 'file' && node.video?.id === selectedId;

  return (
    <>
      <div 
        className={`flex items-center h-8 hover:bg-white/[0.04] text-xs transition-colors cursor-pointer border-b border-white/[0.02] ${isSelected ? 'bg-accent/20 hover:bg-accent/30' : ''}`}
        onClick={handleSelect}
      >
        {/* Name Column (Tree) */}
        <div className="flex-1 flex items-center min-w-[200px] pl-2 overflow-hidden">
          <div style={{ width: depth * 20 }} className="shrink-0" />
          <button 
            onClick={handleToggle}
            className={`mr-1 p-0.5 rounded hover:bg-white/10 ${node.children.length === 0 ? 'opacity-0 cursor-default' : ''}`}
          >
            {expanded ? <ChevronDown size={12} className="text-foreground-muted" /> : <ChevronRight size={12} className="text-foreground-muted" />}
          </button>
          
          {node.type === 'folder' ? (
            <Folder size={14} className="mr-2 text-accent shrink-0" fill="currentColor" fillOpacity={0.2} />
          ) : (
            <FileVideo size={14} className="mr-2 text-foreground-muted shrink-0" />
          )}
          <span className={`truncate ${node.type === 'folder' ? 'font-medium text-foreground' : 'text-foreground/90'}`}>
            {node.name}
          </span>
        </div>

        {/* % of Parent Column */}
        <div className="w-32 px-4 flex items-center">
          <div className="flex-1 h-3 bg-white/5 rounded-sm overflow-hidden border border-white/10 relative">
            <div 
              className="h-full bg-gradient-to-r from-accent to-purple-400" 
              style={{ width: `${node.percentage}%` }} 
            />
          </div>
          <span className="ml-2 w-8 text-right font-mono text-foreground-muted">{node.percentage.toFixed(0)}%</span>
        </div>

        {/* Size Column */}
        <div className="w-24 px-4 text-right font-mono text-foreground">{formatSize(node.sizeBytes)}</div>

        {/* Allocated (Fake for demo) */}
        <div className="w-24 px-4 text-right font-mono text-foreground-muted hidden md:block">{formatSize(node.sizeBytes * 1.02)}</div>

        {/* Items/Files */}
        <div className="w-20 px-4 text-right font-mono text-foreground-muted hidden md:block">
           {node.type === 'folder' ? node.children.length : ''}
        </div>

        {/* Date Modified */}
        <div className="w-32 px-4 text-right text-foreground-muted truncate hidden lg:block">
          {node.dateModified}
        </div>
      </div>

      {expanded && node.children.map(child => (
        <TreeRow 
          key={child.id} 
          node={child} 
          depth={depth + 1} 
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </>
  );
};

// --- Main TreeMap Component ---
interface TreeMapProps {
  videos: Video[];
  onSelect: (video: Video) => void;
  selectedId?: string;
}

export const TreeMap: React.FC<TreeMapProps> = ({ videos, onSelect, selectedId }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Build hierarchical data
  const rootNode = useMemo(() => buildFileTree(videos), [videos]);
  
  // Build flat list with sizeBytes for visual map
  const flatItems = useMemo(() => 
    videos.map(v => ({ ...v, sizeBytes: parseSize(v.size) })), 
  [videos]);

  // Calculate Visual Layout
  const rects = useMemo(() => {
    // We assume a fixed coordinate system for calculation, then scale with CSS %
    return getTiling(flatItems, 1000, 300); 
  }, [flatItems]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* 1. Tree Table (Top 70%) */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center h-8 bg-black/20 backdrop-blur-sm border-b border-white/5 text-xs font-medium text-foreground-subtle uppercase tracking-wider sticky top-0 z-10">
          <div className="flex-1 pl-10">Folder</div>
          <div className="w-32 px-4">% of Parent</div>
          <div className="w-24 px-4 text-right">Size</div>
          <div className="w-24 px-4 text-right hidden md:block">Allocated</div>
          <div className="w-20 px-4 text-right hidden md:block">Items</div>
          <div className="w-32 px-4 text-right hidden lg:block">Modified</div>
        </div>
        
        {/* Scrollable Tree Rows */}
        <div className="flex-1 overflow-y-auto custom-scrollbar select-none">
          {rootNode.children.map(child => (
            <TreeRow 
              key={child.id} 
              node={child} 
              depth={0} 
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      </div>

      {/* Resizer Handle (Visual only) */}
      <div className="h-1 bg-white/5 border-y border-white/5 cursor-row-resize hover:bg-accent/20 transition-colors" />

      {/* 2. Visual Treemap Strip (Bottom 30%) */}
      <div className="h-[30%] min-h-[150px] relative bg-black/40 overflow-hidden">
        {rects.map((rect) => {
          const isHovered = hoveredId === rect.item.id;
          const isSelected = selectedId === rect.item.id;
          
          // Color by path
          const baseColor = stringToColor(rect.item.path.split('/').slice(0, 3).join('/'));

          return (
            <div
              key={rect.item.id}
              onClick={() => onSelect(rect.item)}
              onMouseEnter={() => setHoveredId(rect.item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute border border-black/20 transition-all duration-150 ease-out cursor-pointer overflow-hidden flex flex-col p-1"
              style={{
                left: `${(rect.x / 1000) * 100}%`,
                top: `${(rect.y / 300) * 100}%`,
                width: `${(rect.width / 1000) * 100}%`,
                height: `${(rect.height / 300) * 100}%`,
                backgroundColor: baseColor,
                opacity: isHovered ? 1 : isSelected ? 1 : 0.85,
                zIndex: isHovered ? 20 : isSelected ? 10 : 1,
                boxShadow: isHovered || isSelected ? 'inset 0 0 0 1px white' : 'none',
                filter: isHovered ? 'brightness(1.15)' : 'brightness(1.0)',
              }}
              title={`${rect.item.title} (${rect.item.size})`}
            >
              {(rect.width / 1000 > 0.03 && rect.height / 300 > 0.1) && (
                <span className="text-white/90 text-[10px] font-medium truncate leading-none drop-shadow-md">
                  {rect.item.title}
                </span>
              )}
            </div>
          );
        })}
        {rects.length === 0 && (
          <div className="flex items-center justify-center h-full text-foreground-muted text-sm">
            Visual map empty
          </div>
        )}
      </div>

    </div>
  );
};