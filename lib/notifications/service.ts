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

      // Request and display browser push notification if permitted
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(newNotif.title, {
            body: newNotif.description,
            icon: "/icon.svg",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification(newNotif.title, {
                body: newNotif.description,
                icon: "/icon.svg",
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("Failed to persist notification:", e);
    }
  }

  return newNotif;
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
 * Request browser push notification permission.
 */
export async function requestPushPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return "denied";
  }
}
