import React, { useMemo, useState } from 'react';
import { ScannedFile } from '@/types';
import { ChevronRight, ChevronDown, Folder, FileVideo } from 'lucide-react';

// --- Helpers ---
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
  const sat = 50 + (Math.abs(hash >> 8) % 20); 
  const light = 30 + (Math.abs(hash >> 16) % 15);
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
  file?: ScannedFile;
  percentage: number;
}

const buildFileTree = (files: ScannedFile[]): TreeNode => {
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

  files.forEach(file => {
    // Remove leading slash and split
    const parts = file.path.replace(/^\//, '').split(/[\\/]/);
    let currentLevel = root;

    // Traverse/Build Folders
    parts.forEach((part, index) => {
      if (!part || index === parts.length - 1) return;
      let existingPath = currentLevel.children.find(c => c.name === part && c.type === 'folder');
      if (!existingPath) {
        existingPath = {
          id: `${currentLevel.id}-${part}`,
          name: part,
          path: currentLevel.path === '/' ? `/${part}` : `${currentLevel.path}/${part}`,
          type: 'folder',
          sizeBytes: 0,
          dateModified: file.modified_at,
          children: [],
          percentage: 0,
        };
        currentLevel.children.push(existingPath);
      }
      currentLevel = existingPath;
    });

    // Add File
    currentLevel.children.push({
      id: file.path,
      name: file.file_name,
      path: file.path,
      type: 'file',
      sizeBytes: file.file_size,
      dateModified: file.modified_at,
      children: [],
      file: file,
      percentage: 0,
    });
  });

  // Calculate Sizes Recursively
  const calculateSize = (node: TreeNode): number => {
    if (node.type === 'file') return node.sizeBytes;
    const total = node.children.reduce((acc, child) => acc + calculateSize(child), 0);
    node.sizeBytes = total;
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

// --- Squarified Treemap Logic ---
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  item: ScannedFile;
}

const getTiling = (items: ScannedFile[], width: number, height: number): Rect[] => {
  if (items.length === 0 || width === 0 || height === 0) return [];
  const rects: Rect[] = [];
  const totalValue = items.reduce((sum, item) => sum + item.file_size, 0);
  const totalArea = width * height;
  
  const nodes = items.map(item => ({
    ...item,
    area: (item.file_size / totalValue) * totalArea
  })).sort((a, b) => b.area - a.area);

  let x = 0, y = 0, w = width, h = height;

  const layoutRow = (row: any[], vertical: boolean) => {
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

  const worstAspectRatio = (row: any[], length: number) => {
    if (row.length === 0) return Infinity;
    const min = row[row.length - 1].area;
    const max = row[0].area;
    const sum = row.reduce((s, n) => s + n.area, 0);
    return Math.max((length ** 2 * max) / (sum ** 2), (sum ** 2) / (length ** 2 * min));
  };

  let currentRow: any[] = [];
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

const TreeRow: React.FC<{ 
  node: TreeNode; 
  depth: number; 
  onSelect: (path: string, isMulti: boolean) => void;
  selectedIds: string[];
}> = ({ node, depth, onSelect, selectedIds }) => {
  const [expanded, setExpanded] = useState(depth < 1);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleSelect = (e: React.MouseEvent) => {
    if (node.type === 'file') {
      onSelect(node.path, e.ctrlKey || e.metaKey);
    } else {
      setExpanded(!expanded);
    }
  };

  const isSelected = selectedIds.includes(node.path);

  return (
    <>
      <div 
        className={`flex items-center h-8 hover:bg-white/4 text-[11px] transition-colors cursor-pointer border-b border-white/2 ${isSelected ? 'bg-primary/10 hover:bg-primary/20' : ''}`}
        onClick={handleSelect}
      >
        <div className="flex-1 flex items-center min-w-[200px] pl-2 overflow-hidden">
          <div style={{ width: depth * 16 }} className="shrink-0" />
          <button 
            onClick={handleToggle}
            className={`mr-1 p-0.5 rounded hover:bg-white/10 ${node.children.length === 0 ? 'opacity-0 cursor-default' : ''}`}
          >
            {expanded ? <ChevronDown size={11} className="text-muted-foreground" /> : <ChevronRight size={11} className="text-muted-foreground" />}
          </button>
          
          {node.type === 'folder' ? (
            <Folder size={12} className="mr-2 text-primary shrink-0 opacity-60" fill="currentColor" fillOpacity={0.1} />
          ) : (
            <FileVideo size={12} className="mr-2 text-muted-foreground shrink-0 opacity-60" />
          )}
          <span className={`truncate ${node.type === 'folder' ? 'font-bold text-foreground/80' : 'text-foreground/90'}`}>
            {node.name}
          </span>
        </div>

        <div className="w-24 px-4 flex items-center shrink-0">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-primary/40 shadow-[0_0_8px_rgba(139,92,246,0.3)]" 
              style={{ width: `${node.percentage}%` }} 
            />
          </div>
          <span className="ml-2 w-7 text-right font-mono text-[9px] text-muted-foreground">{Math.round(node.percentage)}%</span>
        </div>

        <div className="w-20 px-4 text-right font-mono text-[10px] text-foreground/70 shrink-0">{formatSize(node.sizeBytes)}</div>
        <div className="w-24 px-4 text-right text-muted-foreground opacity-40 truncate hidden lg:block shrink-0">
          {new Date(node.dateModified).toLocaleDateString()}
        </div>
      </div>

      {expanded && node.children.map(child => (
        <TreeRow 
          key={child.id} 
          node={child} 
          depth={depth + 1} 
          onSelect={onSelect}
          selectedIds={selectedIds}
        />
      ))}
    </>
  );
};

export const TreeMap: React.FC<{
  files: ScannedFile[];
  onSelect: (path: string, isMulti: boolean) => void;
  selectedIds: string[];
}> = ({ files, onSelect, selectedIds }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rootNode = useMemo(() => buildFileTree(files), [files]);
  const rects = useMemo(() => getTiling(files, 1000, 300), [files]);

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center h-7 bg-black/40 backdrop-blur-md border-b border-white/5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest sticky top-0 z-10 px-2">
          <div className="flex-1 pl-8">Structure</div>
          <div className="w-24 px-4">Usage</div>
          <div className="w-20 px-4 text-right">Size</div>
          <div className="w-24 px-4 text-right hidden lg:block">Modified</div>
        </div>
        
        <div className="flex-1 overflow-y-auto select-none custom-scrollbar">
          {rootNode.children.map(child => (
            <TreeRow 
              key={child.id} 
              node={child} 
              depth={0} 
              onSelect={onSelect}
              selectedIds={selectedIds}
            />
          ))}
        </div>
      </div>

      <div className="h-1 bg-white/5 border-y border-white/5 cursor-row-resize hover:bg-primary/20 transition-colors" />

      <div className="h-[25%] min-h-[120px] relative bg-black/60 overflow-hidden shadow-inner">
        {rects.map((rect) => {
          const isHovered = hoveredId === rect.item.path;
          const isSelected = selectedIds.includes(rect.item.path);
          const baseColor = stringToColor(rect.item.path.split(/[\\/]/).slice(0, 3).join('/'));

          return (
            <div
              key={rect.item.path}
              onClick={(e) => onSelect(rect.item.path, e.ctrlKey || e.metaKey)}
              onMouseEnter={() => setHoveredId(rect.item.path)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute border border-black/40 transition-all duration-300 ease-out cursor-pointer overflow-hidden flex flex-col p-1.5"
              style={{
                left: `${(rect.x / 1000) * 100}%`,
                top: `${(rect.y / 300) * 100}%`,
                width: `${(rect.width / 1000) * 100}%`,
                height: `${(rect.height / 300) * 100}%`,
                backgroundColor: baseColor,
                opacity: isHovered ? 1 : isSelected ? 1 : 0.6,
                zIndex: isHovered ? 20 : isSelected ? 10 : 1,
                boxShadow: isHovered || isSelected ? 'inset 0 0 0 1px rgba(255,255,255,0.4), 0 0 20px rgba(0,0,0,0.5)' : 'none',
                filter: isHovered ? 'brightness(1.2) saturate(1.2)' : 'brightness(1.0)',
              }}
              title={`${rect.item.file_name} (${formatSize(rect.item.file_size)})`}
            >
              {(rect.width / 1000 > 0.05 && rect.height / 300 > 0.15) && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-white font-bold text-[9px] truncate leading-none drop-shadow-lg uppercase tracking-tighter">
                    {rect.item.file_name}
                  </span>
                  <span className="text-white/40 text-[8px] font-mono leading-none truncate">
                    {formatSize(rect.item.file_size)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
