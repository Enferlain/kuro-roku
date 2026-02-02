import { useState } from "react";
import {
  Film,
  Download,
  Clock,
  Star,
  Hash,
  ChevronRight,
  Plus,
  AlertTriangle,
  Sparkles,
  HardDrive,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionHeader } from "@/components/ui/shared";
import { cn } from "@/lib/utils";

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
    <div className="mb-2">
      <div
        className="group flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-glass-low rounded-lg transition-all duration-200 select-none mb-1 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "text-muted-foreground group-hover:text-foreground-hover transition-all duration-200",
              isOpen ? "rotate-90" : ""
            )}
          >
            <ChevronRight size={12} />
          </div>
          {icon && (
            <div className="text-muted-foreground group-hover:text-foreground-hover transition-all duration-200">
              {icon}
            </div>
          )}
          <SectionHeader className="text-muted-foreground group-hover:text-foreground-hover transition-all duration-200 tracking-wider">
            {title}
          </SectionHeader>
        </div>
        {action && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200"
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
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200 ml-2 select-none",
        active 
          ? "bg-glass-high text-foreground-hover shadow-md ring-1 ring-glass-border-low font-bold" 
          : "text-secondary-foreground hover:bg-glass-mid hover:text-foreground-hover"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon size={16} className={cn(
          "transition-all duration-200",
          active ? "text-primary filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "text-muted-foreground group-hover:text-foreground-hover"
        )} />
        <span className={cn(
          "text-sm font-medium truncate tracking-tight transition-colors duration-200",
          active ? "text-foreground-hover" : ""
        )}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={cn(
          "text-[10px] font-mono transition-opacity",
          active ? "opacity-100" : "opacity-30 group-hover:opacity-60"
        )}>
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

export function LibraryNavigation() {
  const { currentPath, resetToMock, activeSidebarItem, setActiveSidebarItem } = useAppStore();

  return (
    <div className="flex flex-col h-full w-full bg-transparent p-3 select-none">
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
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
          </SidebarSection>

          {/* Sources */}
          <SidebarSection 
            title="Sources" 
            action={<Plus size={14} className="text-muted-foreground hover:text-foreground-hover cursor-pointer transition-colors" />}
          >
            <NavItem 
              icon={HardDrive} 
              label="D:\Videos" 
              active={activeSidebarItem === "D:\\Videos" || currentPath === "D:\\Videos\\Cooking"}
              onClick={() => {
                setActiveSidebarItem("D:\\Videos");
                resetToMock();
              }}
            />
            <div className="flex items-center gap-3 px-3 py-2 ml-2 text-muted-foreground/40 hover:text-muted-foreground/60 cursor-pointer transition-colors group active:scale-[0.98]">
              <Plus size={16} />
              <span className="text-[13px] font-bold tracking-tight">Add Source...</span>
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
              icon={AlertTriangle} 
              label="Unindexed" 
              count={5} 
              active={activeSidebarItem === "Unindexed"}
              onClick={() => setActiveSidebarItem("Unindexed")}
            />
            <NavItem 
              icon={Sparkles} 
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
