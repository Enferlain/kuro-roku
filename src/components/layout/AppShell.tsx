// AppShell - Main layout wrapper that renders the active tab

import { Background } from "./Background";
import { Header } from "./Header";
import { useAppStore } from "@/stores/appStore";
import { LibraryTab } from "@/components/tabs/LibraryTab";

// Placeholder components for other tabs
function StagingTab() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <p className="text-2xl font-bold mb-2">Staging</p>
        <p className="text-sm">Queue management coming soon</p>
      </div>
    </div>
  );
}

function MonitorTab() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <p className="text-2xl font-bold mb-2">Monitor</p>
        <p className="text-sm">Processing status coming soon</p>
      </div>
    </div>
  );
}

function WorkbenchTab() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <p className="text-2xl font-bold mb-2">Workbench</p>
        <p className="text-sm">Post-processing tools coming soon</p>
      </div>
    </div>
  );
}

export function AppShell() {
  const { activeTab } = useAppStore();

  return (
    <div className="flex flex-col h-screen text-foreground font-sans selection:bg-accent/30 selection:text-white overflow-hidden">
      <Background />
      <Header />

      {/* Tab Content */}
      <div className="flex flex-1 overflow-hidden relative pb-4">
        {activeTab === "library" && <LibraryTab />}
        {activeTab === "staging" && <StagingTab />}
        {activeTab === "monitor" && <MonitorTab />}
        {activeTab === "workbench" && <WorkbenchTab />}
      </div>
    </div>
  );
}
