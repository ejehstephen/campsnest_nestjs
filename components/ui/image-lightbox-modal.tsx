"use client";

import * as React from "react";
import { X, ZoomIn, ZoomOut, Download, ShieldCheck, Maximize2 } from "lucide-react";

export interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function ImageLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  badge
}: ImageLightboxModalProps) {
  const [zoomLevel, setZoomLevel] = React.useState(1);

  React.useEffect(() => {
    if (!isOpen) {
      setZoomLevel(1);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => (prev === 1 ? 1.75 : 1));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8 animate-fade-in select-none"
    >
      {/* Top Controls Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-auto"
      >
        {/* User / Image Details */}
        <div className="flex items-center gap-3">
          {title && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-heading font-extrabold text-white tracking-tight">
                  {title}
                </h3>
                {badge && (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-violet/30 text-brand-violet-light border border-brand-violet/40 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    <span>{badge}</span>
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-text-dim">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleZoom}
            title={zoomLevel === 1 ? "Zoom in" : "Reset zoom"}
            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
          >
            {zoomLevel === 1 ? <ZoomIn className="h-4 w-4" /> : <ZoomOut className="h-4 w-4" />}
          </button>

          <button
            onClick={onClose}
            title="Close (Esc)"
            className="h-10 w-10 rounded-full bg-white/15 hover:bg-rose-600 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-3xl"
      >
        <div
          onClick={toggleZoom}
          className={`cursor-zoom-in transition-transform duration-300 ease-out flex items-center justify-center ${
            zoomLevel > 1 ? "cursor-zoom-out scale-[1.75]" : "scale-100"
          }`}
        >
          <img
            src={imageUrl}
            alt={title || "Profile Picture"}
            className="max-h-[80vh] max-w-[85vw] object-contain rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-10">
        <span className="text-[11px] font-medium text-white/60 bg-black/50 px-3.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
          Click image to {zoomLevel === 1 ? "zoom in" : "zoom out"} • Click outside or press ESC to close
        </span>
      </div>
    </div>
  );
}
