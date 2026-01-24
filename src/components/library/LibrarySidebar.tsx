// LibrarySidebar - Explorer-style navigation
// Uses semantic tokens from design-system.css

import { useState } from "react";
import {
  Folder,
  Pin,
  Clock,
  AlertTriangle,
  Sparkles,
  Hash,
  ChevronRight,
  Plus,
  Search,
  HardDrive,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { ScrollArea } from "@/components/ui/scroll-area";

// Collapsible section
function SidebarSection({
  title,
  children,
  defaultOpen = true,
  action,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <div
        className="group flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-secondary-background-hover rounded-lg transition-colors select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div
            className={`text-muted-foreground/50 group-hover:text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          >
            <ChevronRight size={12} />
          </div>
          <span className="text-xs font-mono text-muted-foreground tracking-widest opacity-80 group-hover:opacity-100 font-medium">
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
        <div className="mt-1 space-y-0.5 animate-in slide-in-from-top-1 fade-in duration-200">
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
  icon: React.ElementType;
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
          ? "bg-secondary-background-selected text-foreground shadow-sm ring-1 ring-border-subtle" 
          : "text-muted-foreground hover:bg-secondary-background-hover hover:text-foreground"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={16}
          className={
            active
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground"
          }
        />
        <span
          className="text-sm font-medium truncate max-w-[130px]"
          title={label}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span
          className={`text-[10px] font-mono ${active ? "opacity-100" : "opacity-40"}`}
        >
          {count}
        </span>
      )}
    </div>
  );
}

// Mock data
const MOCK_TAGS = [
  { label: "cooking", count: 45 },
  { label: "tutorial", count: 30 },
  { label: "outdoor", count: 12 },
  { label: "b-roll", count: 156 },
  { label: "4k", count: 8 },
];

export function LibrarySidebar() {
  const { currentPath, selectDirectory } = useAppStore();
  const [showAllTags, setShowAllTags] = useState(false);

  const displayedTags = showAllTags ? MOCK_TAGS : MOCK_TAGS.slice(0, 4);

  return (
    <aside className="w-64 flex flex-col h-full pt-4 pb-6 pl-4 pr-2">
      <ScrollArea className="flex-1 pr-2">
        {/* Quick Access */}
        <SidebarSection
          title="QUICK ACCESS"
          action={<Pin size={12} className="text-muted-foreground hover:text-foreground" />}
        >
          <NavItem icon={Folder} label="Downloads" />
          <NavItem icon={Folder} label="Videos" />
          <NavItem icon={Clock} label="Recent" count={12} />
        </SidebarSection>

        {/* Sources */}
        <SidebarSection
          title="SOURCES"
          action={
            <Plus
              size={14}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={selectDirectory}
            />
          }
        >
          {currentPath ? (
            <NavItem icon={HardDrive} label={currentPath.split("\\").pop() || currentPath} active />
          ) : (
            <div className="ml-2 px-3 py-2 text-xs text-muted-foreground italic">
              No sources added
            </div>
          )}
        </SidebarSection>

        {/* Smart Views */}
        <SidebarSection title="SMART VIEWS">
          <NavItem icon={Clock} label="Recently Added" />
          <NavItem icon={AlertTriangle} label="Unindexed" count={5} />
          <NavItem icon={Sparkles} label="Needs Review" count={2} />
        </SidebarSection>

        {/* Tags */}
        <SidebarSection
          title="TAGS"
          action={<Search size={12} className="text-muted-foreground hover:text-foreground" />}
        >
          {displayedTags.map((tag) => (
            <NavItem key={tag.label} icon={Hash} label={tag.label} count={tag.count} />
          ))}

          {MOCK_TAGS.length > 4 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 ml-2 mt-1 cursor-pointer group"
              onClick={() => setShowAllTags(!showAllTags)}
            >
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium">
                {showAllTags ? "Show less" : `Show ${MOCK_TAGS.length - 4} more...`}
              </span>
            </div>
          )}
        </SidebarSection>
      </ScrollArea>
    </aside>
  );
}
