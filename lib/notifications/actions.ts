"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface DBNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
  action_text?: string;
}

/**
 * Fetch notifications for the currently logged in user from Supabase.
 */
export async function fetchUserNotificationsAction(): Promise<{
  success: boolean;
  notifications: DBNotification[];
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, notifications: [], error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Error querying notifications from Supabase:", error.message);
      return { success: false, notifications: [], error: error.message };
    }

    return {
      success: true,
      notifications: (data || []) as DBNotification[],
    };
  } catch (err: any) {
    console.error("fetchUserNotificationsAction error:", err);
    return { success: false, notifications: [], error: err.message };
  }
}

/**
 * Create a new notification directly in Supabase for a target user.
 */
export async function createNotificationAction(params: {
  userId?: string;
  title: string;
  body: string;
  type?: string;
  actionUrl?: string;
  actionText?: string;
}): Promise<{
  success: boolean;
  notification?: DBNotification;
  error?: string;
}> {
  try {
    const supabase = createClient();
    let targetUserId = params.userId;

    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      targetUserId = user?.id;
    }

    if (!targetUserId) {
      return { success: false, error: "No user ID available for notification" };
    }

    // Map categories to accepted notification types or default to 'system' / 'general'
    const notificationType = params.type || "system";

    const insertPayload: any = {
      user_id: targetUserId,
      title: params.title,
      body: params.body,
      type: notificationType,
      is_read: false,
    };

    const { data, error } = await supabase
      .from("notifications")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.warn("Supabase create notification error:", error.message);
      return { success: false, error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true, notification: data as DBNotification };
  } catch (err: any) {
    console.error("createNotificationAction error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Mark a single notification as read in Supabase.
 */
export async function markNotificationReadAction(notificationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Mark all notifications as read for current user in Supabase.
 */
export async function markAllNotificationsReadAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a notification from Supabase.
 */
export async function deleteNotificationAction(notificationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
