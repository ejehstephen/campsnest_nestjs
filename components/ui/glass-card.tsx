"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "base" | "elevated" | "floating";
  interactive?: boolean;
  glow?: "violet" | "magenta" | "blue" | "none";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, elevation = "base", interactive = false, glow = "none", children, ...props }, ref) => {
    const elevationStyles = {
      base: "bg-white/[0.04] border-white/10 backdrop-blur-md shadow-glass",
      elevated: "bg-white/[0.07] border-white/15 backdrop-blur-lg shadow-glass",
      floating: "bg-canvas-card/90 border-white/20 backdrop-blur-2xl shadow-2xl",
    };

    const glowStyles = {
      none: "",
      violet: "hover:shadow-glow-violet/40 hover:border-brand-violet/40",
      magenta: "hover:shadow-glow-magenta/40 hover:border-brand-magenta/40",
      blue: "hover:shadow-glow-blue/40 hover:border-brand-blue/40",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl border transition-all duration-300 relative overflow-hidden",
          elevationStyles[elevation],
          interactive && "cursor-pointer hover:-translate-y-1 hover:bg-white/[0.08] hover:border-white/25",
          glow !== "none" && glowStyles[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
