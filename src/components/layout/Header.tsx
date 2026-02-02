// Header - Top navigation bar with tabs
// Uses semantic tokens from design-system.css

import { Search, Filter, ArrowUpRight, Settings } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Button, SearchInput } from "@/components/ui/shared";
import { AppTab } from "@/types";
import { cn } from "@/lib/utils";

const TABS: { id: AppTab; label: string }[] = [
  { id: "library", label: "Library" },
  { id: "staging", label: "Staging" },
  { id: "monitor", label: "Monitor" },
  { id: "workbench", label: "Workbench" },
];

export function Header() {
  const { activeTab, setActiveTab, selectDirectory } = useAppStore();

  return (
    <header className="h-14 relative flex items-center justify-between px-4 shrink-0 z-50 bg-glass-dark backdrop-blur-xl border-b border-glass-border-low shadow-2xl">
      {/* Left: Brand & Navigation */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-primary-glow-strong ring-1 ring-glass-border-mid transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_-1px_rgba(139,92,246,0.8)]">
            <span className="font-bold text-primary-foreground text-sm tracking-tighter">
              黒
            </span>
          </div>
          <div className="flex-col hidden sm:flex">
            <span className="font-bold text-sm tracking-tight text-foreground leading-none group-hover:text-foreground-hover transition-colors">
              KURO-ROKU
            </span>
            <span className="text-[9px] text-muted-foreground tracking-wide font-medium uppercase mt-1 group-hover:text-secondary-foreground transition-colors">
              File Organizer
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-glass-border-low mx-1 hidden md:block" />

        {/* Tab Navigation */}
        <nav className="flex items-center bg-glass-low p-0.5 rounded-lg border border-glass-border-low shadow-sm">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "text-xs px-2.5 h-7 transition-all duration-300 cursor-pointer",
                activeTab === tab.id 
                  ? "bg-glass-high text-foreground-hover shadow-sm ring-1 ring-glass-border-low font-bold" 
                  : "text-secondary-foreground hover:text-foreground-hover"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Center: Search Bar (Absolute Centering) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[240px] lg:max-w-[320px] xl:max-w-[420px] hidden md:block transition-all duration-300">
        <SearchInput 
          placeholder="Search library... (Cmd+K)"
          icon={<Search size={14} />}
          className="shadow-2xl shadow-glass-dark"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="h-8 text-xs gap-2 cursor-pointer">
            <Filter size={14} /> Filter
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={selectDirectory}
            className="h-8 text-xs gap-2 shadow-primary-glow cursor-pointer"
          >
            <ArrowUpRight size={14} /> Scan
          </Button>
        </div>

        <div className="h-5 w-px bg-glass-border-low" />

        <Button variant="ghost" size="icon-sm" className="bg-transparent hover:bg-glass-low rounded-full cursor-pointer">
          <Settings size={16} />
        </Button>
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-violet-500 border border-glass-border-mid shadow-lg cursor-pointer hover:scale-105 transition-transform" />
      </div>
    </header>
  );
}
