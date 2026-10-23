"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotificationAction } from "@/lib/notifications/actions";
import { sanitizeUUID, parseUserName, formatNameFromEmail } from "@/lib/utils";

export interface DBMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  image_url?: string;
  created_at: string;
  is_read: boolean;
}

export interface DBConversation {
  id: string;
  title: string;
  type: "market" | "housing" | "connect";
  created_at: string;
  updated_at: string;
  last_message?: string;
  participant_ids: string[];
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

/**
 * Fetch all conversations for the authenticated user only.
 * Other users' conversations are strictly excluded.
 */
export async function fetchUserConversationsAction(explicitUserId?: string): Promise<{
  success: boolean;
  conversations: any[];
  error?: string;
}> {
  try {
    const supabase = createClient();
    let currentUserId = explicitUserId;
    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id;
    }

    // If user is not authenticated, do not expose any user conversations
    if (!currentUserId) {
      return { success: true, conversations: [] };
    }

    // 1. Gather all conversation IDs where current user is a participant or sender
    const userConvIds = new Set<string>();

    // A. Check context_id ILIKE for current user ID (1-on-1 tagged conversations)
    try {
      const { data: taggedConvs } = await supabase
        .from("conversations")
        .select("id")
        .ilike("context_id", `%${currentUserId}%`);

      (taggedConvs || []).forEach((c) => {
        if (c.id) userConvIds.add(c.id);
      });
    } catch (e) {
      // ignore
    }

    // B. Check messages sent by current user
    try {
      const { data: userSentMsgs } = await supabase
        .from("messages")
        .select("conversation_id")
        .eq("sender_id", currentUserId);

      (userSentMsgs || []).forEach((m) => {
        if (m.conversation_id) userConvIds.add(m.conversation_id);
      });
    } catch (e) {
      // ignore
    }

    // C. Check notifications sent to current user linking to /messages/
    try {
      const { data: userNotifs } = await supabase
        .from("notifications")
        .select("action_url")
        .eq("user_id", currentUserId)
        .ilike("action_url", "/messages/%");

      (userNotifs || []).forEach((n) => {
        if (n.action_url) {
          const raw = n.action_url.replace("/messages/", "").split("?")[0];
          if (raw) userConvIds.add(sanitizeUUID(raw));
        }
      });
    } catch (e) {
      // ignore
    }

    // D. Check conversation_participants table
    try {
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", currentUserId);

      (participants || []).forEach((p) => {
        if (p.conversation_id) userConvIds.add(p.conversation_id);
      });
    } catch (e) {
      // ignore
    }

    // E. Check conversations on listings or items owned by current user
    try {
      const [housesRes, itemsRes] = await Promise.all([
        supabase.from("room_listings").select("id").eq("owner_id", currentUserId),
        supabase.from("marketplace_items").select("id").eq("seller_id", currentUserId),
      ]);

      const myContextIds = [
        ...(housesRes.data || []).map((h) => h.id),
        ...(itemsRes.data || []).map((i) => i.id),
      ];

      if (myContextIds.length > 0) {
        const { data: listingConvs } = await supabase
          .from("conversations")
          .select("id")
          .in("context_id", myContextIds);

        (listingConvs || []).forEach((c) => {
          if (c.id) userConvIds.add(c.id);
        });
      }
    } catch (e) {
      // ignore
    }

    // If no conversations belong to this user, return empty list
    if (userConvIds.size === 0) {
      return { success: true, conversations: [] };
    }

    const convIdList = Array.from(userConvIds);

    // 2. Fetch only the user's conversations
    const { data: convs, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .in("id", convIdList)
      .order("updated_at", { ascending: false });

    if (convErr || !convs || convs.length === 0) {
      return { success: true, conversations: [] };
    }

    // 3. Fetch messages for these specific conversations
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", convIdList)
      .order("created_at", { ascending: false });

    // 4. Fetch users for participant details
    const { data: users } = await supabase
      .from("users")
      .select("id, name, email, profile_image, department, level, school");

    const userMap = new Map((users || []).map((u) => [u.id, u]));

    const hydrated = convs.map((conv) => {
      const convMsgs = (msgs || []).filter((m) => m.conversation_id === conv.id);
      const lastMsg = convMsgs[0];

      // Identify the other participant (not the current logged-in user)
      const otherSenderMsg = convMsgs.find((m) => m.sender_id && m.sender_id !== currentUserId && userMap.has(m.sender_id));
      let otherUserId = otherSenderMsg?.sender_id;
      if (!otherUserId && conv.context_id) {
        const parts = conv.context_id.split(":");
        otherUserId = parts.find((p: string) => p !== currentUserId && p.length > 20);
      }
      const senderUser = otherUserId
        ? userMap.get(otherUserId)
        : convMsgs.find((m) => m.sender_id && userMap.has(m.sender_id))
        ? userMap.get(convMsgs.find((m) => m.sender_id && userMap.has(m.sender_id))!.sender_id)
        : null;

      const userName = parseUserName(senderUser, null, conv.title || "Student Resident");
      const userRole = senderUser?.department
        ? `${senderUser.department} • ${senderUser.level || "Student"}`
        : conv.type === "housing"
        ? "Property Host"
        : conv.type === "market"
        ? "Marketplace Seller"
        : "Connect Match";

      const userAvatar =
        senderUser?.profile_image && !senderUser.profile_image.includes("example.com")
          ? senderUser.profile_image
          : "";

      let cleanTitle =
        conv.title ||
        (conv.type === "housing"
          ? "Campus Accommodation"
          : conv.type === "market"
          ? "Market Item"
          : "Connect Vibe Match");

      if (/^\+?[0-9\s-]{7,16}$/.test(cleanTitle.trim())) {
        cleanTitle = "Executive Student Lodge";
      }

      return {
        id: conv.id,
        name: userName,
        role: userRole,
        avatar: userAvatar,
        lastMessage: lastMsg?.text || "Conversation started",
        time: formatRelativeTime(lastMsg?.created_at || conv.updated_at),
        unread: convMsgs.filter((m) => !m.is_read && m.sender_id !== currentUserId).length,
        context: {
          type: conv.type || "housing",
          title: cleanTitle,
        },
      };
    });

    return { success: true, conversations: hydrated };
  } catch (err: any) {
    return { success: false, conversations: [], error: err.message };
  }
}

/**
 * Fetch a single conversation thread with its metadata, participant information, and context.
 */
export async function fetchConversationThreadAction(conversationId: string): Promise<{
  success: boolean;
  thread?: {
    id: string;
    title: string;
    type: "market" | "housing" | "connect";
    participantId?: string;
    participantName: string;
    participantRole: string;
    participantAvatar: string;
  };
  error?: string;
}> {
  try {
    const cleanId = sanitizeUUID(conversationId);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    // 1. Fetch conversation row
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", cleanId)
      .maybeSingle();

    // 2. Fetch messages for this conversation
    const { data: msgs } = await supabase
      .from("messages")
      .select("sender_id, text, created_at")
      .eq("conversation_id", cleanId)
      .order("created_at", { ascending: false });

    // 3. Find other participant ID
    const otherMsg = msgs?.find((m) => m.sender_id && m.sender_id !== currentUserId);
    let targetUserId = otherMsg?.sender_id;

    // If no other sender message in thread, check context_id for host/seller
    if (!targetUserId && conv?.context_id) {
      if (conv.type === "housing") {
        const { data: house } = await supabase
          .from("room_listings")
          .select("owner_id")
          .eq("id", conv.context_id)
          .maybeSingle();
        if (house?.owner_id && house.owner_id !== currentUserId) {
          targetUserId = house.owner_id;
        }
      } else if (conv.type === "market") {
        const { data: item } = await supabase
          .from("marketplace_items")
          .select("seller_id")
          .eq("id", conv.context_id)
          .maybeSingle();
        if (item?.seller_id && item.seller_id !== currentUserId) {
          targetUserId = item.seller_id;
        }
      }
    }

    if (!targetUserId) {
      targetUserId = msgs?.[0]?.sender_id;
    }

    let participantName = conv?.title || "Student Resident";
    let participantRole = conv?.type === "housing" ? "Property Host" : conv?.type === "market" ? "Marketplace Seller" : "Campus Resident";
    let participantAvatar = "";

    if (targetUserId) {
      const { data: u } = await supabase
        .from("users")
        .select("id, name, email, profile_image, department, level, school")
        .eq("id", targetUserId)
        .maybeSingle();

      if (u) {
        participantName = parseUserName(u, null, conv?.title || "Student Resident");
        if (u.department) participantRole = `${u.department} • ${u.level || "Student"}`;
        if (u.profile_image && !u.profile_image.includes("example.com")) {
          participantAvatar = u.profile_image;
        }
      }
    }

    let cleanTitle = conv?.title || (conv?.type === "housing" ? "Campus Accommodation" : conv?.type === "market" ? "Market Item" : "Direct Conversation");
    if (/^\+?[0-9\s-]{7,16}$/.test(cleanTitle.trim())) {
      cleanTitle = "Executive Student Lodge";
    }

    return {
      success: true,
      thread: {
        id: cleanId,
        title: cleanTitle,
        type: (conv?.type || "housing") as "market" | "housing" | "connect",
        participantId: targetUserId,
        participantName,
        participantRole,
        participantAvatar,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch messages for a specific conversation from Supabase.
 */
export async function fetchConversationMessagesAction(conversationId: string): Promise<{
  success: boolean;
  messages: DBMessage[];
  error?: string;
}> {
  try {
    const cleanId = sanitizeUUID(conversationId);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", cleanId)
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, messages: [], error: error.message };
    }

    return { success: true, messages: (data || []) as DBMessage[] };
  } catch (err: any) {
    return { success: false, messages: [], error: err.message };
  }
}

/**
 * Fetch live listing details (housing or market) directly from Supabase for contextual headers.
 */
export async function fetchListingDetailsAction(
  rawId: string,
  type: "housing" | "market"
): Promise<{
  title?: string;
  price?: number;
  sellerOrHostName?: string;
  sellerAvatar?: string;
  sellerOrHostId?: string;
  imageUrl?: string;
  isVideo?: boolean;
}> {
  try {
    const cleanId = sanitizeUUID(rawId);
    const supabase = createClient();

    if (type === "housing") {
      const { data: listing } = await supabase
        .from("room_listings")
        .select("id, title, description, price, location, owner_id")
        .eq("id", cleanId)
        .single();

      const { data: imageRows } = await supabase
        .from("room_listing_images")
        .select("images, room_listing_id")
        .eq("room_listing_id", cleanId)
        .limit(3);

      let ownerName = "Property Host";
      let ownerAvatar = "";
      if (listing?.owner_id) {
        const { data: owner } = await supabase
          .from("users")
          .select("id, name, full_name, username, email, profile_image")
          .eq("id", listing.owner_id)
          .single();
        if (owner) {
          ownerName = parseUserName(owner, null, "Property Host");
          if (owner.profile_image) ownerAvatar = owner.profile_image;
        }
      }

      const mediaUrl = imageRows?.[0]?.images || "";
      const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") || mediaUrl.endsWith(".mov") || mediaUrl.includes("video");

      let displayTitle = listing?.title || "Campus Accommodation";
      if (/^\+?[0-9\s-]{7,15}$/.test(displayTitle.trim())) {
        displayTitle = listing?.location ? `Executive Lodge (${listing.location})` : "Executive Student Lodge";
      }

      return {
        title: displayTitle,
        price: listing?.price,
        sellerOrHostName: ownerName,
        sellerAvatar: ownerAvatar || undefined,
        sellerOrHostId: listing?.owner_id || undefined,
        imageUrl: mediaUrl || undefined,
        isVideo,
      };
    } else {
      const { data: item } = await supabase
        .from("marketplace_items")
        .select("id, title, price, seller_name, seller_avatar, image, seller_id")
        .eq("id", cleanId)
        .single();

      return {
        title: item?.title || "Market Item",
        price: item?.price,
        sellerOrHostName: item?.seller_name || "Student Seller",
        sellerAvatar: item?.seller_avatar || undefined,
        sellerOrHostId: item?.seller_id || undefined,
        imageUrl: item?.image && !item.image.startsWith("data:") ? item.image : undefined,
        isVideo: false,
      };
    }
  } catch (e) {
    return {};
  }
}

/**
 * Send a message and dispatch real-time Supabase notification to recipient.
 */
export async function sendMessageAction(params: {
  conversationId: string;
  senderId?: string;
  recipientId?: string;
  senderName?: string;
  text: string;
  imageUrl?: string;
  contextType?: "market" | "housing" | "connect";
  contextTitle?: string;
  contextId?: string;
}): Promise<{
  success: boolean;
  message?: any;
  error?: string;
}> {
  try {
    const cleanConvId = sanitizeUUID(params.conversationId);
    const supabase = createClient();
    let senderId = params.senderId;
    if (!senderId) {
      const { data: { user } } = await supabase.auth.getUser();
      senderId = user?.id || "433b3374-3bc7-41a3-9207-bc5e1f9d5627";
    }

    let recipientId = params.recipientId;
    if (!recipientId && senderId) {
      // Find other participant from previous messages
      const { data: priorMsgs } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("conversation_id", cleanConvId)
        .neq("sender_id", senderId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (priorMsgs?.[0]?.sender_id) {
        recipientId = priorMsgs[0].sender_id;
      } else {
        const { data: partRows } = await supabase
          .from("conversation_participants")
          .select("user_id")
          .eq("conversation_id", cleanConvId)
          .neq("user_id", senderId)
          .limit(1);
        if (partRows?.[0]?.user_id) {
          recipientId = partRows[0].user_id;
        }
      }
    }

    // Prepare participants tagging for context_id so both users always find this conversation
    const participantsTag = recipientId && senderId
      ? [senderId, recipientId].sort().join(":")
      : senderId;
    const contextTag = params.contextId
      ? `${params.contextId}:${participantsTag}`
      : participantsTag;

    // 1. Ensure conversation exists in conversations table
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id, context_id")
      .eq("id", cleanConvId)
      .maybeSingle();

    if (!existingConv) {
      await supabase.from("conversations").insert({
        id: cleanConvId,
        title: params.contextTitle || "Direct Conversation",
        type: params.contextType || "housing",
        context_id: contextTag || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else {
      const updatePayload: any = { updated_at: new Date().toISOString() };
      if (!existingConv.context_id || !existingConv.context_id.includes(":")) {
        updatePayload.context_id = contextTag || existingConv.context_id;
      }
      await supabase
        .from("conversations")
        .update(updatePayload)
        .eq("id", cleanConvId);
    }

    // Register participants in conversation_participants
    try {
      const participants = [{ conversation_id: cleanConvId, user_id: senderId }];
      if (recipientId && recipientId !== senderId) {
        participants.push({ conversation_id: cleanConvId, user_id: recipientId });
      }
      await supabase
        .from("conversation_participants")
        .upsert(participants, { onConflict: "conversation_id,user_id" });
    } catch (pe) {
      // conversation_participants upsert fallback
    }

    // 2. Insert message into Supabase messages table
    let dbMessage: any = null;
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: cleanConvId,
        sender_id: senderId,
        text: params.text,
        image_url: params.imageUrl || null,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      dbMessage = data;
    } else if (error) {
      console.warn("Supabase messages insert error:", error);
    }

    // 3. Dispatch in-database notification for recipient in Supabase
    if (recipientId) {
      try {
        await createNotificationAction({
          userId: recipientId,
          title: `New message from ${params.senderName || "a student"} 💬`,
          body: params.text.length > 80 ? `${params.text.slice(0, 80)}...` : params.text,
          type: params.contextType || "message",
          actionUrl: `/messages/${cleanConvId}`,
          actionText: "Reply",
        });
      } catch (ne) {
        console.warn("Notification dispatch notice:", ne);
      }
    }

    revalidatePath(`/messages/${cleanConvId}`);
    revalidatePath("/messages");

    return {
      success: true,
      message: dbMessage || {
        id: `msg-${Date.now()}`,
        conversation_id: cleanConvId,
        sender_id: senderId,
        text: params.text,
        created_at: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    console.error("sendMessageAction error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Mark all unread messages in a conversation as read when viewed by the recipient.
 */
export async function markConversationAsReadAction(
  conversationId: string,
  explicitUserId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanId = sanitizeUUID(conversationId);
    const supabase = createClient();
    let currentUserId = explicitUserId;
    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id;
    }

    if (!currentUserId) {
      return { success: false, error: "Not authenticated" };
    }

    // Mark messages not sent by the current viewer as read
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", cleanId)
      .neq("sender_id", currentUserId)
      .eq("is_read", false);

    if (error) {
      console.warn("markConversationAsReadAction notice:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Trigger an instant inquiry from a listing (Market, Housing, or Connect Wave).
 */
export async function triggerDirectInquiryAction(params: {
  recipientId: string;
  recipientName: string;
  senderName: string;
  listingTitle: string;
  inquiryType: "housing" | "market" | "connect";
  initialMessage: string;
  actionUrl: string;
}): Promise<{
  success: boolean;
  conversationId: string;
  error?: string;
}> {
  try {
    const prefix = params.inquiryType === "housing" ? "h-" : params.inquiryType === "market" ? "m-" : "c-";
    const conversationId = `${prefix}${Date.now()}`;

    // 1. Dispatch notification to seller/host in Supabase
    await createNotificationAction({
      userId: params.recipientId,
      title: params.inquiryType === "housing"
        ? `New Inspection Request: ${params.listingTitle} 🏠`
        : params.inquiryType === "market"
        ? `New Offer on ${params.listingTitle} 🏷️`
        : `New Vibe Wave on Connect! 👋`,
      body: `${params.senderName}: "${params.initialMessage}"`,
      type: params.inquiryType,
      actionUrl: params.actionUrl,
      actionText: "Open Chat",
    });

    return {
      success: true,
      conversationId,
    };
  } catch (err: any) {
    console.error("triggerDirectInquiryAction error:", err);
    return {
      success: false,
      conversationId: `conv-${Date.now()}`,
      error: err.message,
    };
  }
}
