import React, { useState } from 'react';
import { 
  Folder, 
  Film, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Hash,
  Cloud,
  Loader2,
  ChevronRight,
  ChevronDown,
  Plus,
  Search
} from 'lucide-react';
import { Badge } from '../UI/Components';

// --- Collapsible Section Component ---
const SidebarSection = ({ 
  title, 
  children, 
  defaultOpen = true, 
  action 
}: { 
  title: string, 
  children: React.ReactNode, 
  defaultOpen?: boolean,
  action?: React.ReactNode 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <div 
        className="group flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-white/[0.04] rounded-lg transition-colors select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
           <div className={`text-foreground-muted/50 group-hover:text-foreground-muted transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
             <ChevronRight size={12} />
           </div>
           <span className="text-xs font-mono text-foreground-subtle tracking-widest opacity-80 group-hover:opacity-100 font-medium">
             {title}
           </span>
        </div>
        {action && (
          <div onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity">
            {action}
          </div>
        )}
      </div>
      
      {isOpen && (
        <div className="mt-1 space-y-0.5 animate-in slide-in-from-top-1 fade-in duration-200 origin-top">
          {children}
        </div>
      )}
    </div>
  );
};

// --- Mock Data for Scalability Demo ---
const MOCK_TAGS = [
  { label: 'cooking', count: 45 },
  { label: 'tutorial', count: 30 },
  { label: 'outdoor', count: 12 },
  { label: '4k_footage', count: 8 },
  { label: 'b-roll', count: 156 },
  { label: 'interview', count: 23 },
  { label: 'drone', count: 42 },
  { label: 'color_graded', count: 89 },
  { label: 'raw', count: 201 },
  { label: 'archive', count: 1205 },
];

export const Sidebar: React.FC = () => {
  const [showAllTags, setShowAllTags] = useState(false);

  const NavItem = ({ icon: Icon, label, active = false, count }: { icon: any, label: string, active?: boolean, count?: number }) => (
    <div className={`
      flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200 ml-2
      ${active ? 'bg-white/[0.08] text-foreground shadow-sm ring-1 ring-white/5' : 'text-foreground-muted hover:bg-white/[0.04] hover:text-foreground'}
    `}>
      <div className="flex items-center gap-3">
        <Icon size={16} className={active ? 'text-accent' : 'text-foreground-muted group-hover:text-foreground'} />
        <span className="text-sm font-medium truncate max-w-[130px]" title={label}>{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-mono ${active ? 'opacity-100' : 'opacity-40'}`}>{count}</span>
      )}
    </div>
  );

  const displayedTags = showAllTags ? MOCK_TAGS : MOCK_TAGS.slice(0, 5);

  return (
    <aside className="w-64 flex flex-col h-full pt-4 pb-6 pl-4 pr-2">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mask-linear-fade">
        
        {/* Library Section */}
        <SidebarSection 
          title="LIBRARY" 
          defaultOpen={true}
          action={<Plus size={14} className="text-foreground-muted hover:text-foreground" />}
        >
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground font-medium bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-lg mb-2 ml-2 shadow-[0_0_15px_-5px_rgba(94,106,210,0.3)] cursor-pointer hover:bg-accent/15 transition-colors">
            <Folder size={16} className="text-accent" />
            <span>My Library</span>
          </div>

          <NavItem icon={Film} label="Movies" count={124} />
          <NavItem icon={BookOpen} label="Tutorials" active count={4} />
          <NavItem icon={Film} label="Footage" count={892} />
          <NavItem icon={Folder} label="Sound FX" count={230} />
          <NavItem icon={Folder} label="Music" count={45} />
        </SidebarSection>

        {/* Smart Views Section */}
        <SidebarSection title="SMART VIEWS">
          <NavItem icon={Clock} label="Recent" />
          <NavItem icon={AlertTriangle} label="Needs Review" count={2} />
          <NavItem icon={Sparkles} label="New Manifest" count={5} />
        </SidebarSection>

        {/* Tags Section (Scalable) */}
        <SidebarSection 
          title="TAGS" 
          defaultOpen={true}
          action={<Search size={12} className="text-foreground-muted hover:text-foreground" />}
        >
          {displayedTags.map(tag => (
            <NavItem 
              key={tag.label} 
              icon={Hash} 
              label={tag.label} 
              count={tag.count} 
            />
          ))}
          
          {/* Show More Toggle */}
          <div 
            className="flex items-center gap-2 px-3 py-1.5 ml-2 mt-1 cursor-pointer group"
            onClick={() => setShowAllTags(!showAllTags)}
          >
             <span className="text-xs text-foreground-muted group-hover:text-accent transition-colors font-medium">
               {showAllTags ? 'Show less' : `Show ${MOCK_TAGS.length - 5} more...`}
             </span>
          </div>
        </SidebarSection>

      </div>
      
      {/* Storage & Status - Integrated into bottom of sidebar */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] pr-2 space-y-4 shrink-0">
        
        {/* Active Process Indicator */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <Loader2 size={12} className="animate-spin text-accent" />
              <span>Processing</span>
            </div>
            <span className="text-[10px] font-mono text-foreground-muted">1/4</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[25%] bg-accent rounded-full animate-pulse-slow" />
          </div>
          <div className="mt-2 text-[10px] text-foreground-muted truncate">
            Analyzing: Japan_Trip_Raw_003.mov
          </div>
        </div>

        {/* Cloud Storage */}
        <div className="flex items-center gap-3 px-2 pb-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-foreground-muted border border-white/5">
            <Cloud size={16} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-foreground-muted mb-1">
              <span>Cloud Storage</span>
              <span>78%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[78%] bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};