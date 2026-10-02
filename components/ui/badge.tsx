import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-white/[0.08] text-white border border-white/15",
        primary: "bg-brand-violet/20 text-brand-violet-light border border-brand-violet/40",
        vibe: "bg-gradient-to-r from-brand-violet/30 to-brand-magenta/30 text-white border border-brand-magenta/40 shadow-glow-magenta/20",
        success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
        verified: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        danger: "bg-red-500/20 text-red-300 border border-red-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-emerald-400 animate-pulse",
            variant === "vibe" && "bg-brand-magenta animate-pulse",
            variant === "primary" && "bg-brand-violet-light",
            variant === "verified" && "bg-blue-400",
            (!variant || variant === "default") && "bg-white/60"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
