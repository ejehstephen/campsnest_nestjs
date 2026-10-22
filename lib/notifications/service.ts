"use client";

import { 
  createNotificationAction, 
  fetchUserNotificationsAction,
  markNotificationReadAction,
  deleteNotificationAction,
  markAllNotificationsReadAction
} from "./actions";

export interface AppNotification {
  id: string;
  category: "vibe" | "housing" | "market" | "security" | "message";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: number;
}

const STORAGE_KEY = "campsnest_notifications";
const LAST_DAILY_REMINDER_KEY = "campsnest_last_daily_reminder_timestamp";
const DAILY_REMINDER_INDEX_KEY = "campsnest_daily_reminder_index";

/**
 * Register Service Worker for true background Web Push Notifications
 */
export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch (err) {
    console.warn("Service Worker registration notice:", err);
    return null;
  }
}

/**
 * Trigger native OS / Browser Push Notification via Service Worker or Desktop Notification API
 */
export async function showSystemPushNotification(params: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
}) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  const title = params.title;
  const url = params.url || "/notifications";
  const icon = params.icon || "/campsnest-logo.png";
  const options: NotificationOptions = {
    body: params.body,
    icon: icon,
    badge: icon,
    tag: params.tag || "campsnest-alert",
    data: { url },
  };

  try {
    if (Notification.permission === "granted") {
      // 1. Try Service Worker (required for Android Chrome, iOS Safari, PWA)
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && "showNotification" in reg) {
          await reg.showNotification(title, options);
          return;
        }
      }
      // 2. Desktop Notification fallback
      new Notification(title, options);
    } else if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          if (reg && "showNotification" in reg) {
            await reg.showNotification(title, options);
            return;
          }
        }
        new Notification(title, options);
      }
    }
  } catch (e) {
    console.warn("System push notification error:", e);
  }
}

/**
 * Get all stored notifications from localStorage with fallback defaults.
 */
export function getStoredNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Error reading notifications:", e);
    return [];
  }
}

/**
 * Synchronize notifications from Supabase and merge with local storage.
 */
