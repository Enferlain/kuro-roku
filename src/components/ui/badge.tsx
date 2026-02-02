import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary-background text-foreground hover:bg-secondary-background-hover",
        neutral:
          "border-border-subtle bg-secondary-background/50 text-muted-foreground",
        outline: "text-foreground border-border",
        success: "bg-jade-500/15 text-jade-400 border-jade-500/25",
        warning: "bg-gold-500/15 text-gold-400 border-gold-500/25",
        error: "bg-coral-500/15 text-coral-400 border-coral-500/25",
        info: "bg-azure-500/15 text-azure-400 border-azure-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
