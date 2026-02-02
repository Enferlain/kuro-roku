// Shared UI Components
// Design system primitives using semantic tokens

import React from "react";
import { cn } from "@/lib/utils";

// Re-export core primitives
export { Button } from "./button";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Badge } from "./badge";
export { Input } from "./input";

// ============================================================================
// SearchInput
// Uses: --input-*, semantic tokens
// ============================================================================

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  icon?: React.ReactNode;
  inputSize?: "sm" | "md";
}

export const SearchInput: React.FC<SearchInputProps> = ({
  icon,
  inputSize = "md",
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "py-1 pl-8 pr-3 text-[11px]",
    md: "py-2 pl-9 pr-4 text-xs",
  };

  return (
    <div className={cn("relative group", className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full h-9 bg-secondary-background/50 border border-glass-border-mid text-foreground placeholder:text-muted-foreground/30 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 shadow-xl shadow-glass-dark/50 backdrop-blur-md transition-all duration-300",
          sizes[inputSize]
        )}
        {...props}
      />
    </div>
  );
};

// ============================================================================
// SectionHeader - For sidebar/panel sections
// ============================================================================

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  className = "",
}) => (
  <span className={cn("text-xs font-mono text-muted-foreground/60 tracking-widest uppercase font-medium", className)}>
    {children}
  </span>
);

// ============================================================================
// Tooltip (simple version)
// ============================================================================

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[11px] font-medium bg-elevated-background text-foreground rounded border border-border-subtle shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 backdrop-blur-xl">
        {content}
      </div>
    </div>
  );
};
