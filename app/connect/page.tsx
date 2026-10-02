"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Zap, 
  Clock, 
  Moon, 
  Headphones, 
  Lock, 
  BookOpen, 
  BedDouble,
  Lightbulb,
  CheckCircle2,
  Share2,
  MessageSquare,
  MapPin,
  Flame,
  Search,
  Building2,
  Copy,
  Send,
  RefreshCw,
  SlidersHorizontal,
  Loader2
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CONNECT_QUESTIONS, INITIAL_MATCH_PROFILES, ConnectMatchProfile } from "@/lib/connect/constants";
import { fetchConnectMatchesAction, saveQuestionnaireAnswersAction, sendWaveAction } from "@/lib/connect/actions";
import { ProfileDetailModal } from "@/components/connect/profile-detail-modal";
import { useAuth } from "@/lib/auth/auth-provider";
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";
import { Avatar } from "@/components/ui/avatar";
import { dispatchNotification } from "@/lib/notifications/service";

export default function ConnectPage() {
  const { profile } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [viewingTopMatchAvatar, setViewingTopMatchAvatar] = React.useState(false);

  // Questionnaire State (Initial Step-by-Step Flow)
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({
    intent: "both",
    sleep_schedule: "night_owl",
    study_noise: "lofi",
    cleanliness: "neat_freak",
    guests: "dates",
    music_vibe: "afrobeats",
    food_habits: "share_cook",
    weekend_vibe: "movie_night",
    dating_style: "deep_talks",
    location_preference: "close_gate"
  });
  const [isSubmittingQuestionnaire, setIsSubmittingQuestionnaire] = React.useState(false);
  const [isCalibrated, setIsCalibrated] = React.useState(false);

  // Modals & Selected Profile
  const [selectedCandidate, setSelectedCandidate] = React.useState<ConnectMatchProfile | null>(null);
  const [copiedIcebreaker, setCopiedIcebreaker] = React.useState(false);

  // Filter & Search State
  const [activeIntent, setActiveIntent] = React.useState<"all" | "dating" | "roommate" | "study">("all");
  const [genderFilter, setGenderFilter] = React.useState<"all" | "female" | "male">("all");
  const [highSynergyOnly, setHighSynergyOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Waved Users
  const [wavedUserIds, setWavedUserIds] = React.useState<string[]>([]);
  const [matchesList, setMatchesList] = React.useState<ConnectMatchProfile[]>([]);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const calibrated = localStorage.getItem("campsnest_vibe_calibrated") === "true";
        setIsCalibrated(calibrated);

        const savedAnswers = localStorage.getItem("campsnest_questionnaire_answers");
        if (savedAnswers) {
          setAnswers((prev) => ({ ...prev, ...JSON.parse(savedAnswers) }));
        }

        const waved = JSON.parse(localStorage.getItem("campsnest_waved_users") || "[]");
        setWavedUserIds(waved);
      } catch (e) {
        console.warn("Could not read from localStorage:", e);
      }
    }
  }, []);

  // Fetch matches from action
  React.useEffect(() => {
    async function loadMatches() {
      const data = await fetchConnectMatchesAction(activeIntent, genderFilter);
      setMatchesList(data);
    }
    loadMatches();
  }, [activeIntent, genderFilter]);

  const currentQuestion = CONNECT_QUESTIONS[currentStepIndex];
  const selectedOptionId = answers[currentQuestion?.key] || currentQuestion?.options[0]?.id;
  const progressPercent = Math.round(((currentStepIndex + 1) / CONNECT_QUESTIONS.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentStepIndex < CONNECT_QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinishQuestionnaire();
    }
  };

  const handlePrevQuestion = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinishQuestionnaire = async () => {
    setIsSubmittingQuestionnaire(true);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("campsnest_questionnaire_answers", JSON.stringify(answers));
        localStorage.setItem("campsnest_vibe_calibrated", "true");
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
    }

    try {
      await saveQuestionnaireAnswersAction({
        userId: profile?.id,
        answers,
        primaryIntent: answers.intent
      });
    } catch (e) {
      console.warn("Error syncing answers:", e);
    }

    const data = await fetchConnectMatchesAction(activeIntent, genderFilter);
    setMatchesList(data);

    setTimeout(() => {
      setIsSubmittingQuestionnaire(false);
      setIsCalibrated(true);
    }, 1200);
  };

  const handleWave = async (candidateId: string) => {
    const isWaving = !wavedUserIds.includes(candidateId);
    const updated = isWaving 
      ? [...wavedUserIds, candidateId]
      : wavedUserIds.filter(id => id !== candidateId);

    setWavedUserIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("campsnest_waved_users", JSON.stringify(updated));
    }

    if (isWaving) {
      const candidate = matchesList.find((m) => m.id === candidateId);
      if (candidate) {
        dispatchNotification({
          category: "vibe",
          title: `Vibe Wave Sent to ${candidate.name}! 👋`,
          description: `You connected with ${candidate.name} (${candidate.matchPercent}% synergy on Vibe Radar).`,
          actionUrl: `/messages/c-${candidate.id}?context=connect&id=${candidate.id}&name=${encodeURIComponent(candidate.name)}&role=${encodeURIComponent(candidate.dept + " • " + candidate.level)}&score=${candidate.matchPercent}${candidate.avatar && !candidate.avatar.startsWith("data:") && candidate.avatar.length < 300 ? `&avatar=${encodeURIComponent(candidate.avatar)}` : ""}`,
          actionText: "Open In-App Chat",
        });
      }

      await sendWaveAction({
        swiperId: profile?.id,
        targetId: candidateId,
        isLike: true
      });
    }
  };

  // Top Featured Match
  const topMatch = matchesList[0] || null;
  const isTopMatchWaved = topMatch ? wavedUserIds.includes(topMatch.id) : false;

  const handleCopyTopIcebreaker = () => {
    if (topMatch) {
      navigator.clipboard.writeText(topMatch.icebreaker);
      setCopiedIcebreaker(true);
      setTimeout(() => setCopiedIcebreaker(false), 2000);
    }
  };

  const filteredMatches = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const userGender = (profile?.gender === "female" ? "female" : "male");

    return matchesList.filter((m) => {
      if (q) {
        const matchesQuery = 
          m.name.toLowerCase().includes(q) ||
          m.dept.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.bio.toLowerCase().includes(q) ||
          m.interests.some(i => i.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      if (highSynergyOnly && m.matchPercent < 90) return false;

      // Explicit Gender filter pill (if manually toggled)
      if (genderFilter !== "all" && m.gender !== genderFilter) return false;

      // Intent & Gender Compatibility Rules
      if (activeIntent === "roommate") {
        if (m.intent !== "roommate" && m.intent !== "both") return false;
        if (m.gender !== userGender) return false; // Male cannot match with Female for roommates
      } else if (activeIntent === "dating") {
        if (m.intent !== "dating" && m.intent !== "both") return false;
        if (m.gender === userGender) return false; // Male matches with Female for campus dating
      } else if (activeIntent === "study") {
        if (m.intent !== "study" && m.intent !== "both") return false;
      } else {
        // "all" view
        if (m.intent === "roommate" && m.gender !== userGender) return false;
        if (m.intent === "dating" && m.gender === userGender) return false;
      }

      return true;
    });
  }, [matchesList, searchQuery, highSynergyOnly, activeIntent, genderFilter, profile?.gender]);

  return (
    <AppShell>
      <div className="space-y-8 pb-24 max-w-6xl mx-auto animate-fade-in">
        
        {/* ========================================================================= */}
        {/* VIEW 1: FIRST THING USER SEES — INTERACTIVE 10-STEP QUESTIONNAIRE */}
        {/* ========================================================================= */}
        {!isCalibrated ? (
          <div className="space-y-6">
            
            {/* Top Progress & Header */}
            <div className="p-5 sm:p-7 rounded-[32px] bg-[#141029]/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-violet/20 via-brand-magenta/20 to-transparent blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 uppercase tracking-wider">
                    QUESTION {currentStepIndex + 1} OF {CONNECT_QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-magenta" />
                    <span>{currentQuestion.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-text-dim">CampsNest Match Calibration</span>
                  <button
                    onClick={() => {
                      setIsCalibrated(true);
                    }}
                    className="text-brand-violet-light hover:text-white transition-colors"
                  >
                    Skip to Matches →
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-400 shadow-[0_0_14px_rgba(236,72,153,0.6)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-dim font-medium">
                <span>Vibe & Lifestyle Profile: {progressPercent}% Calibrated</span>
                <span className="text-brand-magenta-light">{CONNECT_QUESTIONS.length - currentStepIndex - 1} questions left</span>
              </div>
            </div>

            {/* Main Question Card & Dynamic Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT 8 COLUMNS: Question & 4 Interactive Choices */}
              <div className="lg:col-span-8 p-5 sm:p-8 rounded-[32px] bg-[#141029]/90 border border-white/10 shadow-2xl space-y-6">
                
                {/* Question Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-brand-magenta tracking-wider uppercase">
                    <Zap className="h-3.5 w-3.5 text-brand-magenta" />
                    <span>{currentQuestion.category}</span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-heading font-extrabold text-white tracking-tight leading-tight">
                    {currentQuestion.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                    {currentQuestion.subtitle}
                  </p>
                </div>

                {/* 4 Interactive Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group select-none ${
                          isSelected
                            ? "bg-[#211A3E] border-[#EC4899] ring-2 ring-[#EC4899]/50 shadow-[0_4px_24px_rgba(236,72,153,0.3)] scale-[1.01]"
                            : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="h-11 w-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                            {opt.emoji}
                          </div>

                          <div className="shrink-0">
                            {isSelected ? (
                              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white shadow-md">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-white/20" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-white">
                            {opt.title}
                          </h3>
                          <p className="text-xs text-text-muted leading-relaxed">
                            {opt.description}
                          </p>
                        </div>

                        {opt.matchStat && (
                          <div className="pt-1 text-[10px] font-bold text-[#FFB0CD]">
                            🔥 {opt.matchStat}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Question Navigation Controls */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentStepIndex === 0}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={isSubmittingQuestionnaire}
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-400 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-[0_4px_20px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {isSubmittingQuestionnaire ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Calculating Vibe Radar...</span>
                      </>
                    ) : currentStepIndex === CONNECT_QUESTIONS.length - 1 ? (
                      <>
                        <span>Finish & Unlock Matches ✨</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Next Question</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* RIGHT 4 COLUMNS: Why We Ask & Zero-Judgment Note */}
              <div className="hidden lg:block lg:col-span-4 space-y-4">
                
                {/* Why We Ask Card */}
                <div className="p-6 rounded-3xl bg-[#141029]/90 border border-white/10 space-y-3.5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-brand-violet-light" />
                    <h3 className="text-xs font-heading font-extrabold text-white uppercase tracking-wider">
                      Why We Ask This
                    </h3>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {currentQuestion.whyAsk}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-text-dim">{currentQuestion.impactLabel}</span>
                      <span className="text-brand-magenta-light">{currentQuestion.impactWeight}</span>
                    </div>
                  </div>
                </div>

                {/* Zero-Judgment Privacy Guarantee */}
                <div className="p-5 rounded-3xl bg-[#141029]/90 border border-white/10 space-y-2 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Zero-Judgment Privacy</span>
                  </div>
                  <p className="text-[11px] text-text-dim leading-relaxed">
                    Your answers remain strictly private. Match peers only see mutual compatibility affinity percentages and shared vibe badges.
                  </p>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: RESULTS SCREEN WITH TOP MATCH & CANDIDATES LIST BELOW */
          /* ========================================================================= */
          <div className="space-y-8">
            
            {/* Top Match Celebration Hero */}
            {topMatch ? (
            <div className="relative p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#241344]/90 via-[#160E2A]/95 to-[#0E0A1F]/90 border border-white/15 shadow-2xl space-y-8 overflow-hidden text-center">
              
              {/* Floating Ambient Sparkles */}
              <div className="absolute top-8 left-8 text-2xl animate-pulse">✨</div>
              <div className="absolute top-8 right-8 text-2xl animate-bounce">💖</div>
              <div className="absolute bottom-6 left-6 text-xl opacity-60">⚡</div>

              {/* Title & Resonance */}
              <div className="space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/30 text-[10px] font-extrabold text-brand-violet-light uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Match UNLOCKED</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
                  <span>IT'S A MATCH!</span>
                  <span className="text-3xl sm:text-4xl">🎉❤️</span>
                </h1>

                <p className="text-xs sm:text-sm text-text-secondary">
                  You and <strong className="text-white">{topMatch.name}</strong> have a{" "}
                  <span className="font-extrabold text-white underline decoration-brand-magenta decoration-2 underline-offset-4">
                    {topMatch.matchPercent}% Vibe!
                  </span>
                </p>

                {/* Recalibrate Link */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setCurrentStepIndex(0);
                      setIsCalibrated(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-text-dim hover:text-brand-magenta-light transition-colors font-medium underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Retake  10 Questions</span>
                  </button>
                </div>
              </div>

              {/* Dual-Avatar Glowing Synergy Alignment */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 pt-2">
                
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

                {/* Middle Connector */}
                <div className="flex items-center">
                  <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-r from-brand-magenta to-brand-violet" />
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#120D26] border-2 border-brand-magenta flex flex-col items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.4)] shrink-0 z-10">
                    <Heart className="h-4 w-4 text-brand-magenta fill-brand-magenta animate-pulse" />
                    <span className="text-xs sm:text-sm font-heading font-extrabold text-white leading-tight">
                      {topMatch.matchPercent}%
                    </span>
                    <span className="text-[8px] font-bold text-brand-magenta-light uppercase">
                      SYNERGY
                    </span>
                  </div>
                  <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-r from-brand-violet to-brand-blue" />
                </div>

                {/* Right User: Top Match with Fullscreen Zoom */}
                <div 
                  onClick={() => setViewingTopMatchAvatar(true)}
                  title="Click to view full photo"
                  className="flex flex-col items-center space-y-2 cursor-pointer group select-none hover:scale-105 transition-transform"
                >
                  <div className="relative">
                    <Avatar
                      src={topMatch.avatar}
                      name={topMatch.name}
                      alt={topMatch.name}
                      size="xl"
                      className="h-24 w-24 sm:h-28 sm:w-28 text-3xl font-extrabold shadow-[0_0_30px_rgba(139,92,246,0.5)] border-2 border-white/30 group-hover:border-white transition-all"
                    />
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-violet text-[9px] font-extrabold text-white uppercase whitespace-nowrap shadow-md">
                      {topMatch.name.split(" ")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="pt-2 text-center">
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-violet-light transition-colors">{topMatch.name}</h3>
                    <p className="text-[10px] text-text-dim">{topMatch.dept} • {topMatch.level}</p>
                  </div>
                </div>

              </div>

              {/* Pre-Loaded In-App Icebreaker Prompt */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl mx-auto text-left">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-brand-violet-light uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>PRE-LOADED IN-APP ICEBREAKER</span>
                  </span>
                  <p className="text-xs text-text-secondary italic">
                    "{topMatch.icebreaker}"
                  </p>
                </div>

                <button
                  onClick={handleCopyTopIcebreaker}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white shrink-0 transition-all"
                >
                  {copiedIcebreaker ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-brand-violet-light" />
                      <span>Copy Icebreaker</span>
                    </>
                  )}
                </button>
              </div>

              {/* Primary Direct DM & Wave Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-1">
                
                {/* Open In-App DM */}
                <Link href={`/messages/${topMatch.id}`} className="block w-full sm:flex-1">
                  <button className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] hover:opacity-95 text-white text-xs sm:text-sm font-extrabold shadow-[0_4px_24px_rgba(236,72,153,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4 fill-white" />
                    <span>Message in In-App Chat 💬</span>
                  </button>
                </Link>

                {/* Send In-App Wave */}
                <button
                  onClick={() => handleWave(topMatch.id)}
                  className={`w-full sm:w-auto py-3.5 px-6 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isTopMatchWaved
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isTopMatchWaved ? "fill-emerald-400 text-emerald-400" : "fill-white text-white"}`} />
                  <span>{isTopMatchWaved ? "Waved! 👋 (DM Queued)" : "Send Wave 👋"}</span>
                </button>
              </div>

            </div>
            ) : (
              <div className="p-8 sm:p-12 rounded-[36px] bg-[#141029]/80 border border-white/10 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
                <div className="h-16 w-16 rounded-3xl bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center mx-auto text-2xl">
                  ✨
                </div>
                <h3 className="text-xl font-heading font-extrabold text-white">
                  Radar Calibrated Successfully!
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your campus lifestyle preferences are locked in. When new students join and match your vibe, they will be highlighted here automatically.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setCurrentStepIndex(0);
                      setIsCalibrated(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-violet/90 transition-all"
                  >
                    Retake Questionnaire
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* DOWN BELOW: OTHER COMPATIBLE CANDIDATES & PEERS */}
            {/* ========================================================================= */}
            <div className="space-y-6 pt-4">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 uppercase tracking-wider">
                    EXPLORE ALL CANDIDATES
                  </span>
                  <span className="text-text-dim text-xs">•</span>
                  <span className="text-xs font-bold text-white">{filteredMatches.length} Compatible Peers</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  More Compatible Peers
                </h2>
                {/* <p className="text-xs sm:text-sm text-text-secondary">
                  Browse and connect with verified peers sorted by lifestyle compatibility and intent.
                </p> */}
              </div>

              {/* Intent Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setActiveIntent("all")}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${
                    activeIntent === "all"
                      ? "bg-brand-violet text-white border-brand-violet shadow-glow-violet/30"
                      : "bg-white/[0.03] hover:bg-white/[0.06] text-text-secondary border-white/10"
                  }`}
                >
                  <span>✨ All Matches</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">{matchesList.length}</span>
                </button>

                <button
                  onClick={() => setActiveIntent("dating")}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${
                    activeIntent === "dating"
                      ? "bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent shadow-[0_0_16px_rgba(236,72,153,0.4)]"
                      : "bg-white/[0.03] hover:bg-white/[0.06] text-text-secondary border-white/10"
                  }`}
                >
                  <Heart className="h-3.5 w-3.5 fill-current text-brand-magenta-light" />
                  <span>💖 Campus Dating & Romance</span>
                </button>

                <button
                  onClick={() => setActiveIntent("roommate")}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${
                    activeIntent === "roommate"
                      ? "bg-blue-600 text-white border-blue-600 shadow-glow-blue/30"
                      : "bg-white/[0.03] hover:bg-white/[0.06] text-text-secondary border-white/10"
                  }`}
                >
                  <BedDouble className="h-3.5 w-3.5" />
                  <span>🏡 Roommates & Co-Lease</span>
                </button>

                <button
                  onClick={() => setActiveIntent("study")}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${
                    activeIntent === "study"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                      : "bg-white/[0.03] hover:bg-white/[0.06] text-text-secondary border-white/10"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>📚 Study & Exam Buddies</span>
                </button>
              </div>

              {/* Sub-Filters: Search & Gender */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-[#141029]/80 border border-white/10">
                <div className="flex items-center flex-1 max-w-md px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 focus-within:ring-2 focus-within:ring-brand-violet transition-all">
                  <Search className="h-4 w-4 text-text-dim mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate name, department, vibe..."
                    className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-text-dim"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                  <div className="flex items-center bg-white/[0.04] p-1 rounded-2xl border border-white/10 text-xs">
                    {(["all", "female", "male"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenderFilter(g)}
                        className={`px-3 py-1 rounded-xl font-bold capitalize transition-all ${
                          genderFilter === g
                            ? "bg-brand-violet text-white"
                            : "text-text-dim hover:text-white"
                        }`}
                      >
                        {g === "all" ? "All Genders" : g}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setHighSynergyOnly(!highSynergyOnly)}
                    className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      highSynergyOnly
                        ? "bg-brand-magenta text-white border-brand-magenta shadow-glow-magenta/40"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary border-white/10"
                    }`}
                  >
                    <Flame className="h-3.5 w-3.5 text-amber-300" />
                    <span>90%+ Super Match</span>
                  </button>
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((candidate) => {
                  const isWaved = wavedUserIds.includes(candidate.id);
                  const isDating = candidate.intent === "dating" || candidate.intent === "both";
                  const isRoommate = candidate.intent === "roommate" || candidate.intent === "both";

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="rounded-3xl border border-white/10 bg-[#141029]/80 hover:bg-[#181432]/90 hover:border-white/20 transition-all duration-300 p-5 space-y-4 group flex flex-col justify-between shadow-xl cursor-pointer relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        
                        {/* Top: Avatar, Name, % Match */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={candidate.avatar}
                              name={candidate.name}
                              alt={candidate.name}
                              size="lg"
                              className="h-14 w-14 rounded-2xl group-hover:scale-105 transition-transform"
                              online
                            />

                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-base font-bold text-white group-hover:text-brand-violet-light transition-colors">
                                  {candidate.name}
                                </h3>
                                <span className="text-xs text-text-dim">({candidate.age})</span>
                              </div>
                              <p className="text-[11px] text-text-secondary truncate max-w-[160px]">
                                {candidate.dept} • {candidate.level}
                              </p>
                            </div>
                          </div>

                          <div className="px-3 py-1.5 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 text-xs font-extrabold text-brand-violet-light shadow-md shrink-0 text-center">
                            <div>{candidate.matchPercent}%</div>
                            <div className="text-[8px] uppercase tracking-wider text-text-dim font-bold">Match</div>
                          </div>
                        </div>

                        {/* Intent & Location */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                          {isDating && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#EC4899]/20 text-[#FFB0CD] border border-[#EC4899]/30 flex items-center gap-1">
                              <Heart className="h-3 w-3 fill-current" />
                              <span>Campus Dating</span>
                            </span>
                          )}
                          {isRoommate && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>Roommate</span>
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-text-dim border border-white/10 flex items-center gap-1 truncate max-w-[170px]">
                            <MapPin className="h-3 w-3 text-brand-magenta shrink-0" />
                            <span className="truncate">{candidate.location}</span>
                          </span>
                        </div>

                        {/* Bio */}
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-normal">
                          {candidate.bio}
                        </p>

                        {/* Vibe Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {candidate.vibeTags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] font-semibold text-white/90 flex items-center gap-1"
                            >
                              <span>{tag.icon}</span>
                              <span>{tag.label}</span>
                            </span>
                          ))}
                        </div>

                        {/* Mini Compatibility Meter */}
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-text-dim">
                            <span>Living Habits: {candidate.radarBreakdown.livingHabits}%</span>
                            <span>Music: {candidate.radarBreakdown.musicVibe}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-violet via-brand-magenta to-emerald-400"
                              style={{ width: `${candidate.matchPercent}%` }}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Bottom Actions: Wave & In-App DM (NO WhatsApp!) */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        
                        {/* Send Wave */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWave(candidate.id);
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isWaved
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10"
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${isWaved ? "fill-emerald-400 text-emerald-400" : "text-brand-magenta"}`} />
                          <span>{isWaved ? "Waved! 👋" : "Send Wave"}</span>
                        </button>

                        {/* Open In-App DM */}
                        <Link
                          href={`/messages/${candidate.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold shadow-md shrink-0 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                        >
                          <MessageSquare className="h-3.5 w-3.5 fill-white" />
                          <span>Chat</span>
                        </Link>

                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Empty Search State */}
              {filteredMatches.length === 0 && (
                <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 max-w-md mx-auto my-6 animate-fade-in">
                  <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/10 mx-auto flex items-center justify-center text-3xl shadow-inner">
                    ✨
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-heading font-extrabold text-white">
                      No matching peers found
                    </h3>
                    <p className="text-xs text-text-dim leading-relaxed">
                      Try adjusting your gender, intent, or synergy filter.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveIntent("all");
                      setGenderFilter("all");
                      setHighSynergyOnly(false);
                      setSearchQuery("");
                    }}
                    className="px-5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold border border-white/10"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Profile Detail Modal */}
        <ProfileDetailModal
          profile={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onWave={handleWave}
          isWaved={selectedCandidate ? wavedUserIds.includes(selectedCandidate.id) : false}
        />

        {/* Top Match Fullscreen Avatar Modal */}
        {topMatch && (
          <ImageLightboxModal
            isOpen={viewingTopMatchAvatar}
            onClose={() => setViewingTopMatchAvatar(false)}
            imageUrl={topMatch.avatar}
            title={topMatch.name}
            subtitle={`${topMatch.dept} • ${topMatch.school}`}
            badge={`${topMatch.matchPercent}% Match`}
          />
        )}

      </div>
    </AppShell>
  );
}
