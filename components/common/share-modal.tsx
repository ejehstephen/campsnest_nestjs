"use client";

import * as React from "react";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  ExternalLink,
  MessageCircle,
  Sparkles
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price?: number | string;
  category?: string;
  image?: string;
  url?: string;
  description?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  price,
  category = "Listing",
  image,
  url,
  description
}: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "https://campsnest.com");
  const formattedPrice = price ? ` for ₦${Number(price).toLocaleString()}` : "";
  const shareText = `🔥 Check out "${title}"${formattedPrice} on CampsNest Campus Marketplace!\n👉 ${currentUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${title}" on CampsNest Marketplace!`)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Check out "${title}" on CampsNest!`)}`;
    window.open(tgUrl, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${title} on CampsNest!`,
          url: currentUrl,
        });
      } catch (err) {
        // Ignored if user dismissed share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#141029] border border-white/15 p-5 sm:p-6 shadow-2xl text-white space-y-5">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-violet/20 via-brand-magenta/20 to-transparent blur-2xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-violet to-brand-magenta flex items-center justify-center shadow-glow-magenta/30">
              <Share2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-extrabold text-white">
                Share this Listing
              </h3>
              <p className="text-[10px] text-text-dim">
                Spread the word with campus friends & hostel groups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Snippet Preview Card */}
        <div className="relative z-10 p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          {image && (
            <img
              src={image}
              alt={title}
              className="h-14 w-14 rounded-xl object-cover border border-white/10 shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-violet/30 text-brand-violet-light border border-brand-violet/30">
              {category}
            </span>
            <h4 className="text-xs font-bold text-white truncate mt-1">
              {title}
            </h4>
            {price && (
              <p className="text-xs font-extrabold text-brand-magenta-light mt-0.5">
                ₦{Number(price).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Quick Social Buttons Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 flex flex-col items-center justify-center gap-1.5 transition-all group hover:scale-102"
          >
            <span className="text-xl">💬</span>
            <span className="text-[11px] font-bold text-[#25D366]">WhatsApp</span>
            <span className="text-[9px] text-text-dim">Group & Chat</span>
          </button>

          {/* Twitter / X */}
          <button
            type="button"
            onClick={handleTwitterShare}
            className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex flex-col items-center justify-center gap-1.5 transition-all group hover:scale-102"
          >
            <span className="text-xl">𝕏</span>
            <span className="text-[11px] font-bold text-white">Twitter / X</span>
            <span className="text-[9px] text-text-dim">Post / Feed</span>
          </button>

          {/* Telegram */}
          <button
            type="button"
            onClick={handleTelegramShare}
            className="p-3 rounded-2xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/30 flex flex-col items-center justify-center gap-1.5 transition-all group hover:scale-102"
          >
            <span className="text-xl">✈️</span>
            <span className="text-[11px] font-bold text-[#229ED9]">Telegram</span>
            <span className="text-[9px] text-text-dim">Channel / Chat</span>
          </button>
        </div>

        {/* Copy Link Input & Native Share */}
        <div className="relative z-10 space-y-2">
          <label className="text-[11px] font-semibold text-text-dim block">
            Or Copy Listing Link:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full h-11 rounded-2xl bg-white/[0.04] border border-white/10 px-3.5 text-xs text-text-muted truncate focus:outline-none select-all"
              />
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`h-11 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                copied
                  ? "bg-emerald-500 text-white shadow-glow-magenta/30"
                  : "bg-gradient-to-r from-brand-violet to-brand-magenta text-white hover:opacity-90 shadow-md"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Mobile Share Button */}
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <div className="relative z-10 pt-1">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 text-brand-magenta-light" />
              <span>More Share Options on Device...</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
