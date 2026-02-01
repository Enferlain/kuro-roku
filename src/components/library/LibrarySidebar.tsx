import { useState } from "react";
import {
  Film,
  Download,
  Clock,
  Layout,
  Star,
  Hash,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { ScrollArea } from "@/components/ui/scroll-area";

// Collapsible section
function SidebarSection({
  title,
  children,
  defaultOpen = true,
  action,
  icon,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <div
        className="group flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-white/4 rounded-lg transition-colors select-none mb-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div
            className={`text-muted-foreground/30 group-hover:text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          >
            <ChevronRight size={12} />
          </div>
          {icon && <div className="text-muted-foreground/40">{icon}</div>}
          <span className="text-[10px] font-mono text-muted-foreground/50 tracking-[0.15em] uppercase group-hover:text-foreground/80 transition-colors font-medium">
            {title}
          </span>
        </div>
        {action && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
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
}

// Navigation item
function NavItem({
  icon: Icon,
  label,
  active = false,
  count,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200 ml-2
        ${active 
          ? "bg-white/10 text-foreground border border-white/5 shadow-sm" 
          : "text-muted-foreground/60 hover:bg-white/5 hover:text-foreground/90"
        }
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon size={18} className={`${active ? "text-[#8B5CF6]" : "text-muted-foreground/40 group-hover:text-muted-foreground/60"} transition-colors`} />
        <span className={`text-sm font-medium truncate ${active ? "text-foreground" : ""}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={`text-[11px] font-mono ${active ? "text-foreground/40" : "text-muted-foreground/20 group-hover:text-muted-foreground/40"} transition-colors`}>
          {count}
        </span>
      )}
    </div>
  );
}

// Mock data
const MOCK_TAGS = [
  { label: "Cooking", count: 45 },
  { label: "Tutorial", count: 30 },
  { label: "Outdoor", count: 12 },
  { label: "4k_footage", count: 156 },
  { label: "B-roll", count: 8 },
];

export function LibrarySidebar() {
  const { currentPath, resetToMock, activeSidebarItem, setActiveSidebarItem } = useAppStore();

  return (
    <div className="flex flex-col h-full w-full bg-transparent p-4 select-none">
      <ScrollArea className="flex-1">
        <div className="space-y-6">
          {/* Quick Access */}
          <SidebarSection 
            title="Quick Access" 
          >
            <NavItem 
              icon={Download} 
              label="Downloads" 
              count={12} 
              active={activeSidebarItem === "Downloads"}
              onClick={() => setActiveSidebarItem("Downloads")}
            />
            <NavItem 
              icon={Film} 
              label="Videos" 
              count={124} 
              active={activeSidebarItem === "Videos"}
              onClick={() => setActiveSidebarItem("Videos")}
            />
            <NavItem 
              icon={Clock} 
              label="Recent" 
              active={activeSidebarItem === "Recent Scans"}
              onClick={() => setActiveSidebarItem("Recent Scans")}
            />
            <NavItem 
              icon={Star} 
              label="Stared" 
              active={activeSidebarItem === "Star"}
              onClick={() => setActiveSidebarItem("Star")}
            />
          </SidebarSection>

          {/* Sources */}
          <SidebarSection 
            title="Sources" 
            action={<Plus size={14} className="text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors" />}
          >
            <NavItem 
              icon={Layout} 
              label="D:\Videos" 
              active={activeSidebarItem === "D:\\Videos" || currentPath === "D:\\Videos\\Cooking"}
              onClick={() => {
                setActiveSidebarItem("D:\\Videos");
                resetToMock();
              }}
            />
            <div className="flex items-center gap-3 px-3 py-2 ml-2 text-muted-foreground/40 hover:text-muted-foreground/60 cursor-pointer transition-colors group">
              <Plus size={16} />
              <span className="text-sm font-medium">Add Source...</span>
            </div>
          </SidebarSection>

          {/* Smart Views */}
          <SidebarSection 
            title="Smart Views"
          >
            <NavItem 
              icon={Clock} 
              label="Recently Added" 
              count={15} 
              active={activeSidebarItem === "Recent Added"}
              onClick={() => setActiveSidebarItem("Recent Added")}
            />
            <NavItem 
              icon={Search} 
              label="Unindexed" 
              count={5} 
              active={activeSidebarItem === "Unindexed"}
              onClick={() => setActiveSidebarItem("Unindexed")}
            />
            <NavItem 
              icon={Star} 
              label="Needs Review" 
              count={2}
              active={activeSidebarItem === "Review Needed"}
              onClick={() => setActiveSidebarItem("Review Needed")}
            />
          </SidebarSection>

          {/* Tags */}
          <SidebarSection
            title="Tags"
          >
            {MOCK_TAGS.slice(0, 4).map((tag) => (
              <NavItem 
                key={tag.label} 
                icon={Hash} 
                label={tag.label} 
                count={tag.count} 
                active={activeSidebarItem === tag.label}
                onClick={() => setActiveSidebarItem(tag.label)}
              />
            ))}
          </SidebarSection>
        </div>
      </ScrollArea>
    </div>
  );
}
