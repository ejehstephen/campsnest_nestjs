"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  online?: boolean;
}

const GRADIENTS = [
  "from-[#8B5CF6] to-[#EC4899]", // violet -> magenta
  "from-[#3B82F6] to-[#8B5CF6]", // blue -> violet
  "from-[#EC4899] to-[#F43F5E]", // magenta -> rose
  "from-[#10B981] to-[#06B6D4]", // emerald -> cyan
  "from-[#6366F1] to-[#A855F7]", // indigo -> purple
  "from-[#0EA5E9] to-[#6366F1]", // sky -> indigo
];

function getGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitialLetter(name?: string, alt?: string, fallback?: string): string {
  const target =
    name?.trim() ||
    (alt && alt !== "User Avatar" && alt !== "Avatar" && alt !== "User" ? alt.trim() : "") ||
    (fallback && fallback !== "CN" ? fallback.trim() : "") ||
    "C";

  const parts = target.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return target.slice(0, 1).toUpperCase() || "C";
}

export function Avatar({
  src,
  alt = "User Avatar",
  name,
  fallback = "CN",
  size = "md",
  glow = false,
  online = false,
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  // Reset error if src changes
  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  const sizeStyles = {
    sm: "h-8 w-8 text-xs font-bold",
    md: "h-10 w-10 text-sm font-bold",
    lg: "h-14 w-14 text-base font-extrabold",
    xl: "h-20 w-20 text-xl font-extrabold",
  };

  const seed = name || alt || fallback || "user";
  const gradientClass = getGradient(seed);
  const initials = getInitialLetter(name, alt, fallback);
  const isValidSrc = !!src && typeof src === "string" && src.trim() !== "" && !src.includes("example.com") && !imgError;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-white/20 select-none text-white tracking-wider shadow-sm",
        sizeStyles[size],
        glow && "ring-2 ring-brand-violet ring-offset-2 ring-offset-canvas-midnight shadow-glow-violet/50",
        `bg-gradient-to-br ${gradientClass}`,
        className
      )}
      {...props}
    >
      {isValidSrc ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="leading-none drop-shadow-sm">{initials}</span>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-canvas-midnight" />
      )}
    </div>
  );
}
