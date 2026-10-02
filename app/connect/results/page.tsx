"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Zap, 
  ShieldCheck, 
  Moon, 
  Headphones, 
  Users, 
  MapPin, 
  Flame, 
  Compass, 
  Building2
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { ConnectMatchProfile } from "@/lib/connect/constants";
import { sendWaveAction, fetchConnectMatchesAction } from "@/lib/connect/actions";
import { useAuth } from "@/lib/auth/auth-provider";

export default function MatchResultsPage() {
  const { profile } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [wavedUsers, setWavedUsers] = React.useState<string[]>([]);
  const [activeMatchIndex, setActiveMatchIndex] = React.useState(0);
  const [candidates, setCandidates] = React.useState<ConnectMatchProfile[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const waved = JSON.parse(localStorage.getItem("campsnest_waved_users") || "[]");
        setWavedUsers(waved);
      } catch (e) {
        console.warn("Could not read from localStorage:", e);
      }
    }

    async function load() {
      setIsLoading(true);
      try {
        let savedIntent = "both";
        let savedGender = profile?.gender;

        if (typeof window !== "undefined") {
          const rawAnswers = localStorage.getItem("campsnest_questionnaire_answers");
          if (rawAnswers) {
            try {
              const parsed = JSON.parse(rawAnswers);
              if (parsed.intent) savedIntent = parsed.intent;
              if (parsed.gender && !savedGender) savedGender = parsed.gender;
            } catch (e) {}
          }
        }

        const list = await fetchConnectMatchesAction(savedIntent, undefined, savedGender);
        setCandidates(list);
      } catch (e) {
        console.warn("Could not fetch matches:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [profile?.gender]);

  const activeCandidate = candidates[activeMatchIndex] || null;
  const isWaved = activeCandidate ? wavedUsers.includes(activeCandidate.id) : false;

  const handleWave = async (candidateId: string) => {
    const isWaving = !wavedUsers.includes(candidateId);
    const updated = isWaving 
      ? [...wavedUsers, candidateId]
      : wavedUsers.filter(id => id !== candidateId);

    setWavedUsers(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("campsnest_waved_users", JSON.stringify(updated));
    }

    if (isWaving) {
      await sendWaveAction({
        swiperId: profile?.id,
        targetId: candidateId,
        isLike: true
      });
    }
  };

  const handleCopy = () => {
    if (activeCandidate) {
      navigator.clipboard.writeText(activeCandidate.icebreaker);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDating = activeCandidate ? (activeCandidate.intent === "dating" || activeCandidate.intent === "both") : false;
  const isRoommate = activeCandidate ? (activeCandidate.intent === "roommate" || activeCandidate.intent === "both") : false;

  if (isLoading || !activeCandidate) {
    return (
      <AppShell>
        <div className="py-28 text-center space-y-4 max-w-md mx-auto">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center text-3xl animate-pulse">
            ✨
          </div>
          <h2 className="text-xl font-heading font-extrabold text-white">
            {isLoading ? "Calculating Algorithmic Synergy..." : "No Match Selected"}
          </h2>
          <p className="text-xs text-text-dim leading-relaxed">
            {isLoading 
              ? "Aligning campus habits, lifestyle resonance, and roommate vibes..." 
              : "Discover and connect with compatible student roommates and peers on your campus."}
          </p>
          <div className="pt-2">
            <Link href="/connect">
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
                Explore Vibe Matches
              </button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-20 max-w-5xl mx-auto animate-fade-in-up">
        
        {/* ========================================================================= */}
        {/* 1. TOP BREADCRUMB & HEADER STATUS */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/connect"
            className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Vibe Radar Candidates</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-magenta tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-magenta animate-pulse" />
            <span>VERIFIED CAMPUS SYNERGY</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MATCH CELEBRATION HERO SECTION */}
        {/* ========================================================================= */}
        <div className="relative p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#251545]/90 via-[#180F2E]/95 to-[#0E0A1F]/90 border border-white/15 shadow-2xl space-y-8 overflow-hidden text-center">
          
          {/* Floating Sparkles & Hearts */}
          <div className="absolute top-8 left-8 text-2xl animate-pulse">✨</div>
          <div className="absolute top-8 right-8 text-2xl animate-bounce">💕</div>
          <div className="absolute bottom-6 left-6 text-xl opacity-60">⚡</div>

          {/* Unlock Badge & Main Title */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/30 text-[10px] font-extrabold text-brand-violet-light uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SOCIAL CHEMISTRY ALGORITHMIC UNLOCK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
              <span>IT'S A MATCH!</span>
              <span className="text-3xl sm:text-4xl">🎉🤍</span>
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary">
              You and <strong className="text-white">{activeCandidate.name}</strong> have a{" "}
              <span className="font-extrabold text-white underline decoration-brand-magenta decoration-2 underline-offset-4">
                {activeCandidate.matchPercent}% Vibe & Lifestyle Resonance!
              </span>
            </p>

            {/* Candidate Badges */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {isDating && (
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#EC4899]/20 text-[#FFB0CD] border border-[#EC4899]/40 flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-current" />
                  <span>Campus Romance Match</span>
                </span>
              )}
              {isRoommate && (
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>Roommate Match</span>
                </span>
              )}
            </div>
          </div>

          {/* Dual-Avatar Glowing Synergy Alignment */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4">
            
            {/* Left User: YOU */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 bg-gradient-to-tr from-brand-magenta to-brand-violet shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                  <img
                    src={profile?.profile_image && !profile.profile_image.includes("example.com") ? profile.profile_image : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                    alt="You"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-magenta text-[9px] font-extrabold text-white uppercase whitespace-nowrap shadow-md">
                  YOU ({profile?.level || "VERIFIED"})
                </span>
              </div>
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white">{profile?.name || "Student Peer"}</h3>
                <p className="text-[10px] text-text-dim">{profile?.department || "FU Wukari"}</p>
              </div>
            </div>

            {/* Middle Synergy Connection Badge */}
            <div className="flex items-center">
              <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-r from-brand-magenta to-brand-violet" />
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#120D26] border-2 border-brand-magenta flex flex-col items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.4)] shrink-0 z-10">
                <Heart className="h-4 w-4 text-brand-magenta fill-brand-magenta animate-pulse" />
                <span className="text-xs sm:text-sm font-heading font-extrabold text-white leading-tight">
                  {activeCandidate.matchPercent}%
                </span>
                <span className="text-[8px] font-bold text-brand-magenta-light uppercase">
                  SYNERGY
                </span>
              </div>
              <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-r from-brand-violet to-brand-blue" />
            </div>

            {/* Right User: ACTIVE CANDIDATE */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 bg-gradient-to-tr from-brand-violet to-brand-blue shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <img
                    src={activeCandidate.avatar}
                    alt={activeCandidate.name}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-violet text-[9px] font-extrabold text-white uppercase whitespace-nowrap shadow-md">
                  {activeCandidate.name.split(" ")[0].toUpperCase()}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white">{activeCandidate.name}</h3>
                <p className="text-[10px] text-text-dim">{activeCandidate.dept} • {activeCandidate.level}</p>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MATCH BREAKDOWN & LIFESTYLE ALIGNMENT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Why You Matched So Hard */}
          <div className="p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-brand-magenta tracking-wider uppercase">
                <Zap className="h-3.5 w-3.5 text-brand-magenta" />
                <span>WHY YOU MATCHED SO HARD</span>
              </div>

              <p className="text-xs text-text-secondary italic leading-relaxed font-normal">
                "{activeCandidate.bio}"
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
                MUTUAL FREQUENCY TAGS
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeCandidate.vibeTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-text-secondary"
                  >
                    <span>{tag.icon}</span>
                    <span className="truncate">{tag.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Lifestyle & Vibe Alignment */}
          <div className="p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-white tracking-wider uppercase">
                  <span>🎛️</span>
                  <span>AI COMPATIBILITY RADAR</span>
                </div>
                <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30">
                  Top 2% Pair
                </span>
              </div>

              {/* Progress Meters */}
              <div className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 text-brand-violet-light" />
                      <span>Sleep Rhythm ({activeCandidate.radarBreakdown.sleepSchedule}%)</span>
                    </span>
                    <span className="font-extrabold text-white">{activeCandidate.radarBreakdown.sleepSchedule}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-purple-400" style={{ width: `${activeCandidate.radarBreakdown.sleepSchedule}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-brand-magenta-light" />
                      <span>Living Habits & Cleanliness</span>
                    </span>
                    <span className="font-extrabold text-white">{activeCandidate.radarBreakdown.livingHabits}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-magenta to-pink-400" style={{ width: `${activeCandidate.radarBreakdown.livingHabits}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-brand-blue-light" />
                      <span>Social Chemistry & Music</span>
                    </span>
                    <span className="font-extrabold text-white">{activeCandidate.radarBreakdown.socialEnergy}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-blue to-cyan-400" style={{ width: `${activeCandidate.radarBreakdown.socialEnergy}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Note */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-text-dim">
              <MapPin className="h-3.5 w-3.5 text-brand-magenta shrink-0" />
              <span>Location: {activeCandidate.location}</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. PRE-LOADED ICEBREAKER PROMPT CARD */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1C153B]/90 to-[#120D26]/90 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-brand-violet-light uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>PRE-LOADED ICEBREAKER PROMPT</span>
            </span>
            <p className="text-xs text-text-secondary italic">
              "{activeCandidate.icebreaker}"
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white shrink-0 transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-brand-violet-light" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 5. PRIMARY CTA & BOTTOM ACTION BUTTONS */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-2">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* WhatsApp Direct Connect */}
            <a
              href={`https://wa.me/${activeCandidate.whatsapp}?text=${encodeURIComponent(activeCandidate.icebreaker)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 text-white text-sm font-extrabold shadow-[0_6px_28px_rgba(37,211,102,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="h-4 w-4 fill-white" />
              <span>Chat on WhatsApp Directly</span>
            </a>

            {/* In-App Wave */}
            <button
              onClick={() => handleWave(activeCandidate.id)}
              className={`py-4 px-8 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isWaved
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_6px_28px_rgba(236,72,153,0.4)] hover:scale-[1.01]"
              }`}
            >
              <Heart className={`h-4 w-4 ${isWaved ? "fill-emerald-400 text-emerald-400" : "fill-white text-white"}`} />
              <span>{isWaved ? "Waved! 👋 (Sent)" : "Send Wave 👋"}</span>
            </button>
          </div>

          <Link href="/connect" className="block w-full">
            <button className="w-full py-3 px-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all">
              <Compass className="h-3.5 w-3.5 text-brand-blue-light" />
              <span>Explore All Vibe Radar Candidates ({candidates.length})</span>
            </button>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 6. OTHER VIBE RADAR CANDIDATES */}
        {/* ========================================================================= */}
        {candidates.length > 1 && (
          <section className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white flex items-center gap-2">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-brand-magenta fill-brand-magenta/30" />
                  <span>Switch Featured Match Candidate</span>
                </h2>
                <p className="text-xs text-text-secondary">
                  Click any candidate to calculate their live synergy radar and view their conversation icebreaker.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {candidates.map((match, idx) => {
                const isSelected = activeMatchIndex === idx;
                const matchWaved = wavedUsers.includes(match.id);

                return (
                  <div
                    key={match.id}
                    onClick={() => setActiveMatchIndex(idx)}
                    className={`rounded-3xl border p-5 space-y-4 transition-all shadow-xl flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#1F173B] border-brand-magenta ring-2 ring-brand-magenta/40 scale-[1.02]"
                        : "bg-[#141122]/90 hover:bg-[#181428] border-white/10"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="lg"
                            src={match.avatar}
                            glow={isSelected}
                            className="h-12 w-12"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-white">{match.name}</h3>
                            <p className="text-[11px] text-text-dim">{match.dept} • {match.level}</p>
                          </div>
                        </div>

                        <div className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-violet/20 border border-brand-violet/40 text-brand-violet-light">
                          {match.matchPercent}% Match
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-1.5">
                          {match.vibeTags.slice(0, 2).map((vibe, vIdx) => (
                            <span
                              key={vIdx}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary flex items-center gap-1"
                            >
                              <span>{vibe.icon}</span>
                              <span>{vibe.label}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWave(match.id);
                        }}
                        className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                          matchWaved
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
                        }`}
                      >
                        {matchWaved ? "Waved! 👋" : "Wave 👋"}
                      </button>
                      <a
                        href={`https://wa.me/${match.whatsapp}?text=${encodeURIComponent(match.icebreaker)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5 fill-current" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </AppShell>
  );
}
