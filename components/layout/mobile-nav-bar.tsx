"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ShoppingBag, Users, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Housing", href: "/housing", icon: Building2 },
  { label: "Market", href: "/market", icon: ShoppingBag },
  { label: "Connect", href: "/connect", icon: Users },
  { label: "Profile", href: "/profile", icon: UserCircle2 },
];

export function MobileNavBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 px-1 pt-1.5 pb-safe bg-[#0E0B1F]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.8)] w-full max-w-[100vw] overflow-hidden">
      <div className="grid grid-cols-5 items-center justify-items-center w-full max-w-md mx-auto h-13">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full py-1 px-0.5 rounded-xl transition-all duration-150 relative select-none active:scale-95",
                isActive
                  ? "text-white"
                  : "text-text-muted hover:text-white"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-150",
                  isActive
                    ? "bg-brand-violet/20 text-brand-violet-light font-semibold"
                    : "text-text-muted"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-[10px] font-semibold tracking-tight truncate max-w-full text-center mt-0.5",
                isActive ? "text-white font-bold" : "text-text-muted"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

