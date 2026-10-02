"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Bell, 
  Heart, 
  Building2, 
  ShoppingBag, 
  ShieldCheck, 
  MessageSquare, 
  CheckCheck, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  Zap,
  Volume2
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  AppNotification, 
  getStoredNotifications, 
  syncNotificationsWithSupabase,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  requestPushPermission 
} from "@/lib/notifications/service";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [pushStatus, setPushStatus] = React.useState<string>("default");
  const [isLoading, setIsLoading] = React.useState(true);

  const loadNotifications = React.useCallback(async () => {
    // 1. Load instant local cache
    setNotifications(getStoredNotifications());
    // 2. Fetch live data from Supabase and synchronize
    const synced = await syncNotificationsWithSupabase();
    setNotifications(synced);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadNotifications();

    if (typeof window !== "undefined" && "Notification" in window) {
      setPushStatus(Notification.permission);
    }

    const handleNewNotif = () => {
      setNotifications(getStoredNotifications());
    };

    window.addEventListener("campsnest:notification_received", handleNewNotif);
    return () => {
      window.removeEventListener("campsnest:notification_received", handleNewNotif);
    };
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(getStoredNotifications());
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
    setNotifications(getStoredNotifications());
  };

  const handleEnablePush = async () => {
    const result = await requestPushPermission();
    if (result !== "unsupported") {
      setPushStatus(result);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "unread") return !n.read;
    return n.category === filterCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vibe":
        return { icon: Heart, bg: "bg-brand-magenta/20 border-brand-magenta/40 text-brand-magenta-light" };
      case "housing":
        return { icon: Building2, bg: "bg-brand-violet/20 border-brand-violet/40 text-brand-violet-light" };
      case "market":
        return { icon: ShoppingBag, bg: "bg-brand-blue/20 border-brand-blue/40 text-brand-blue-light" };
      case "security":
        return { icon: ShieldCheck, bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" };
      default:
        return { icon: MessageSquare, bg: "bg-purple-500/20 border-purple-500/40 text-purple-300" };
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto pb-20 animate-fade-in-up">
        
        {/* ========================================================================= */}
        {/* 1. HEADER BANNER */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E153B] via-[#16112E] to-[#110D26] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2.5">
                <span>Campus Alerts</span>
                <span className="text-2xl">🔔</span>
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-brand-magenta text-xs font-extrabold text-white shadow-glow-magenta/60">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Real-time alerts for roommate waves, inspection passes, and marketplace inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pushStatus === "default" && (
              <button
                onClick={handleEnablePush}
                className="px-3.5 py-2 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta hover:brightness-110 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Enable Push Alerts</span>
              </button>
            )}

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
              >
                <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY FILTER TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 select-none">
          {[
            { id: "all", label: "All Activity" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "vibe", label: "💖 Vibe Waves" },
            { id: "housing", label: "🏠 Inspections" },
            { id: "market", label: "🏷️ Market Deals" },
            { id: "security", label: "🛡️ Security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                filterCategory === tab.id
                  ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white border-transparent shadow-lg"
                  : "bg-white/[0.04] hover:bg-white/[0.09] text-text-secondary hover:text-white border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 3. NOTIFICATIONS FEED */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#141029]/40 border border-white/10 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-2xl">
                ✨
              </div>
              <p className="text-sm font-bold text-white">All caught up!</p>
              <p className="text-xs text-text-dim max-w-sm mx-auto">
                No new alerts in this category. You will be notified when roommates wave or hosts update inspections.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const { icon: Icon, bg: iconBg } = getCategoryIcon(notif.category);

              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    !notif.read
                      ? "bg-gradient-to-r from-[#1D1438]/90 via-[#18112C]/90 to-[#120D24]/90 border-brand-violet/40 shadow-glow-violet/20"
                      : "bg-[#141029]/50 hover:bg-[#141029]/80 border-white/10"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-11 w-11 rounded-2xl border ${iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{notif.title}</span>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-brand-magenta animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                        {notif.description}
                      </p>
                      <div className="text-[10px] text-text-dim pt-0.5 font-medium">
                        {notif.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {notif.actionUrl && notif.actionText && (
                      <Link 
                        href={notif.actionUrl}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <button className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-brand-violet/30 border border-white/15 hover:border-brand-violet/40 text-xs font-bold text-white transition-all flex items-center gap-1.5 group">
                          <span>{notif.actionText}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-brand-magenta group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </Link>
                    )}

                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      title="Delete notification"
                      className="p-2 rounded-full hover:bg-white/[0.08] text-text-dim hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </AppShell>
  );
}
