// Shared UI Components
// Design system primitives using semantic tokens

import React from "react";
import { Loader2 } from "lucide-react";

// ============================================================================
// Button
// Uses: --button-primary-*, --button-secondary-*, etc.
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  loading,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-[0_0_0_1px_var(--primary-color),0_4px_12px_rgba(139,92,246,0.3)] hover:bg-primary-hover active:scale-[0.98]",
    secondary:
      "bg-secondary-background text-foreground border border-border-subtle hover:bg-secondary-background-hover active:scale-[0.98]",
    ghost:
      "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary-background",
    icon: 
      "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary-background rounded-full",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
    md: "text-sm px-4 py-2 rounded-lg gap-2",
    lg: "text-base px-6 py-3 rounded-xl gap-2.5",
  };

  const sizeClass = variant === "icon" ? "p-2" : sizes[size];

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

// ============================================================================
// Badge
// Uses: --badge-*-background, --badge-*-foreground
// ============================================================================

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className = "",
}) => {
  // Using CSS variables from design system for consistency
  const variants = {
    success: "bg-jade-500/15 text-jade-400 border-jade-500/25",
    warning: "bg-gold-500/15 text-gold-400 border-gold-500/25",
    error: "bg-coral-500/15 text-coral-400 border-coral-500/25",
    info: "bg-azure-500/15 text-azure-400 border-azure-500/25",
    neutral: "bg-secondary-background text-muted-foreground border-border-subtle",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wide uppercase border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// ============================================================================
// Card
// Uses: --card-*, --border-*
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  selected,
}) => {
  const interactiveStyles = onClick
    ? "cursor-pointer hover:border-border-default hover:bg-secondary-background-hover"
    : "";

  const selectedStyles = selected
    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-elevated-background border border-border-subtle backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 ${interactiveStyles} ${selectedStyles} ${className}`}
    >
      {children}
    </div>
  );
};

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
    sm: "py-1.5 pl-8 pr-3 text-xs",
    md: "py-2 pl-9 pr-4 text-sm",
  };

  return (
    <div className={`relative group ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-secondary-background border border-border-subtle text-foreground placeholder:text-muted-foreground/50 rounded-lg ${sizes[inputSize]} focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-200`}
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
  <span className={`text-xs font-mono text-muted-foreground tracking-widest uppercase ${className}`}>
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
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-elevated-background text-foreground rounded border border-border-subtle shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {content}
      </div>
    </div>
  );
};
