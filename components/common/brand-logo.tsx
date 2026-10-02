"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSlogan?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  href?: string;
  glow?: boolean;
}

export function BrandLogo({
  size = "md",
  showText = true,
  showSlogan = false,
  showBadge = false,
  badgeText = "2.0 HUB",
  className,
  href,
  glow = true,
}: BrandLogoProps) {
  const sizeMap = {
    xs: {
      img: "h-6 w-6 rounded-lg",
      text: "text-sm",
      slogan: "text-[9px]",
      badge: "text-[8px] px-1 py-0.2",
    },
    sm: {
      img: "h-8 w-8 rounded-xl",
      text: "text-base",
      slogan: "text-[10px]",
      badge: "text-[9px] px-1.5 py-0.2",
    },
    md: {
      img: "h-10 w-10 rounded-2xl",
      text: "text-lg sm:text-xl",
      slogan: "text-[11px]",
      badge: "text-[9px] px-2 py-0.5",
    },
    lg: {
      img: "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl",
      text: "text-2xl sm:text-3xl",
      slogan: "text-xs",
      badge: "text-[10px] px-2.5 py-0.5",
    },
    xl: {
      img: "h-16 w-16 sm:h-20 sm:w-20 rounded-3xl",
      text: "text-3xl sm:text-4xl",
      slogan: "text-sm",
      badge: "text-xs px-3 py-1",
    },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {/* Official CampsNest Icon Badge */}
      <div
        className={cn(
          "relative overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 border border-white/15 bg-gradient-to-br from-[#181135] to-[#0D0920] shadow-md flex items-center justify-center p-0.5",
          selectedSize.img,
          glow && "shadow-glow-violet/30"
        )}
      >
        <img
          src="/campsnest-logo.png"
          alt="CampsNest Logo"
          className="h-full w-full object-cover rounded-[inherit]"
          loading="eager"
        />
      </div>

      {/* Typography Brand & Slogan */}
      {showText && (
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-heading font-extrabold tracking-tight text-white flex items-center",
                selectedSize.text
              )}
            >
              <span>Camps</span>
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
                Nest
              </span>
            </span>

            {showBadge && (
              <span
                className={cn(
                  "font-extrabold rounded-full bg-brand-violet/25 text-brand-violet-light border border-brand-violet/40 uppercase tracking-wider",
                  selectedSize.badge
                )}
              >
                {badgeText}
              </span>
            )}
          </div>

          {showSlogan && (
            <p className={cn("text-text-dim font-medium tracking-tight truncate", selectedSize.slogan)}>
              Your Campus. Your Space. Your People.
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
