import * as React from "react";
import Link from "next/link";
import { 
  Home as HomeIcon, 
  Search, 
  ShoppingBag, 
  Heart, 
  Compass, 
  ArrowLeft,
  Sparkles
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-6 animate-pulse">
          <Compass className="h-4 w-4 text-purple-400" />
          <span>404 · Room / Page Not Found</span>
        </div>

        {/* Big Headline */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Lost on Campus? 🏡
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mb-8 leading-relaxed">
          Looks like this hostel room, marketplace item, or profile link took a wrong turn or has already been taken.
        </p>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 gap-2.5 mb-8 text-left">
          <Link
            href="/housing"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-purple-600/15 border border-white/10 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <HomeIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Find Student Housing</p>
                <p className="text-[11px] text-slate-400">Search verified lodges & self-contain rooms</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400">Explore →</span>
          </Link>

          <Link
            href="/market"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-600/15 border border-white/10 hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Campus Marketplace</p>
                <p className="text-[11px] text-slate-400">Buy and sell student gadgets & books</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Shop →</span>
          </Link>

          <Link
            href="/connect"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-pink-600/15 border border-white/10 hover:border-pink-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Connect & Match</p>
                <p className="text-[11px] text-slate-400">Find compatible roommates & vibe matches</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-pink-400">Match →</span>
          </Link>
        </div>

        {/* Return Home Action */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CampsNest Home
        </Link>
      </div>
    </div>
  );
}
