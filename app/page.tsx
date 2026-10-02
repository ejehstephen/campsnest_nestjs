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
      <section className="bg-canvas-card border-y border-white/10 py-8 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">500+</div>
            <div className="text-xs text-text-muted">Verified Campus Hostels</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-magenta-light">₦0</div>
            <div className="text-xs text-text-muted">Marketplace Listing Fees</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-violet-light">96%</div>
            <div className="text-xs text-text-muted">Roommate Compatibility Rate</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-400">100%</div>
            <div className="text-xs text-text-muted">Student KYC Verified</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE ECOSYSTEM PILLARS (Housing 2.0, Marketplace, Connect) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-20 space-y-24">
        
        {/* Pillar 1: Housing 2.0 */}
        <section id="housing" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-violet-light text-xs font-bold uppercase">
              <Building2 className="h-3.5 w-3.5" />
              <span>Campus Accommodation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Student Housing Without <br />
              <span className="bg-gradient-to-r from-brand-violet-light to-brand-magenta-light bg-clip-text text-transparent">
                The Agents Hassle.
              </span>
            </h2>

            <p className="text-sm text-text-secondary leading-relaxed">
              Skip overpriced agent runs. Search student-friendly self-contains, single rooms, and shared apartments near your campus gate. Inspect physically with host verification before paying rent.
            </p>

            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Verified physical inspection bookings with verified hosts.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Filters for distance to lecture halls, prepaid light & security.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero hidden agency fees. Strict student safety protocols.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/home">
                <Button variant="primary" size="default">
                  <span>Enter Housing Hub</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <GlassCard elevation="elevated" glow="violet" className="p-5 space-y-4">
              <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&auto=format&fit=crop&q=80"
                  alt="Hostel Room"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="verified" dot>Verified Host</Badge>
                  <Badge variant="success">Available Now</Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-3.5 py-1 rounded-full bg-canvas-midnight/90 backdrop-blur-md text-xs font-extrabold text-white border border-white/20">
                    {formatCurrency(180000)} / year
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-text-dim">
                  <span className="font-semibold text-brand-violet-light">Self Contain</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-brand-magenta" />
                    500m from North Gate
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">Modern Self Contain with Prepaid Meter</h4>
                <p className="text-xs text-text-secondary">24/7 Security Guard, Running Borehole Water, Clean Compound.</p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Pillar 2: Campus Marketplace */}
        <section id="marketplace" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <GlassCard elevation="elevated" glow="magenta" className="p-5 space-y-4">
              <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80"
                  alt="Gadget"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="vibe">Like New</Badge>
                  <Badge variant="default">Computers</Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-3.5 py-1 rounded-full bg-canvas-midnight/90 backdrop-blur-md text-xs font-extrabold text-white border border-white/20">
                    {formatCurrency(260000)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-text-dim">
                  <span className="font-semibold text-brand-magenta-light">MacBook Pro M1</span>
                  <span>Hostel Block B</span>
                </div>
                <h4 className="text-base font-bold text-white">Apple MacBook Pro 8GB/256GB</h4>
                <p className="text-xs text-text-secondary">Sold by John D. (300L Computer Science) • In-app Chat</p>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-magenta/20 border border-brand-magenta/40 text-brand-magenta-light text-xs font-bold uppercase">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Campus Marketplace</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Buy & Sell With Students <br />
              <span className="bg-gradient-to-r from-brand-magenta-light to-brand-blue-light bg-clip-text text-transparent">
                Right On Your Campus.
              </span>
            </h2>

            <p className="text-sm text-text-secondary leading-relaxed">
              Moving out? Upgrading your phone? Need textbooks or hostel fans? List items in 60 seconds and meet safely in daylight on campus.
            </p>

            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero commission. Keep 100% of your selling price.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Verified student badge with department and university tagging.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>In-app buyer/seller messaging with context badges.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/home">
                <Button variant="secondary" size="default">
                  <span>Browse Campus Market</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pillar 3: Connect & Vibe Matching */}
        <section id="connect" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-violet/20 to-brand-magenta/20 border border-brand-magenta/40 text-brand-magenta-light text-xs font-bold uppercase">
              <Heart className="h-3.5 w-3.5" />
              <span>CampsNest Connect</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Find Flatmates & Friends <br />
              <span className="bg-gradient-to-r from-brand-violet-light via-brand-magenta-light to-brand-blue-light bg-clip-text text-transparent">
                Who Match Your Vibe.
              </span>
            </h2>

            <p className="text-sm text-text-secondary leading-relaxed">
              Answer 10 fun questions about your study habits, sleep schedule, music tastes, and weekend routine. Our algorithm finds students you will genuinely click with.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="vibe">🎧 Afrobeats</Badge>
              <Badge variant="default">🌙 Night Owl</Badge>
              <Badge variant="default">📚 Silent Study</Badge>
              <Badge variant="default">☕ Coffee Lover</Badge>
            </div>

            <div className="pt-2">
              <Link href="/home">
                <Button variant="primary" size="default">
                  <span>Take 2-Min Vibe Quiz</span>
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <GlassCard elevation="elevated" glow="blue" className="p-6 space-y-5 border-white/20">
              <div className="flex items-center justify-between">
                <Badge variant="vibe" dot>94% Match ✨</Badge>
                <span className="text-xs font-bold text-brand-violet-light">Top Tier Affinity</span>
              </div>

              <div className="flex items-center gap-4">
                <Avatar
                  size="xl"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  glow
                  online
                  className="h-16 w-16"
                />
                <div>
                  <h4 className="text-base font-bold text-white">Stephen E.</h4>
                  <p className="text-xs text-text-secondary">300L Computer Science • FUW</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">Looking for Quiet Flatmate</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 text-xs text-text-secondary">
                <span className="font-bold text-white">Why you connect: </span>
                You both code late at night, listen to Burna Boy, and prefer library quiet floors.
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-text-dim">Roommate Sync: High</span>
                <Link href="/home">
                  <Button variant="primary" size="sm" className="text-xs">
                    Connect 💕
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* 4. FINAL CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="px-6 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 border border-white/20 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Ready to Upgrade Your Campus Life?
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Join thousands of university students discovering better housing, peer marketplace deals, and roommate matches.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/home">
              <button className="h-12 px-8 rounded-full bg-white text-[#1E1B4B] text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
                Enter CampsNest 2.0
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER */}
      {/* ========================================================================= */}
      <footer id="about" className="border-t border-white/10 bg-canvas-card/80 py-10 px-6 lg:px-16 text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" showSlogan href="/" />

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-purple-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-pink-300 transition-colors">Terms of Service</Link>
            <span>•</span>
            <span>© {new Date().getFullYear()} CampsNest</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