export async function syncNotificationsWithSupabase(): Promise<AppNotification[]> {
  try {
    const res = await fetchUserNotificationsAction();
    if (res.success && res.notifications && res.notifications.length > 0) {
      const dbMapped: AppNotification[] = res.notifications.map((n) => {
        let cat: AppNotification["category"] = "message";
        const t = (n.type || "").toLowerCase();
        if (t.includes("vibe") || t.includes("wave") || t.includes("connect") || t.includes("match")) cat = "vibe";
        else if (t.includes("house") || t.includes("housing") || t.includes("inspect") || t.includes("room")) cat = "housing";
        else if (t.includes("market") || t.includes("offer") || t.includes("deal") || t.includes("product")) cat = "market";
        else if (t.includes("secur") || t.includes("badge") || t.includes("verif")) cat = "security";

        return {
          id: n.id,
          category: cat,
          title: n.title,
          description: n.body,
          timestamp: new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: Boolean(n.is_read),
          actionUrl: n.action_url || (cat === "housing" ? "/housing" : cat === "market" ? "/market" : cat === "vibe" ? "/connect" : "/profile"),
          actionText: n.action_text || "View Details",
          createdAt: new Date(n.created_at).getTime(),
        };
      });

      // Merge with local storage
      if (typeof window !== "undefined") {
        const local = getStoredNotifications();
        const merged = [...dbMapped];
        local.forEach((item) => {
          if (!merged.some((m) => m.id === item.id)) {
            merged.push(item);
          }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return dbMapped;
    }
  } catch (e) {
    console.warn("Supabase notification sync fallback:", e);
  }

  return getStoredNotifications();
}

/**
 * Dispatch a new notification across in-app state, Supabase database, and browser Web Push Notification.
 */
export function dispatchNotification(
  notification: Omit<AppNotification, "id" | "timestamp" | "read" | "createdAt">,
  targetUserId?: string
): AppNotification {
  const newNotif: AppNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: "Just now",
    read: false,
    createdAt: Date.now(),
  };

  // 1. Persist to Supabase in background
  createNotificationAction({
    userId: targetUserId,
    title: newNotif.title,
    body: newNotif.description,
    type: newNotif.category,
    actionUrl: newNotif.actionUrl,
    actionText: newNotif.actionText,
  }).catch((err) => console.warn("Background Supabase notification error:", err));

  // 2. Persist to local state & dispatch custom event
  if (typeof window !== "undefined") {
    try {
      const existing = getStoredNotifications();
      const updated = [newNotif, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Trigger a custom event for live reactive updates across tabs/components
      window.dispatchEvent(new CustomEvent("campsnest:notification_received", { detail: newNotif }));

      // Trigger true system push notification via Service Worker / Native Notification API
      showSystemPushNotification({
        title: newNotif.title,
        body: newNotif.description,
        url: newNotif.actionUrl || "/notifications",
        tag: `notif-${newNotif.category}`
      });
    } catch (e) {
      console.warn("Failed to persist notification:", e);
    }
  }

  return newNotif;
}

/**
 * Daily Reminder Messages catalog for campus marketplace engagement
 */
const DAILY_REMINDERS = [
  {
    type: "sell",
    title: "📢 Turn Unused Hostel Gear into Cash!",
    description: "Got textbooks, a fan, kitchenware, or gadgets you don't use? List them on Campus Marketplace in 60 seconds and get cash from students nearby.",
    actionUrl: "/market?action=sell",
    actionText: "Post an Item Now"
  },
  {
    type: "buy",
    title: "🛍️ Fresh Campus Deals Just Dropped!",
    description: "Check today's verified student laptops, smartphones, and hostel essentials at student-friendly prices. Beat market inflation today!",
    actionUrl: "/market",
    actionText: "Browse Student Deals"
  },
  {
    type: "sell",
    title: "💰 Need Quick Pocket Money This Week?",
    description: "Declutter your room! Someone in your hostel or department is looking to buy your fairly-used electronics or textbooks.",
    actionUrl: "/market?action=sell",
    actionText: "Sell Item in 1 Min"
  },
  {
    type: "buy",
    title: "⚡ Verified Student Accommodation & Gear",
    description: "Students are listing affordable hostels, self-contains, and study gadgets today. Take a quick look before they get taken!",
    actionUrl: "/market",
    actionText: "Explore Marketplace"
  }
];

/**
 * Checks if 24 hours have passed since the last daily reminder.
 * If yes, dispatches an authentic push notification & in-app reminder.
 */
export function checkAndTriggerDailyMarketplaceReminder(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const lastTimestampStr = localStorage.getItem(LAST_DAILY_REMINDER_KEY);
    const now = Date.now();
    const TWENTY_HOURS_MS = 20 * 60 * 60 * 1000;

    if (lastTimestampStr) {
      const lastTime = parseInt(lastTimestampStr, 10);
      if (now - lastTime < TWENTY_HOURS_MS) {
        return false; // Already sent today
      }
    }

    // Determine which reminder to show next (rotate index)
    const currentIndex = parseInt(localStorage.getItem(DAILY_REMINDER_INDEX_KEY) || "0", 10);
    const reminder = DAILY_REMINDERS[currentIndex % DAILY_REMINDERS.length];

    // Dispatch the daily push reminder
    dispatchNotification({
      category: "market",
      title: reminder.title,
      description: reminder.description,
      actionUrl: reminder.actionUrl,
      actionText: reminder.actionText,
    });

    // Update timestamp and next index
    localStorage.setItem(LAST_DAILY_REMINDER_KEY, now.toString());
    localStorage.setItem(DAILY_REMINDER_INDEX_KEY, ((currentIndex + 1) % DAILY_REMINDERS.length).toString());

    return true;
  } catch (err) {
    console.warn("Could not check daily reminder:", err);
    return false;
  }
}

/**
 * Manually trigger a daily reminder for instant testing or user-initiated preview.
 */
export function triggerTestDailyReminder(forceType?: "sell" | "buy"): AppNotification {
  const chosen = forceType 
    ? DAILY_REMINDERS.find((r) => r.type === forceType) || DAILY_REMINDERS[0]
    : DAILY_REMINDERS[Math.floor(Math.random() * DAILY_REMINDERS.length)];

  return dispatchNotification({
    category: "market",
    title: chosen.title,
    description: chosen.description,
    actionUrl: chosen.actionUrl,
    actionText: chosen.actionText,
  });
}

/**
 * Mark notification as read both locally and in Supabase.
 */
export async function markNotificationAsRead(id: string) {
  if (typeof window !== "undefined") {
    const list = getStoredNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("campsnest:notification_received"));
  }
  await markNotificationReadAction(id).catch((e) => console.warn(e));
}

/**
 * Mark all notifications as read both locally and in Supabase.
 */
export async function markAllNotificationsAsRead() {
  if (typeof window !== "undefined") {
    const list = getStoredNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("campsnest:notification_received"));
  }
  await markAllNotificationsReadAction().catch((e) => console.warn(e));
}

/**
 * Delete a notification both locally and in Supabase.
 */
export async function deleteNotification(id: string) {
  if (typeof window !== "undefined") {
    const list = getStoredNotifications().filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("campsnest:notification_received"));
  }
  await deleteNotificationAction(id).catch((e) => console.warn(e));
}

/**
 * Request browser push notification permission and register service worker.
 */
export async function requestPushPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  try {
    await registerPushServiceWorker();
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Show instant confirmation push notification
      await showSystemPushNotification({
        title: "Push Alerts Activated! 🔔",
        body: "You will now receive instant alerts for roommate waves, inspection passes, and daily campus marketplace deals.",
        url: "/notifications",
        tag: "campsnest-activated"
      });
    }
    return permission;
  } catch (e) {
    return "denied";
  }
}
