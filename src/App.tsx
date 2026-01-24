import { Sidebar } from "@/components/Sidebar";
import { FileGrid } from "@/components/FileGrid";
import { DetailsPanel } from "@/components/DetailsPanel";
import { useFileStore } from "@/stores/fileStore";
import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const { currentPath } = useFileStore();

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      {/* Left: Navigation Sidebar */}
      <Sidebar />

      {/* Center: Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium">
              {currentPath ? "Library" : "Welcome"}
            </h2>
            {currentPath && (
              <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                {currentPath}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search library..."
                className="w-64 bg-muted border border-border rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Button variant="ghost" size="icon">
              <Settings size={18} />
            </Button>
          </div>
        </header>

        {/* File Grid */}
        <FileGrid />
      </main>

      {/* Right: Details Panel */}
      <DetailsPanel />
    </div>
  );
}

export default App;
