import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading,
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-1 focus:ring-offset-background-base disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:bg-accent-bright hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_6px_16px_rgba(94,106,210,0.4)] active:scale-[0.98]",
    secondary: "bg-white/[0.05] text-foreground border border-white/10 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]",
    ghost: "bg-transparent text-foreground-muted hover:text-foreground hover:bg-white/[0.05]",
    icon: "bg-transparent text-foreground-muted hover:text-foreground hover:bg-white/[0.05] rounded-full p-2",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
    md: "text-sm px-4 py-2 rounded-lg gap-2",
    lg: "text-base px-6 py-3 rounded-xl gap-2.5",
  };

  // Icon buttons override size padding
  const combinedClassName = `${baseStyles} ${variants[variant]} ${variant === 'icon' ? '' : sizes[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

// --- Badge ---
interface BadgeProps {
  status?: 'success' | 'warning' | 'neutral' | 'processing';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status = 'neutral', children }) => {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    neutral: "bg-white/5 text-foreground-muted border-white/10",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wide uppercase border ${styles[status]}`}>
      {children}
    </span>
  );
};

// --- Search Input ---
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const SearchInput: React.FC<SearchInputProps> = ({ icon, className = '', ...props }) => {
  return (
    <div className={`relative group ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-accent transition-colors">
          {icon}
        </div>
      )}
      <input 
        className="w-full bg-[#0F0F12] border border-white/10 text-sm text-foreground placeholder:text-foreground-muted/50 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-200"
        {...props}
      />
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-white/[0.12] hover:bg-white/[0.04]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};