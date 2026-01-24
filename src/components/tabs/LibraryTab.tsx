// LibraryTab - Main file browsing interface

import { LibrarySidebar } from "@/components/library/LibrarySidebar";
import { LibraryContent } from "@/components/library/LibraryContent";
import { LibraryDetails } from "@/components/library/LibraryDetails";

export function LibraryTab() {
  return (
    <div className="flex flex-1 w-full h-full">
      {/* Left: Explorer Sidebar */}
      <LibrarySidebar />

      {/* Center: Main Content */}
      <LibraryContent />

      {/* Right: Details Panel */}
      <LibraryDetails />
    </div>
  );
}
