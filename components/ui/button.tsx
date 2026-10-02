"useclient";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-cta hover:bg-gradient-cta-hover text-white shadow-glow-magenta/30 hover:shadow-glow-magenta/50 hover:scale-[1.02]",
        secondary:
          "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 backdrop-blur-md hover:border-white/30",
        ghost:
          "bg-transparent hover:bg-white/[0.08] text-brand-violet-light hover:text-white",
        outline:
          "border border-white/20 bg-transparent hover:bg-white/[0.06] text-white",
        danger:
          "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30",
        glass:
          "bg-glass hover:bg-glass-hover text-white border border-glass-border hover:border-glass-border-hover backdrop-blur-lg",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-full",
        sm: "h-9 px-4 text-xs rounded-full",
        lg: "h-13 px-8 text-base rounded-full",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
