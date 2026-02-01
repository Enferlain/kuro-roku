// Header - Top navigation bar with tabs
// Uses semantic tokens from design-system.css

import { Search, Filter, ArrowUpRight, Settings } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/shared";
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
    <header className="h-14 relative flex items-center justify-between px-4 shrink-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      {/* Left: Brand & Navigation */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_-3px_rgba(139,92,246,0.6)] ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_-1px_rgba(139,92,246,0.8)]">
            <span className="font-bold text-primary-foreground text-sm tracking-tighter">
              黒
            </span>
          </div>
          <div className="flex flex-col @max-md:hidden">
            <span className="font-bold text-sm tracking-tight text-foreground leading-none">
              KURO-ROKU
            </span>
            <span className="text-[9px] text-muted-foreground tracking-[0.2em] font-bold uppercase mt-0.5 opacity-60">
              Desktop
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />

        {/* Tab Navigation */}
        <nav className="flex items-center bg-white/3 p-0.5 rounded-lg border border-white/5 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[11px] font-bold uppercase tracking-widest px-3 h-7 rounded-md transition-all duration-300 active:scale-95 ${
                activeTab === tab.id
                  ? "bg-white/10 text-foreground shadow-sm ring-1 ring-white/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Center: Search Bar (Absolute Centering) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[240px] lg:max-w-[320px] xl:max-w-[420px] hidden md:block transition-all duration-300">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search library... (Cmd+K)"
            className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 border border-white/10 rounded-xl h-9 pl-9 pr-4 text-xs text-foreground placeholder-muted-foreground transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 shadow-xl shadow-black/40"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="h-8 text-xs gap-2">
            <Filter size={14} /> Filter
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={selectDirectory}
            className="h-8 text-xs gap-2 shadow-lg shadow-primary/20"
          >
            <ArrowUpRight size={14} /> Scan
          </Button>
        </div>

        <div className="h-5 w-px bg-white/10" />

        <Button variant="icon" size="sm" className="w-8 h-8">
          <Settings size={16} />
        </Button>
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-violet-500 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform" />
      </div>
    </header>
  );
}
