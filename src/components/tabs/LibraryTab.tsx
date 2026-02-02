// LibraryTab - Main file browsing interface with resizable panels

import { useState, useRef, useEffect } from "react";
import { LibraryNavigation } from "@/components/library/LibraryNavigation";
import { LibraryContent } from "@/components/library/LibraryContent";
import { LibraryInspector } from "@/components/library/LibraryInspector";

export function LibraryTab() {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [detailsWidth, setDetailsWidth] = useState(320);
  const [isResizing, setIsResizing] = useState<"sidebar" | "details" | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Resize Handlers
  const startResizing =
    (panel: "sidebar" | "details") => (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(panel);
    };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      if (isResizing === "sidebar") {
        const newWidth = Math.max(200, Math.min(400, e.clientX));
        setSidebarWidth(newWidth);
      } else if (isResizing === "details") {
        const newWidth = Math.max(
          240,
          Math.min(500, window.innerWidth - e.clientX)
        );
        setDetailsWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full overflow-hidden relative gap-0"
    >
      {/* Sidebar Panel */}
      <div style={{ width: sidebarWidth }} className="h-full shrink-0 relative">
        <LibraryNavigation />
      </div>

      {/* Resizer: Sidebar <-> Content */}
      <div
        className={`w-px h-full bg-glass-border-low hover:bg-primary/50 cursor-col-resize z-10 transition-colors relative flex justify-center
          ${isResizing === "sidebar" ? "bg-primary" : ""}
        `}
        onMouseDown={startResizing("sidebar")}
      >
        {/* Invisible hit area for easier grabbing */}
        <div className="absolute inset-y-0 -left-2 -right-2 z-20 bg-transparent" />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full min-w-0 bg-transparent flex flex-col">
        <LibraryContent />
      </div>

      {/* Resizer: Content <-> Details */}
      <div
        className={`w-px h-full bg-glass-border-low hover:bg-primary/50 cursor-col-resize z-10 transition-colors relative flex justify-center
          ${isResizing === "details" ? "bg-primary" : ""}
        `}
        onMouseDown={startResizing("details")}
      >
        {/* Invisible hit area for easier grabbing */}
        <div className="absolute inset-y-0 -left-2 -right-2 z-20 bg-transparent" />
      </div>

      {/* Details Panel */}
      <div style={{ width: detailsWidth }} className="h-full shrink-0 relative">
        <LibraryInspector />
      </div>
    </div>
  );
}
