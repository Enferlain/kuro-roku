// Sidebar navigation component

import {
  HardDrive,
  Clock,
  AlertTriangle,
  Sparkles,
  Tag,
  Cpu,
  BarChart3,
  Settings,
  FolderOpen,
} from "lucide-react";
import { useFileStore, ViewState } from "@/stores/fileStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, count, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      <Icon size={18} />
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}

interface FolderItemProps {
  name: string;
  indent?: number;
}

function FolderItem({ name, indent = 0 }: FolderItemProps) {
  return (
    <button
      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 rounded-md transition-colors"
      style={{ paddingLeft: `${12 + indent * 16}px` }}
    >
      <FolderOpen size={14} />
      <span className="truncate">{name}</span>
    </button>
  );
}

export function Sidebar() {
  const { currentView, setCurrentView, selectDirectory } = useFileStore();

  const navItems: { view: ViewState; icon: React.ElementType; label: string }[] = [
    { view: "library", icon: HardDrive, label: "My Library" },
    { view: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <aside className="w-56 border-r border-border flex flex-col bg-sidebar">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
            <span className="font-mono text-xs font-black text-white">黒</span>
          </div>
          Kuro-Roku
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 space-y-1">
          {/* Main Nav */}
          <div className="py-2">
            {navItems.map((item) => (
              <NavItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                active={currentView === item.view}
                onClick={() => setCurrentView(item.view)}
              />
            ))}
          </div>

          <Separator className="my-2" />

          {/* Smart Views */}
          <div className="py-2">
            <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Smart Views
            </p>
            <NavItem icon={Clock} label="Recent" />
            <NavItem icon={AlertTriangle} label="Needs Review" count={5} />
            <NavItem icon={Sparkles} label="New Manifest" />
          </div>

          <Separator className="my-2" />

          {/* Tags */}
          <div className="py-2">
            <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Tags
            </p>
            <NavItem icon={Tag} label="#cooking" count={45} />
            <NavItem icon={Tag} label="#tutorial" count={30} />
            <NavItem icon={Tag} label="#outdoor" count={12} />
          </div>

          <Separator className="my-2" />

          {/* Library Folders (placeholder) */}
          <div className="py-2">
            <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Library
            </p>
            <FolderItem name="Movies" />
            <FolderItem name="Tutorials" indent={1} />
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={selectDirectory}
        >
          <FolderOpen size={16} className="mr-2" />
          Scan Folder
        </Button>
        <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
          <Cpu size={12} />
          <span>Processing: Idle</span>
        </div>
      </div>
    </aside>
  );
}
