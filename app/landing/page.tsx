"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  Check, 
  Send, 
  SlidersHorizontal, 
  Bookmark, 
  Hand, 
  BookOpen, 
  Flame,
  Zap,
  Building2,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    number: "QUESTION 1 OF 10",
    question: "What's your typical campus study routine?",
    options: [
      { id: "a", label: "Midnight grind at the hostel desk", icon: "🌙" },
      { id: "b", label: "Silent zone library 4th floor regular", icon: "📚" },
      { id: "c", label: "Group study sessions with loud music", icon: "🎧" },
      { id: "d", label: "Cramming 48 hours before exams", icon: "⚡" },
    ],
  },
  {
    id: 4,
    number: "QUESTION 4 OF 10",
    question: "What's your ideal Friday night on campus?",
    options: [
      { id: "a", label: "Movie marathon in the hostel", icon: "🎬" },
      { id: "b", label: "Campus party / Hangout with the crew", icon: "🎉" },
      { id: "c", label: "Catching up on syllabus at the e-library", icon: "📚" },
      { id: "d", label: "Deep 12-hour sleep with AC blasting", icon: "😴" },
    ],
  },
];

export default function LandingPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(1); // Default to Q4 to match image exactly
  const [selectedOption, setSelectedOption] = React.useState<string>("a");
  const [icebreakerText, setIcebreakerText] = React.useState("");
  const [sentIcebreakers, setSentIcebreakers] = React.useState<string[]>([]);
  const [savedMatches, setSavedMatches] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState("all");

  const toggleBookmark = (id: string) => {
    setSavedMatches(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSendIcebreaker = () => {
    if (!icebreakerText.trim()) return;
    setSentIcebreakers(prev => [...prev, icebreakerText]);
    setIcebreakerText("");
  };

  return (
    <div className="min-h-screen bg-canvas-midnight text-white selection:bg-brand-magenta/30 selection:text-white pb-20">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-brand-magenta/15 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-[800px] left-10 w-96 h-96 bg-brand-blue/15 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Match Vibe & Floating Sync Badges (Direct from attached image) */}
        {/* ========================================================================= */}
        <section className="relative rounded-[36px] border border-white/15 bg-gradient-to-br from-canvas-card/90 via-canvas-surface/80 to-canvas-midnight/90 backdrop-blur-2xl p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle Ambient Heart in background */}
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15 pointer-events-none">
            <svg width="480" height="480" viewBox="0 0 24 24" fill="currentColor" className="text-brand-magenta">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Text & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-violet/20 via-brand-magenta/20 to-transparent border border-brand-magenta/30 shadow-glow-magenta/20">
                <Sparkles className="h-4 w-4 text-brand-magenta-light" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-magenta-light">
                  CAMPSNEST CONNECT 💕
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.1]">
                Meet people who <br />
                <span className="bg-gradient-to-r from-white via-brand-violet-light to-brand-magenta-light bg-clip-text text-transparent">
                  match your vibe.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                Answer a few quick questions and discover students you might genuinely connect with for late-night study marathons, roommate chemistry, or spontaneous campus food runs.
              </p>

              <div className="pt-2 space-y-4">
                <Link href="#quiz-section" className="inline-block">
                  <button className="h-14 px-8 rounded-full bg-gradient-cta hover:bg-gradient-cta-hover text-white text-base font-bold shadow-glow-magenta/40 hover:shadow-glow-magenta/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-3">
                    <span>Start Matching (Take 2-min Vibe Quiz)</span>
                    <span className="text-lg">🚀 ⚡</span>
                  </button>
                </Link>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  <span>100% Student Verified Campus Network</span>
                </div>
              </div>
            </div>

            {/* Right Hero Floating Vibe Badges */}
            <div className="lg:col-span-5 flex flex-col gap-4 relative">
              {/* Floating Card 1: 98% Vibe Match */}
              <div className="rounded-3xl p-5 bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-2xl space-y-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-magenta animate-pulse" />
                    <span className="text-[11px] font-bold text-brand-magenta-light tracking-wider uppercase">
                      VIBE COMPATIBILITY
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-magenta/20 text-brand-magenta-light border border-brand-magenta/40 font-semibold">
                    Roommate Compatible
                  </span>
                </div>

                <div>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    98% Match
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Synths & late-night Figma design sprints
                  </p>
                </div>
              </div>

              {/* Floating Card 2: 92% Study Sync */}
              <div className="rounded-3xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl space-y-2 ml-4 sm:ml-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand-blue-light tracking-wider uppercase">
                    STUDY SYNC
                  </span>
                  <BookOpen className="h-4 w-4 text-brand-blue-light" />
                </div>

                <div>
                  <div className="text-2xl font-heading font-extrabold text-white">
                    92% Sync
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Library 4th floor quiet zone regulars
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. MAIN 2-COLUMN SECTION: Active Vibe Matches (Left) & Vibe Quiz + Match (Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: ACTIVE VIBE MATCHES */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
                  Active Vibe Matches
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Curated for your lifestyle based on sleep schedule, study habits & music taste.
                </p>
              </div>

              <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-text-secondary hover:text-white transition-all">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filter Vibes</span>
              </button>
            </div>

            {/* MATCH CARD 1: Stephen E. (Exact match from reference image) */}
            <GlassCard elevation="elevated" glow="violet" className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    glow
                    online
                    className="h-14 w-14"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-heading font-bold text-white">Stephen E.</h3>
                      <span className="text-xs text-text-dim">• 300L Computer Science</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-magenta" />
                      <span>Hostel Block C (500m away)</span>
                    </div>
                  </div>
                </div>

                {/* Score Circular Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 text-center">
                  <span className="text-base font-extrabold text-white">94%</span>
                  <div className="text-[10px] text-brand-violet-light font-bold leading-tight text-left">
                    Match<br />Top Tier
                  </div>
                </div>
              </div>

              {/* Context Callout Box */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3.5 flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                <Zap className="h-4 w-4 text-brand-magenta-light shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Why you connect: </span>
                  You both study late at night and listen to Burna Boy while coding Web3 protocols.
                </div>
              </div>

              {/* Vibe Emoji Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  🎵 Afrobeats
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  🌙 Night Owl
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  💻 Web3 & AI
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  🍕 Midnight Pizza Runs
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button variant="primary" size="default" className="flex-1 text-xs sm:text-sm font-bold shadow-glow-magenta/30">
                  Say Hello 👋
                </Button>
                <Button variant="secondary" size="default" className="text-xs sm:text-sm font-semibold">
                  View Profile
                </Button>
                <button
                  onClick={() => toggleBookmark("stephen")}
                  className={`p-3 rounded-full border transition-all ${
                    savedMatches.includes("stephen")
                      ? "bg-brand-magenta/30 border-brand-magenta text-white"
                      : "bg-white/[0.06] border-white/15 text-text-muted hover:text-white"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>

            {/* MATCH CARD 2: Amara K. (Exact match from reference image) */}
            <GlassCard elevation="elevated" glow="magenta" className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80"
                    glow
                    className="h-14 w-14"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-heading font-bold text-white">Amara K.</h3>
                      <span className="text-xs text-text-dim">• 200L Biochemistry</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-brand-violet-light" />
                      <span>Active 12m ago</span>
                    </div>
                  </div>
                </div>

                {/* Score Circular Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-brand-magenta/20 border border-brand-magenta/40 text-center">
                  <span className="text-base font-extrabold text-white">89%</span>
                  <div className="text-[10px] text-brand-magenta-light font-bold leading-tight text-left">
                    Match<br />High Sync
                  </div>
                </div>
              </div>

              {/* Context Callout Box */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3.5 flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                <Zap className="h-4 w-4 text-brand-violet-light shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Why you connect: </span>
                  Shared early morning routines and passion for binge-watching anime during reading breaks.
                </div>
              </div>

              {/* Vibe Emoji Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  📚 Library Grinds
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  ☕ Iced Coffee
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  🎬 Anime & Kdrama
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/15 text-white">
                  🏃 Sunrise Jogging
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button variant="primary" size="default" className="flex-1 text-xs sm:text-sm font-bold shadow-glow-magenta/30">
                  Say Hello 👋
                </Button>
                <Button variant="secondary" size="default" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <Hand className="h-3.5 w-3.5" />
                  <span>Wave</span>
                </Button>
                <button
                  onClick={() => toggleBookmark("amara")}
                  className={`p-3 rounded-full border transition-all ${
                    savedMatches.includes("amara")
                      ? "bg-brand-magenta/30 border-brand-magenta text-white"
                      : "bg-white/[0.06] border-white/15 text-text-muted hover:text-white"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: INTERACTIVE VIBE QUIZ & MATCH REVEAL */}
          {/* ===================================================================== */}
          <div id="quiz-section" className="lg:col-span-5 space-y-6">
            
            {/* 1. Interactive Vibe Quiz Card (Exact from reference) */}
            <GlassCard elevation="elevated" className="p-6 space-y-5 border-white/20 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 uppercase tracking-wider">
                  QUESTION 4 OF 10
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-brand-magenta-light">
                  <span>Vibe Quiz</span>
                  <Zap className="h-3.5 w-3.5 text-brand-magenta" />
                </div>
              </div>

              {/* Animated Gradient Progress Bar */}
              <div className="w-full h-1.5 bg-white/[0.1] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-cta rounded-full w-[40%] shadow-glow-magenta/60" />
              </div>

              {/* Question Title */}
              <h3 className="text-base sm:text-lg font-heading font-extrabold text-white tracking-tight">
                What's your ideal Friday night on campus?
              </h3>

              {/* Quiz Selectable Options */}
              <div className="space-y-2.5">
                {[
                  { id: "a", label: "Movie marathon in the hostel", icon: "🎬" },
                  { id: "b", label: "Campus party / Hangout with the crew", icon: "🎉" },
                  { id: "c", label: "Catching up on syllabus at the e-library", icon: "📚" },
                  { id: "d", label: "Deep 12-hour sleep with AC blasting", icon: "😴" },
                ].map((option) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-200 border ${
                        isSelected
                          ? "bg-gradient-to-r from-brand-violet/40 to-brand-magenta/30 text-white border-brand-magenta/60 shadow-glow-magenta/30 scale-[1.01]"
                          : "bg-white/[0.04] hover:bg-white/[0.09] text-text-secondary hover:text-white border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                      </div>

                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-brand-magenta flex items-center justify-center text-white shadow-sm">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quiz Controls */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setSelectedOption("b")}
                  className="text-xs text-text-muted hover:text-white transition-colors font-medium"
                >
                  Skip for now
                </button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => alert("Moving to Question 5 in Quiz Flow!")}
                  className="text-xs font-bold px-5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </GlassCard>

            {/* 2. IT'S A MATCH! Reveal Screen (Exact from reference) */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#2D123D] via-[#1B1130] to-[#120B20] border border-brand-magenta/40 shadow-2xl relative overflow-hidden space-y-5">
              {/* Floating Hearts in top right */}
              <div className="absolute top-4 right-4 flex gap-1 text-brand-magenta-light animate-bounce">
                <span className="text-xl">💕</span>
              </div>

              <div className="space-y-1">
                <span className="inline-block text-[10px] font-extrabold px-3 py-0.5 rounded-full bg-brand-magenta/30 text-brand-magenta-light border border-brand-magenta/50 uppercase tracking-widest">
                  NEW CONNECTION
                </span>

                <h3 className="text-2xl font-heading font-extrabold text-white tracking-tight pt-1">
                  IT'S A MATCH! 🎉💕
                </h3>

                <p className="text-xs text-text-secondary leading-relaxed">
                  You and <span className="text-white font-bold">Tola M. (Architecture, 400L)</span> have an exceptional 96% mutual energy affinity!
                </p>
              </div>

              {/* Dual Avatars with Overlapping Heart Badge */}
              <div className="flex items-center justify-center gap-3 py-2">
                {/* User Avatar */}
                <div className="relative text-center">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    glow
                    className="h-16 w-16 ring-2 ring-brand-violet"
                  />
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded-full bg-brand-violet/30 text-brand-violet-light">
                    YOU
                  </span>
                </div>

                {/* Pulsing Heart Badge in between */}
                <div className="h-10 w-10 rounded-full bg-brand-magenta p-0.5 flex items-center justify-center shadow-glow-magenta/80 animate-pulse">
                  <Heart className="h-5 w-5 text-white fill-white" />
                </div>

                {/* Matched User Avatar */}
                <div className="relative text-center">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                    glow
                    className="h-16 w-16 ring-2 ring-brand-magenta"
                  />
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded-full bg-brand-magenta/30 text-brand-magenta-light">
                    TOLA
                  </span>
                </div>
              </div>

              {/* Icebreaker Input Field */}
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={icebreakerText}
                    onChange={(e) => setIcebreakerText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendIcebreaker()}
                    placeholder='Drop an icebreaker: "Hey, love the 3D..."'
                    className="w-full h-11 rounded-full border border-white/15 bg-white/[0.06] pl-4 pr-24 text-xs text-white placeholder:text-text-dim backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-brand-magenta focus:border-transparent transition-all"
                  />
                  <button
                    onClick={handleSendIcebreaker}
                    className="absolute right-1.5 h-8 px-4 rounded-full bg-gradient-cta text-xs font-bold text-white flex items-center gap-1 shadow-glow-magenta/50 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Send</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>

                {sentIcebreakers.length > 0 && (
                  <div className="p-2.5 rounded-2xl bg-brand-magenta/20 border border-brand-magenta/30 text-[11px] text-white flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Message sent to Tola: "{sentIcebreakers[sentIcebreakers.length - 1]}"</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CAMPSNEST SUPERAPP ECOSYSTEM (Housing 2.0 & Marketplace Integration) */}
        {/* ========================================================================= */}
        <section className="pt-8 border-t border-white/10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="primary" className="px-3 py-1">
              THE FULL STUDENT ECOSYSTEM
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Everything Campus Living, In One Place.
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Connect is just one part of CampsNest 2.0. Explore accommodation and marketplace deals curated for your university.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Housing Pillar Banner */}
            <GlassCard elevation="elevated" glow="violet" interactive className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Verified Student Housing</h3>
                    <p className="text-xs text-text-dim">500+ student-friendly hostels & flats</p>
                  </div>
                </div>
                <Badge variant="verified" dot>Physical Inspection</Badge>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Filter by distance to campus gate, prepaid meters, and 24/7 security. Book physical inspections before paying rent.
              </p>
              <Link href="/housing" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-violet-light hover:underline pt-1">
                <span>Browse Campus Housing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </GlassCard>

            {/* Marketplace Pillar Banner */}
            <GlassCard elevation="elevated" glow="magenta" interactive className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-brand-magenta/20 text-brand-magenta-light border border-brand-magenta/30">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">P2P Campus Marketplace</h3>
                    <p className="text-xs text-text-dim">Buy & sell gadgets, textbooks & hostel items</p>
                  </div>
                </div>
                <Badge variant="vibe">Zero Middleman</Badge>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Trade safely with fellow verified students on campus. Tag hostel pickup spots and chat directly in-app.
              </p>
              <Link href="/market" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-magenta-light hover:underline pt-1">
                <span>Explore Campus Market</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </GlassCard>
          </div>
        </section>

      </div>
    </div>
  );
}
