"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Building2, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Home as HomeIcon,
  ChevronRight,
  Zap,
  CheckCircle2,
  Users,
  Compass,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { BrandLogo } from "@/components/common/brand-logo";
import { CAMPUS_LIST } from "@/lib/constants";


const SLIDES = [
  {
    tag: "CAMPUS LIVING REIMAGINED",
    headline: "Your Campus.\nYour Space.\nYour People.",
    description:
      "The all-in-one student superapp. Discover verified campus housing, buy & sell pre-loved items with fellow students, and match with roommates who match your energy.",
    cta: "Get Started Now",
    badge: "100% Student Verified",
  },
  {
    tag: "STUDENT HOUSING 2.0",
    headline: "Find Your Perfect Nest\nNear Campus Gate.",
    description:
      "Explore hundreds of verified self-contain rooms and shared apartments with prepaid meters, 24/7 water, and security. Book physical inspections before paying rent.",
    cta: "Explore Campus Housing",
    badge: "500+ Verified Rooms",
  },
  {
    tag: "CONNECT & ROOMMATES",
    headline: "Meet People Who\nMatch Your Vibe.",
    description:
      "Take our fun 2-minute personality questionnaire. Discover study partners, future flatmates, and campus friends with shared music taste and lifestyle sync.",
    cta: "Start Matching Quiz",
    badge: "96% Vibe Match Engine",
  },
];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = React.useState(0);

  // Auto-advance slide every 7 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES[activeSlide];

  return (
    <div className="min-h-screen bg-canvas-midnight text-white selection:bg-brand-magenta/30 selection:text-white relative overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. IMMERSIVE HERO CANVAS (Exact Gradient & Shapes from Reference Image) */}
      {/* ========================================================================= */}
      <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#6D28D9] via-[#9333EA] to-[#DB2777]">
        
        {/* Abstract Floating Vector Graphics & Halftone Dots (Matching Mockup) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Fluid Blob 1 (Bottom Right Wave) */}
          <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-[45%] bg-gradient-to-tr from-pink-500/40 to-purple-600/30 blur-2xl transform rotate-12" />
          
          {/* Fluid Blob 2 (Mid Right Layer) */}
          <div className="absolute bottom-10 right-32 w-[450px] h-[350px] rounded-[55%] bg-gradient-to-bl from-purple-500/30 to-pink-600/40 blur-xl transform -rotate-45" />

          {/* Dotted Halftone Pattern 1 (Top Right) */}
          <div className="absolute top-28 right-[38%] w-24 h-24 rounded-full opacity-35 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:10px_10px]" />

          {/* Dotted Halftone Pattern 2 (Bottom Mid) */}
          <div className="absolute bottom-24 right-[52%] w-28 h-28 rounded-full opacity-30 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:10px_10px]" />

          {/* Dotted Halftone Pattern 3 (Far Right) */}
          <div className="absolute top-1/2 right-16 w-32 h-32 rounded-full opacity-25 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:10px_10px]" />

          {/* Diagonal Light Streak Lines */}
          <div className="absolute top-1/4 right-[25%] w-64 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent transform -rotate-45" />
          <div className="absolute top-1/3 right-[15%] w-80 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -rotate-45" />
          <div className="absolute bottom-1/3 right-[35%] w-48 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent transform -rotate-45" />

          {/* Floating Hollow Geometric Circles */}
          <div className="absolute top-48 right-[32%] w-8 h-8 rounded-full border border-white/25" />
          <div className="absolute bottom-40 right-[40%] w-6 h-6 rounded-full border border-white/20" />
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* TOP NAVIGATION BAR (Exact layout from reference image) */}
        {/* ----------------------------------------------------------------------- */}
        <header className="relative z-30 w-full px-4 sm:px-6 lg:px-16 py-4 sm:py-6 flex items-center justify-between gap-2 max-w-full">
          {/* Left: Official Brand Logo */}
          <div className="shrink-0">
            <BrandLogo size="md" href="/" />
          </div>


          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
            <Link href="/" className="hover:text-white transition-colors font-semibold">
              Home
            </Link>
            <Link href="#housing" className="hover:text-white transition-colors">
              Housing
            </Link>
            <Link href="#marketplace" className="hover:text-white transition-colors">
              Market
            </Link>
            <Link href="#connect" className="hover:text-white transition-colors">
              Connect
            </Link>
            <Link href="#about" className="hover:text-white transition-colors">
              About
            </Link>
          </nav>

          {/* Right: Auth Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href="/signup">
              <button className="h-8 sm:h-10 px-3.5 sm:px-6 rounded-full bg-white text-[#1E1B4B] text-[11px] sm:text-xs font-bold shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="h-8 sm:h-10 px-3 sm:px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-bold border border-white/30 backdrop-blur-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                Log In
              </button>
            </Link>
          </div>
        </header>

        {/* ----------------------------------------------------------------------- */}
        {/* HERO BODY (Bold Headline, Subtitle, "Get Started", Carousel Dots) */}
        {/* ----------------------------------------------------------------------- */}
        <main className="relative z-20 px-6 lg:px-16 py-12 lg:py-16 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-pink-200" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-white">
                {currentSlide.tag}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.1] whitespace-pre-line">
              {currentSlide.headline}
            </h1>

            {/* Description Subtitle */}
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl font-normal">
              {currentSlide.description}
            </p>

            {/* Primary Action Button (White Pill style matching mockup "See More") */}
            <div className="pt-2 flex items-center gap-4">
              <Link href="/home">
                <button className="h-12 px-8 rounded-full bg-white text-[#1E1B4B] hover:bg-white/95 text-sm font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group">
                  <span>{currentSlide.cta}</span>
                  <ArrowRight className="h-4 w-4 text-[#1E1B4B] group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Interactive Carousel Pagination Dots (Matching mockup) */}
            <div className="flex items-center gap-2.5 pt-6">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 bg-white shadow-glow-magenta/60"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </main>

        {/* Bottom Ambient Glow Bar */}
        <div className="h-4 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full" />
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS & CAMPUS TRUST RIBBON */}
      {/* ========================================================================= */}
      <section className="bg-[#120F24] border-y border-white/10 py-6 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">500+</div>
            <div className="text-xs text-text-muted">Verified Campus Lodges</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-magenta-light">₦0</div>
            <div className="text-xs text-text-muted">Hidden Agent & Agreement Fees</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-violet-light">96%</div>
            <div className="text-xs text-text-muted">Roommate Compatibility Rate</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-400">100%</div>
            <div className="text-xs text-text-muted">Student-Verified Profiles</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE 3 CORE PILLARS — BALANCED 3-COLUMN CAMPUS GRID */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-xs font-bold uppercase tracking-wider text-brand-violet-light">
            <Building2 className="h-3.5 w-3.5" />
            <span>The Campus Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
            Everything Built For Real Campus Life.
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            No overpriced street agents. No scam deposits in WhatsApp groups. Just verified accommodation, peer-to-peer student deals, and flatmate matching.
          </p>
        </div>

        {/* 3 Pillar Cards in Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: Student Housing */}
          <div id="housing" className="rounded-3xl bg-[#16122C] border border-white/10 hover:border-brand-violet/40 transition-all p-5 flex flex-col justify-between space-y-5 group">
            <div className="space-y-4">
              {/* Photo Container */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E193C] via-[#2A1D4E] to-[#141029] flex items-center justify-center border border-white/10">
                {/* Fallback Graphic (rendered natively so it NEVER fails) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none pointer-events-none">
                  <div className="h-12 w-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 text-brand-violet-light flex items-center justify-center mb-2 shadow-inner">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">Campus Lodge Suite</span>
                  <span className="text-[10px] text-text-dim">Fully Tiled • Prepaid Meter • Water</span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&auto=format&fit=crop&q=80"
                  alt=""
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-bold text-white shadow">
                    Verified Host
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20">
                    No Agent Fee
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#0B0819]/90 backdrop-blur-md text-xs font-extrabold text-white border border-white/20">
                    ₦180,000 / yr
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-dim">
                  <span className="font-semibold text-brand-violet-light">Self Contain</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <MapPin className="h-3 w-3 text-brand-magenta" />
                    500m to North Gate
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  Modern Self Contain with Prepaid Meter
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  Running borehole water, fenced compound with night security, walking distance to lecture theaters.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2 text-[11px] text-text-secondary border-t border-white/10 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Physical inspection booking before payment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Direct contact with lodge host via WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Zero hidden agency or agreement charges</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link href="/housing" className="block w-full">
                <button className="w-full py-3 px-4 rounded-full bg-white/[0.08] hover:bg-brand-violet text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/15 hover:border-transparent cursor-pointer">
                  <span>Explore Campus Housing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: Campus Marketplace */}
          <div id="marketplace" className="rounded-3xl bg-[#16122C] border border-white/10 hover:border-brand-magenta/40 transition-all p-5 flex flex-col justify-between space-y-5 group">
            <div className="space-y-4">
              {/* Photo Container */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#271333] via-[#3B1948] to-[#180E24] flex items-center justify-center border border-white/10">
                {/* Fallback Graphic */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none pointer-events-none">
                  <div className="h-12 w-12 rounded-2xl bg-brand-magenta/20 border border-brand-magenta/40 text-brand-magenta-light flex items-center justify-center mb-2 shadow-inner">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">Campus Tech & Gadgets</span>
                  <span className="text-[10px] text-text-dim">Verified Student Seller • Daylight Meetup</span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80"
                  alt=""
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-magenta/90 text-[10px] font-bold text-white shadow">
                    Student Verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20">
                    Computers
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#0B0819]/90 backdrop-blur-md text-xs font-extrabold text-white border border-white/20">
                    ₦260,000
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-dim">
                  <span className="font-semibold text-brand-magenta-light">Like New • Mint</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <MapPin className="h-3 w-3 text-brand-magenta" />
                    Hostel Block B
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  Apple MacBook Pro M1 8GB/256GB
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  Sold by John D. (300L Computer Science). Pristine condition, battery health 91%, comes with charger.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2 text-[11px] text-text-secondary border-t border-white/10 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Meet safely in broad daylight on campus</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>In-app chat & direct seller WhatsApp link</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Zero commission fees. 100% student pricing</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link href="/market" className="block w-full">
                <button className="w-full py-3 px-4 rounded-full bg-white/[0.08] hover:bg-brand-magenta text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/15 hover:border-transparent cursor-pointer">
                  <span>Browse Student Marketplace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 3: Connect & Roommates */}
          <div id="connect" className="rounded-3xl bg-[#16122C] border border-white/10 hover:border-brand-blue/40 transition-all p-5 flex flex-col justify-between space-y-5 group">
            <div className="space-y-4">
              {/* Match Profile Preview */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#1E1B4B] border border-white/10 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-violet/40 text-[10px] font-bold text-white border border-brand-violet/50 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-brand-magenta-light" />
                    94% Vibe Match
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">FU Wukari</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center text-white font-extrabold text-sm border-2 border-brand-magenta shadow shrink-0">
                    <span>SE</span>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt=""
                      onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Stephen E.</h4>
                    <p className="text-[10px] text-text-secondary">300L Computer Science</p>
                    <p className="text-[9px] text-emerald-300 font-semibold">Looking for Quiet Flatmate</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] text-white">🌙 Night Owl</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] text-white">📚 Silent Study</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] text-white">🎧 Afrobeats</span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-dim">
                  <span className="font-semibold text-brand-blue-light">Roommate Matching</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    High Compatibility
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  Match Flatmates Who Share Your Schedule
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  Answer 10 quick lifestyle questions. Connect with course mates and future roommates who match your energy and hygiene standards.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2 text-[11px] text-text-secondary border-t border-white/10 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>2-minute lifestyle, sleep & study habits quiz</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Avoid bad roommates before signing tenancy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Privacy-protected student verified profiles</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link href="/connect" className="block w-full">
                <button className="w-full py-3 px-4 rounded-full bg-white/[0.08] hover:bg-brand-blue text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/15 hover:border-transparent cursor-pointer">
                  <span>Start 2-Min Vibe Quiz</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REAL PROBLEM SOLVER: CAMPSNEST VS STREET AGENTS */}
      {/* ========================================================================= */}
      <section className="bg-[#120F24] border-y border-white/10 py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Why Students Rely on CampsNest
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Campus life in Nigeria has enough challenges. Finding a decent room or selling your mini-fridge shouldn&apos;t be one of them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#16122C] border border-white/10 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                ₦0
              </div>
              <h3 className="text-base font-bold text-white">No Agent Exploitation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Offline agents charge up to ₦30,000 to ₦50,000 for &quot;agreement and agency commission&quot;. On CampsNest, you deal directly with the property host or student tenant with zero middleman markup.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#16122C] border border-white/10 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Inspect Before You Pay</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Never send money blindly into a WhatsApp account. Book verified daylight inspections at the hostel gate to verify prepaid meters, running borehole, and security before closing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#16122C] border border-white/10 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-violet/20 border border-brand-violet/30 text-brand-violet-light flex items-center justify-center font-bold text-sm">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Verified Campus Community</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every host, seller, and roommate is tagged with their Nigerian university and faculty. Chat directly on WhatsApp or in-app with real students on your own campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ACTIVE UNIVERSITY CAMPUSES */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 space-y-6 text-center">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-text-dim">
            Serving University Students Nationwide
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Available Across Top Nigerian Campuses
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {CAMPUS_LIST.slice(0, 10).map((campus) => (
            <Link
              key={campus.id}
              href="/housing"
              className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-text-secondary hover:text-white transition-all flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-violet shrink-0" />
              <span>{campus.name}</span>
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-text-dim">
          Switch your campus from the header anytime to filter local hostels and items near your school gate.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 6. REFINED CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-[#181333] border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white">
              Ready for a Simpler Campus Life?
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Join thousands of university students discovering verified lodges, trading gear without fees, and finding compatible flatmates.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/signup">
              <button className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-white text-[#120F24] text-xs sm:text-sm font-bold shadow-xl hover:bg-white/95 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Create Free Account
              </button>
            </Link>
            <Link href="/home">
              <button className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-bold border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Explore App Feed
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER */}
      {/* ========================================================================= */}
      <footer id="about" className="border-t border-white/10 bg-[#0E0C1C] py-10 px-4 sm:px-6 lg:px-12 text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <BrandLogo size="sm" showSlogan href="/" />
            <p className="text-[11px] text-text-dim">
              The all-in-one student superapp for Nigerian university campuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-text-secondary text-xs">
            <Link href="/housing" className="hover:text-white transition-colors">Campus Housing</Link>
            <Link href="/market" className="hover:text-white transition-colors">Marketplace</Link>
            <Link href="/connect" className="hover:text-white transition-colors">Roommate Quiz</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <div className="text-[11px] text-text-dim text-center md:text-right">
            © {new Date().getFullYear()} CampsNest. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
