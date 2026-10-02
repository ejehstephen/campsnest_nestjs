"use client";

import * as React from "react";
import { 
  X, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Copy, 
  Check, 
  Send, 
  Building2, 
  Users, 
  Moon, 
  Music, 
  DollarSign,
  Flame,
  ArrowRight
} from "lucide-react";
import { ConnectMatchProfile } from "@/lib/connect/constants";
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";
import { Avatar } from "@/components/ui/avatar";
import { dispatchNotification } from "@/lib/notifications/service";

interface ProfileDetailModalProps {
  profile: ConnectMatchProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onWave: (id: string) => void;
  isWaved: boolean;
}

export function ProfileDetailModal({ profile, isOpen, onClose, onWave, isWaved }: ProfileDetailModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [viewingPhoto, setViewingPhoto] = React.useState(false);

  if (!isOpen || !profile) return null;

  const handleWaveClick = () => {
    onWave(profile.id);
    dispatchNotification({
      category: "vibe",
      title: `Vibe Wave Sent to ${profile.name}! 👋`,
      description: `You connected with ${profile.name} (${profile.matchPercent}% compatibility on Vibe Radar).`,
      actionUrl: `/messages/c-${profile.id}?context=connect&id=${profile.id}&name=${encodeURIComponent(profile.name)}&role=${encodeURIComponent(profile.dept + " • " + profile.level)}&score=${profile.matchPercent}${profile.avatar && profile.avatar.startsWith("http") && profile.avatar.length < 300 ? `&avatar=${encodeURIComponent(profile.avatar)}` : ""}`,
      actionText: "Open In-App Chat",
    });
  };

  const handleCopyIcebreaker = () => {
    navigator.clipboard.writeText(profile.icebreaker);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDating = profile.intent === "dating" || profile.intent === "both";
  const isRoommate = profile.intent === "roommate" || profile.intent === "both";

  return (
    <>
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-[32px] sm:rounded-[36px] bg-[#141029] border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden text-white mb-0 sm:mb-auto">
        
        {/* Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#EC4899]/25 via-[#8B5CF6]/20 to-transparent blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 px-6 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 uppercase tracking-wider">
              {profile.matchPercent}% SYNERGY MATCH
            </span>
            {isDating && (
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#EC4899]/20 text-[#FFB0CD] border border-[#EC4899]/30 flex items-center gap-1">
                <Heart className="h-3 w-3 fill-current" />
                <span>Campus Romance</span>
              </span>
            )}
            {isRoommate && !isDating && (
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span>Roommate Search</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div 
              onClick={() => {
                if (profile.avatar && !profile.avatar.includes("example.com")) {
                  setViewingPhoto(true);
                }
              }}
              title={profile.avatar ? "Click to view full photo" : profile.name}
              className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl overflow-hidden border-2 border-brand-magenta/40 shadow-[0_0_24px_rgba(236,72,153,0.35)] shrink-0 bg-[#18142E] cursor-pointer group select-none hover:scale-105 transition-transform flex items-center justify-center"
            >
              <Avatar
                src={profile.avatar}
                name={profile.name}
                alt={profile.name}
                size="xl"
                className="h-full w-full rounded-none border-0 text-3xl font-extrabold"
              />
              {profile.avatar && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                    Zoom
                  </span>
                </div>
              )}
              <div className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                  {profile.name}, {profile.age}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white font-semibold">
                  {profile.level}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-brand-violet-light">
                {profile.dept} • {profile.school}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-text-dim pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-brand-magenta shrink-0" />
                <span>{profile.location}</span>
                {profile.budget && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-text-secondary font-medium">Budget: {profile.budget}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bio Box */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <span className="text-[10px] font-extrabold text-text-dim uppercase tracking-wider block">
              About & Vibe Statement
            </span>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
              {profile.bio}
            </p>
          </div>

          {/* Dating Prompt (If Dating / Romance match) */}
          {profile.datingPrompt && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EC4899]/15 to-[#8B5CF6]/15 border border-[#EC4899]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFB0CD]">
                <Heart className="h-3.5 w-3.5 fill-current text-brand-magenta" />
                <span>Dating Vibe Prompt</span>
              </div>
              <p className="text-xs sm:text-sm text-white italic font-medium">
                "{profile.datingPrompt}"
              </p>
            </div>
          )}

          {/* AI Compatibility Radar Breakdown */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-magenta-light" />
                <h3 className="text-sm font-heading font-extrabold text-white">
                  AI Compatibility Radar Breakdown
                </h3>
              </div>
              <span className="text-xs font-extrabold text-brand-magenta-light">
                {profile.matchPercent}% Overall
              </span>
            </div>

            <div className="space-y-3">
              {/* Living Habits */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Living Habits & Hygiene</span>
                  <span className="font-bold text-white">{profile.radarBreakdown.livingHabits}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-emerald-400" style={{ width: `${profile.radarBreakdown.livingHabits}%` }} />
                </div>
              </div>

              {/* Music & Energy */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Music & Entertainment Resonance</span>
                  <span className="font-bold text-white">{profile.radarBreakdown.musicVibe}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-magenta to-[#FFB0CD]" style={{ width: `${profile.radarBreakdown.musicVibe}%` }} />
                </div>
              </div>

              {/* Sleep Schedule */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Circadian Rhythm & Sleep Alignment</span>
                  <span className="font-bold text-white">{profile.radarBreakdown.sleepSchedule}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400" style={{ width: `${profile.radarBreakdown.sleepSchedule}%` }} />
                </div>
              </div>

              {/* Social Battery & Chemistry */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Social Battery & Emotional Chemistry</span>
                  <span className="font-bold text-white">{profile.radarBreakdown.socialEnergy}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#EC4899] to-amber-400" style={{ width: `${profile.radarBreakdown.socialEnergy}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Shared Vibe Tags */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-white block">
              Mutual Interests & Habits:
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.vibeTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                </span>
              ))}
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-brand-violet/15 border border-brand-violet/30 text-xs font-semibold text-brand-violet-light"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </div>

          {/* AI Icebreaker Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-magenta-light">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Algorithmic Icebreaker</span>
              </div>
              <button
                onClick={handleCopyIcebreaker}
                className="text-[11px] font-bold text-white hover:text-brand-magenta-light flex items-center gap-1 bg-white/[0.06] hover:bg-white/[0.12] px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <p className="text-xs text-text-secondary italic leading-relaxed">
              "{profile.icebreaker}"
            </p>
          </div>

        </div>

        {/* Bottom CTA Action Bar */}
        <div className="relative z-10 p-4 sm:p-6 border-t border-white/10 flex items-center gap-3 bg-white/[0.02]">
          {/* Send In-App Wave */}
          <button
            onClick={handleWaveClick}
            className={`flex-1 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              isWaved
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWaved ? "fill-emerald-400 text-emerald-400" : "text-brand-magenta"}`} />
            <span>{isWaved ? "Waved! 👋 (Alert Sent)" : "Send Wave 👋"}</span>
          </button>

          {/* In-App Direct Message */}
          <a
            href={`/messages/c-${profile.id}?context=connect&id=${profile.id}&name=${encodeURIComponent(profile.name)}&role=${encodeURIComponent(profile.dept + " • " + profile.level)}&score=${profile.matchPercent}${profile.avatar && profile.avatar.startsWith("http") && profile.avatar.length < 300 ? `&avatar=${encodeURIComponent(profile.avatar)}` : ""}`}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-[0_4px_20px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-center"
          >
            <MessageSquare className="h-4 w-4 fill-white" />
            <span>Open In-App Chat 💬</span>
          </a>
        </div>

      </div>
    </div>

    {/* Fullscreen Photo Lightbox */}
    {profile.avatar && (
      <ImageLightboxModal
        isOpen={viewingPhoto}
        onClose={() => setViewingPhoto(false)}
        imageUrl={profile.avatar}
        title={`${profile.name}, ${profile.age}`}
        subtitle={`${profile.dept} • ${profile.school}`}
        badge="Verified Student ID"
      />
    )}
    </>
  );
}
