"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  MessageSquare
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-provider";
import { getStoredNotifications } from "@/lib/notifications/service";
import { BrandLogo } from "@/components/common/brand-logo";

export function HeaderTopBar() {
  const { profile } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [unreadNotifs, setUnreadNotifs] = React.useState(2);

  const updateNotifCount = React.useCallback(() => {
    if (typeof window !== "undefined") {
      const list = getStoredNotifications();
      setUnreadNotifs(list.filter((n) => !n.read).length);
    }
  }, []);

  React.useEffect(() => {
    setMounted(true);
    updateNotifCount();

    const handleNotif = () => updateNotifCount();
    window.addEventListener("campsnest:notification_received", handleNotif);
    return () => {
      window.removeEventListener("campsnest:notification_received", handleNotif);
    };
  }, [updateNotifCount]);

  const userAvatar = mounted && profile?.profile_image && !profile.profile_image.includes("example.com") && profile.profile_image.trim() !== ""
    ? profile.profile_image
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  const userInitials = mounted && profile?.name
    ? profile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SE";

  return (
    <header className="sticky top-0 z-30 w-full max-w-[100vw] border-b border-white/10 bg-[#0E0B1F]/90 backdrop-blur-2xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto w-full min-w-0">
        
        {/* Left: Brand / Mobile Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <div className="lg:hidden shrink-0">
            <BrandLogo size="xs" href="/home" />
          </div>
        </div>

        {/* Center: Global Search Bar (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search rooms, items, textbooks, or vibes..."
              className="w-full h-10 rounded-full border border-white/15 bg-white/[0.04] pl-10 pr-4 text-xs text-white placeholder:text-text-dim backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right: Messages, Notifications, Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Chat Bubble */}
          <Link
            href="/messages"
            className="p-2 sm:p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-text-secondary hover:text-white transition-colors relative"
            title="Messages"
          >
            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>

          {/* Notifications Bell */}
          <Link
            href="/notifications"
            className="p-2 sm:p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-text-secondary hover:text-white transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-brand-magenta text-[8px] sm:text-[9px] font-bold text-white flex items-center justify-center shadow-glow-magenta/80">
                {unreadNotifs}
              </span>
            )}
          </Link>

          {/* User Mini Avatar */}
          <Link href="/profile" className="pl-0.5">
            <Avatar
              size="sm"
              fallback={userInitials}
              src={userAvatar}
              online
              glow
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
