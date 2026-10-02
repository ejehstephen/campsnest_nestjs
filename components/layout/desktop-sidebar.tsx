"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Building2, 
  ShoppingBag, 
  Users, 
  UserCircle2, 
  Sparkles,
  Radio
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/common/brand-logo";


const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Housing", href: "/housing", icon: Building2 },
  { label: "Market", href: "/market", icon: ShoppingBag },
  { label: "Connect", href: "/connect", icon: Users },
  { label: "Profile", href: "/profile", icon: UserCircle2 },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#0E0B1F]/95 backdrop-blur-2xl z-40 p-5 justify-between select-none">
      {/* Top Section: Official Brand Logo */}
      <div className="space-y-8">
        <BrandLogo
          size="md"
          showBadge
          badgeText="2.0 HUB"
          showSlogan
          href="/"
          className="hover:scale-[1.02] transition-transform"
        />


        {/* Navigation Routes */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-150 select-none group",
                  isActive
                    ? "bg-brand-violet text-white font-bold"
                    : "text-text-muted hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-white" : "text-text-muted group-hover:text-white"
                )} />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Live Feed Badge & Legal Links */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-text-secondary">Campus Live Feed</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
            Active
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-medium">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          <span>•</span>
          <span>© 2026</span>
        </div>
      </div>
    </aside>
  );
}
