// Header - Top navigation bar with tabs
// Uses semantic tokens from design-system.css

import { Search, Filter, ArrowUpRight, Settings } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Button, SearchInput } from "@/components/ui/shared";
import { AppTab } from "@/types";

const TABS: { id: AppTab; label: string }[] = [
  { id: "library", label: "Library" },
  { id: "staging", label: "Staging" },
  { id: "monitor", label: "Monitor" },
  { id: "workbench", label: "Workbench" },
];

export function Header() {
  const { activeTab, setActiveTab, selectDirectory } = useAppStore();

  return (
    <header className="h-16 relative flex items-center justify-between px-6 shrink-0 z-30">
      {/* Left: Brand & Navigation */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_var(--primary-color)] ring-1 ring-border-subtle">
            <span className="font-bold text-primary-foreground text-lg tracking-tighter">
              黒
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground leading-none">
              KURO-ROKU
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wide font-medium">
              FILE ORGANIZER
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-border-subtle mx-2 hidden md:block" />

        {/* Tab Navigation */}
        <nav className="flex items-center bg-secondary-background p-1 rounded-lg border border-border-subtle">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "text-foreground bg-secondary-background-selected shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Center: Search Bar (Absolute Centering) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] hidden lg:block">
        <SearchInput
          placeholder="Search library... (Cmd+K)"
          icon={<Search size={16} />}
          className="w-full shadow-xl ring-1 ring-border-subtle bg-elevated-background/80 backdrop-blur-xl"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Filter size={14} />}>
            Filter
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={selectDirectory}
            className="shadow-lg shadow-primary/20"
          >
            <ArrowUpRight size={16} /> Scan
          </Button>
        </div>

        <div className="h-6 w-px bg-border-subtle" />

        <Button variant="icon" size="sm">
          <Settings size={20} />
        </Button>
        <div className="w-9 h-9 rounded-full bg-primary border border-border-subtle shadow-lg cursor-pointer hover:scale-105 transition-transform" />
      </div>
    </header>
  );
}
