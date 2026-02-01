import React, { useRef, useState, useEffect, useCallback } from "react";

interface ResizablePanelProps {
  children: React.ReactNode;
  side: "left" | "right"; // which side the handle is on
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  onWidthChange: (width: number) => void;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  side,
  minWidth,
  maxWidth,
  defaultWidth,
  onWidthChange,
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Clamp width to constraints
  const clampWidth = useCallback(
    (newWidth: number) => {
      return Math.max(minWidth, Math.min(maxWidth, newWidth));
    },
    [minWidth, maxWidth]
  );

  // Handle mouse down on drag handle
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = width;
    },
    [width]
  );

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const delta = side === "right" ? e.clientX - startXRef.current : startXRef.current - e.clientX;
      const newWidth = clampWidth(startWidthRef.current + delta);

      setWidth(newWidth);
      onWidthChange(newWidth);
    },
    [isDragging, side, clampWidth, onWidthChange]
  );

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach/detach document-level event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={panelRef}
      className="relative shrink-0"
      style={{ width: `${width}px` }}
    >
      {children}

      {/* Drag handle */}
      <div
        className={`absolute top-0 h-full w-1 bg-transparent hover:bg-primary/20 transition-colors duration-200 cursor-col-resize ${
          isDragging ? "bg-primary/40" : ""
        } ${side === "left" ? "left-0" : "right-0"}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
