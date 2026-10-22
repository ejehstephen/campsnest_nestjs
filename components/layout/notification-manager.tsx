"use client";

import * as React from "react";
import { Bell, Sparkles, X, Volume2, ShoppingBag } from "lucide-react";
import { 
  registerPushServiceWorker, 
  requestPushPermission, 
  checkAndTriggerDailyMarketplaceReminder,
  syncNotificationsWithSupabase,
  triggerTestDailyReminder
} from "@/lib/notifications/service";

const DISMISSED_BANNER_KEY = "campsnest_push_banner_dismissed_until";

export function NotificationManager() {
  const [mounted, setMounted] = React.useState(false);
  const [permission, setPermission] = React.useState<string>("default");
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // 1. Register Service Worker on mount
    registerPushServiceWorker();

    // 2. Sync notifications from Supabase
    syncNotificationsWithSupabase();

    // 3. Check and trigger automated daily marketplace reminder (once per 24h)
    checkAndTriggerDailyMarketplaceReminder();

    // 4. Check push notification permission status
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);

      if (Notification.permission === "default") {
        const dismissedUntil = localStorage.getItem(DISMISSED_BANNER_KEY);
        const now = Date.now();
        if (!dismissedUntil || now > parseInt(dismissedUntil, 10)) {
          // Delay showing prompt slightly for a smooth non-intrusive onboarding experience
          const timer = setTimeout(() => setShowPrompt(true), 2500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, []);

  const handleEnablePush = async () => {
    const res = await requestPushPermission();
    if (res !== "unsupported") {
      setPermission(res);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== "undefined") {
      // Dismiss prompt for 3 days
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      localStorage.setItem(DISMISSED_BANNER_KEY, (Date.now() + threeDaysMs).toString());
    }
  };

  if (!mounted || !showPrompt || permission !== "default") {
    return null;
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 max-w-sm w-full animate-fade-in-up">
      <div className="relative p-4 rounded-3xl bg-[#15102A]/95 border border-brand-violet/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-white space-y-3 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-brand-violet/30 via-brand-magenta/20 to-transparent blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-magenta flex items-center justify-center text-white shadow-md shrink-0">
              <Bell className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Enable Campus Alerts</h4>
                <span className="px-1.5 py-0.5 rounded-full bg-brand-magenta/20 text-brand-magenta-light text-[9px] font-extrabold uppercase">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">
                Never miss roommate waves, housing inspections & daily student marketplace deals.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-full text-text-dim hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center gap-2 pt-1">
          <button
            onClick={handleEnablePush}
            className="flex-1 py-2 px-3 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Turn On Alerts</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-text-dim hover:text-white text-xs font-medium transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
