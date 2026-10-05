"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Image as ImageIcon, 
  ShieldCheck, 
  CheckCheck, 
  ShoppingBag, 
  Building2, 
  Heart, 
  Sparkles,
  MapPin,
  Clock,
  Mic,
  Info,
  Check,
  Play,
  Video
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { INITIAL_MATCH_PROFILES } from "@/lib/connect/constants";
import { dispatchNotification } from "@/lib/notifications/service";
import { 
  sendMessageAction, 
  fetchConversationMessagesAction,
  fetchListingDetailsAction,
  fetchConversationThreadAction
} from "@/lib/messages/actions";
import { createClient } from "@/lib/supabase/client";
import { isVideoUrl, sanitizeUUID } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-provider";


interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  image?: string;
}

function ChatThreadContent() {
  const { profile, user } = useAuth();
  const currentUserId = profile?.id || user?.id;
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawId = typeof params?.id === "string" ? params.id : "1";
  const cleanId = sanitizeUUID(rawId);

  // Query parameters
  const queryContext = searchParams.get("context") as "market" | "housing" | "connect" | null;
  const queryName = searchParams.get("name");
  const queryTitle = searchParams.get("title");
  const queryPrice = searchParams.get("price");
  const queryImage = searchParams.get("image");
  const queryRole = searchParams.get("role");
  const queryAvatar = searchParams.get("avatar");

  const matchCandidate = INITIAL_MATCH_PROFILES.find((m) => m.id === rawId || `c-${m.id}` === rawId);

  const [liveListing, setLiveListing] = React.useState<{
    title?: string;
    price?: number;
    sellerOrHostName?: string;
    sellerAvatar?: string;
    imageUrl?: string;
    isVideo?: boolean;
  }>({});
  const [imgError, setImgError] = React.useState(false);

  // Fetch real listing details from Supabase if an ID is present
  React.useEffect(() => {
    if (rawId.startsWith("h-") || rawId.startsWith("m-") || queryContext === "housing" || queryContext === "market") {
      const type = (rawId.startsWith("h-") || queryContext === "housing") ? "housing" : "market";
      fetchListingDetailsAction(cleanId, type).then((res) => {
        if (res.title || res.imageUrl || res.sellerOrHostName) {
          setLiveListing(res);
        }
      });
    }
  }, [cleanId, rawId, queryContext]);

  const [dbThread, setDbThread] = React.useState<{
    id: string;
    title: string;
    type: "market" | "housing" | "connect";
    participantName: string;
    participantRole: string;
    participantAvatar: string;
  } | null>(null);

  // Fetch thread details from Supabase if opening directly by UUID
  React.useEffect(() => {
    fetchConversationThreadAction(cleanId).then((res) => {
      if (res.success && res.thread) {
        setDbThread(res.thread);
      }
    });
  }, [cleanId]);

  // Clean title helper if title is a phone number
  const formatDisplayTitle = (rawTitle?: string | null, fallback = "Campus Accommodation") => {
    if (!rawTitle) return fallback;
    if (/^\+?[0-9\s-]{7,16}$/.test(rawTitle.trim())) {
      return "Executive Student Lodge";
    }
    return rawTitle;
  };

  // Determine thread configuration
  const thread = React.useMemo(() => {
    // 1. Connect candidate profile
    if (matchCandidate) {
      return {
        user: {
          name: matchCandidate.name,
          role: `${matchCandidate.dept} • ${matchCandidate.level}`,
          avatar: matchCandidate.avatar || "",
          online: true,
          statusText: "online • FU Wukari",
        },
        context: {
          type: "connect" as const,
          title: matchCandidate.intent === "dating" ? "Campus Romance Match 💖" : "Roommate Co-Lease Match 🏡",
          subtitle: `${matchCandidate.matchPercent}% Synergy • ${matchCandidate.location}`,
          image: matchCandidate.avatar || undefined,
          isVideo: false,
        },
        suggestedPrompts: [
          matchCandidate.icebreaker,
          "Are you free for a quick chat at the cafeteria?",
          "When are you looking to inspect rooms together?",
          "What's your favorite study spot on campus?"
        ],
      };
    }

    // 2. Dynamic Housing Thread
    if (queryContext === "housing" || dbThread?.type === "housing" || rawId.startsWith("h-")) {
      const rawTitle = liveListing.title || queryTitle || dbThread?.title;
      const hTitle = formatDisplayTitle(rawTitle, "Campus Accommodation");
      const hHost = liveListing.sellerOrHostName || queryName || dbThread?.participantName || "Property Host";
      const hPrice = liveListing.price ? `₦${liveListing.price.toLocaleString()}/yr` : queryPrice ? `₦${Number(queryPrice).toLocaleString()}/yr` : "₦200,000/yr";
      const hMedia = liveListing.imageUrl || (queryImage && !queryImage.startsWith("data:") ? queryImage : "");
      const isVid = liveListing.isVideo || isVideoUrl(hMedia);

      return {
        user: {
          name: hHost,
          role: queryRole || dbThread?.participantRole || "Verified Property Host",
          avatar: liveListing.sellerAvatar || queryAvatar || dbThread?.participantAvatar || "",
          online: true,
          statusText: "online • Quick Responder",
        },
        context: {
          type: "housing" as const,
          title: hTitle,
          subtitle: "Direct Lodge Host • Zero Agent Fee",
          price: hPrice,
          image: hMedia,
          isVideo: isVid,
        },
        suggestedPrompts: [
          `Hi ${hHost}, is this room still available for inspection?`,
          "Can I inspect the room tomorrow morning?",
          "Is running water and prepaid light 24/7 in the lodge?",
          "What is the total caution and agreement fee?"
        ],
      };
    }

    // 3. Dynamic Market Thread
    if (queryContext === "market" || dbThread?.type === "market" || rawId.startsWith("m-")) {
      const rawTitle = liveListing.title || queryTitle || dbThread?.title;
      const mTitle = formatDisplayTitle(rawTitle, "Marketplace Item");
      const mSeller = liveListing.sellerOrHostName || queryName || dbThread?.participantName || "Marketplace Seller";
      const mPrice = liveListing.price ? `₦${liveListing.price.toLocaleString()}` : queryPrice ? `₦${Number(queryPrice).toLocaleString()}` : "₦35,000";
      const mImage = liveListing.imageUrl || (queryImage && !queryImage.startsWith("data:") ? queryImage : "");

      return {
        user: {
          name: mSeller,
          role: queryRole || dbThread?.participantRole || "Verified Student Seller",
          avatar: liveListing.sellerAvatar || queryAvatar || dbThread?.participantAvatar || "",
          online: true,
          statusText: "online • On Campus",
        },
        context: {
          type: "market" as const,
          title: mTitle,
          subtitle: "Verified Student Deal • Safe Meetup",
          price: mPrice,
          image: mImage,
          isVideo: false,
        },
        suggestedPrompts: [
          `Hi ${mSeller}, is this ${mTitle} still available?`,
          "Is the price negotiable for quick cash pickup?",
          "Can we meet at University Library Quad or North Gate?",
          "Does it have any minor defects or issues?"
        ],
      };
    }

    // Fallback dynamic thread from DB or query
    const fallbackName = queryName || dbThread?.participantName || "Student Resident";
    const fallbackTitle = formatDisplayTitle(queryTitle || dbThread?.title, "Campus Conversation");
    const fallbackRole = queryRole || dbThread?.participantRole || "Verified Campus Member";
    const fallbackAvatar = queryAvatar || dbThread?.participantAvatar || "";

    return {
      user: {
        name: fallbackName,
        role: fallbackRole,
        avatar: fallbackAvatar,
        online: true,
        statusText: "online • FU Wukari",
      },
      context: {
        type: (queryContext || dbThread?.type || "connect") as "market" | "housing" | "connect",
        title: fallbackTitle,
        subtitle: queryPrice ? `₦${Number(queryPrice).toLocaleString()}` : "Direct Safe Chat",
        price: queryPrice ? `₦${Number(queryPrice).toLocaleString()}` : undefined,
        image: queryImage || undefined,
        isVideo: false,
      },
      suggestedPrompts: [
        `Hi ${fallbackName}, is this still available?`,
        "Can we arrange a meetup on campus?",
        "Are you free for a quick chat today?",
      ],
    };
  }, [cleanId, rawId, matchCandidate, queryContext, queryName, queryTitle, queryPrice, queryImage, queryRole, queryAvatar, liveListing, dbThread]);

// In-memory module cache for instant (0ms) chat thread rendering
const globalChatMessagesCache = new Map<string, Message[]>();

  const [messages, setMessages] = React.useState<Message[]>(
    () => globalChatMessagesCache.get(cleanId) || []
  );
  const [inputText, setInputText] = React.useState("");
  const [showPromptBar, setShowPromptBar] = React.useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(
    () => !globalChatMessagesCache.has(cleanId)
  );
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  // Load real messages from Supabase database in the background
  React.useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      if (!globalChatMessagesCache.has(cleanId)) {
        setIsLoadingMessages(true);
      }

      try {
        const res = await fetchConversationMessagesAction(cleanId);
        if (res.success && res.messages && res.messages.length > 0) {
          const mapped = res.messages.map((m) => {
            const isMe = currentUserId ? m.sender_id === currentUserId : false;
            return {
              id: m.id,
              sender: isMe ? ("me" as const) : ("them" as const),
              text: m.text,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              status: (m.is_read ? "read" : "sent") as "read" | "sent",
              image: m.image_url || undefined,
            };
          });

          globalChatMessagesCache.set(cleanId, mapped);
          if (isMounted) {
            setMessages(mapped);
          }
        } else if (isMounted && !globalChatMessagesCache.has(cleanId)) {
          setMessages([]);
        }
      } catch (e) {
        if (isMounted && !globalChatMessagesCache.has(cleanId)) {
          setMessages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadMessages();

    return () => {
      isMounted = false;
    };

    // Setup Supabase real-time listener for incoming messages
    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`messages:${cleanId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${cleanId}`,
          },
          (payload: any) => {
            const newMsg = payload.new;
            if (newMsg) {
              setMessages((prev) => {
                // Avoid duplicating optimistic messages
                if (prev.some((m) => m.id === newMsg.id || (m.text === newMsg.text && Math.abs(Date.now() - new Date(newMsg.created_at).getTime()) < 3000))) {
                  return prev;
                }
                const isMe = currentUserId ? newMsg.sender_id === currentUserId : false;
                return [
                  ...prev,
                  {
                    id: newMsg.id,
                    sender: isMe ? "me" : "them",
                    text: newMsg.text,
                    time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    status: newMsg.is_read ? "read" : "sent",
                    image: newMsg.image_url || undefined,
                  },
                ];
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Realtime subscription notice:", err);
    }
  }, [cleanId, currentUserId]);

  // Sync with localStorage thread summary
  const persistConversationSummary = React.useCallback((lastMsg: string) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("campsnest_dynamic_conversations");
      const existing: any[] = raw ? JSON.parse(raw) : [];
      const currentConv = {
        id: cleanId,
        name: thread.user.name,
        role: thread.user.role,
        avatar: thread.user.avatar,
        lastMessage: lastMsg,
        time: "Just now",
        unread: 0,
        context: {
          type: thread.context.type,
          title: thread.context.title,
        },
      };

      const updated = [currentConv, ...existing.filter((c) => c.id !== cleanId)];
      localStorage.setItem("campsnest_dynamic_conversations", JSON.stringify(updated));
    } catch (e) {
      console.warn("Error saving conversation:", e);
    }
  }, [cleanId, thread]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!textToSend) setInputText("");
    persistConversationSummary(text.trim());

    // Asynchronously write to Supabase database action & notify recipient
    sendMessageAction({
      conversationId: cleanId,
      text: text.trim(),
      contextType: thread.context.type,
      contextTitle: thread.context.title,
      senderName: "Me",
    }).catch((err) => console.warn("Supabase send message background sync:", err));
  };

  const ContextIcon =
    thread.context.type === "market"
      ? ShoppingBag
      : thread.context.type === "housing"
      ? Building2
      : Heart;

  return (
    <div className="-mx-3.5 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4.5rem)] flex flex-col bg-[#120D26] overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. WHATSAPP STYLE HEADER BAR */}
      {/* ========================================================================= */}
      <header className="px-4 py-3 bg-[#181333] border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-20">
        
        {/* Left: Back Arrow + Avatar + User Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/messages")}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative shrink-0">
            <Avatar size="md" src={thread.user.avatar} name={thread.user.name} alt={thread.user.name} glow online={thread.user.online} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">{thread.user.name}</h2>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            </div>
            <p className="text-[11px] text-text-dim truncate">{thread.user.statusText}</p>
          </div>
        </div>

        {/* Right Actions: Safety Badge */}
        <div className="flex items-center gap-1.5 text-white/80 shrink-0">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Verified Student</span>
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CONTEXT BANNER STRIP (Listing / Video Tour Thumbnail) */}
      {/* ========================================================================= */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-[#1C163D] via-[#161230] to-[#120D26] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          
          {/* Robust Video / Photo Thumbnail Container */}
          <div className="relative h-11 w-11 rounded-2xl overflow-hidden bg-brand-violet/20 border border-white/15 flex items-center justify-center shrink-0 shadow-md">
            {thread.context.isVideo || (thread.context.image && isVideoUrl(thread.context.image)) ? (
              <div className="relative h-full w-full bg-black flex items-center justify-center">
                {thread.context.image ? (
                  <video
                    src={thread.context.image}
                    className="h-full w-full object-cover pointer-events-none opacity-80"
                    muted
                    preload="metadata"
                    playsInline
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-md">
                    <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            ) : thread.context.image && !imgError ? (
              <img
                src={thread.context.image}
                alt={thread.context.title}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <ContextIcon className="h-5 w-5 text-brand-violet-light" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">{thread.context.title}</span>
              {thread.context.price && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-magenta text-white shrink-0">
                  {thread.context.price}
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-dim truncate flex items-center gap-1">
              {thread.context.isVideo && <Video className="h-3 w-3 text-rose-400" />}
              <span>{thread.context.subtitle}</span>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/[0.06] text-brand-violet-light border border-white/10 shrink-0">
          In-App Safe DM 🛡️
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 3. CHAT MESSAGES BODY */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
        
        {/* Safety Banner Notice */}
        <div className="max-w-md mx-auto p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-1">
          <p className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
            <span>🛡️</span> CampsNest Student Safety Notice
          </p>
          <p className="text-[10px] text-text-dim leading-relaxed">
            Keep chats in-app. Never send advance rent or gadget payments before physical meetup on campus.
          </p>
        </div>

        {/* Clean Welcoming Prompt for New Inquiries */}
        {messages.length === 0 && !isLoadingMessages && (
          <div className="py-12 text-center max-w-sm mx-auto space-y-3">
            <div className="h-14 w-14 rounded-3xl bg-brand-violet/20 border border-brand-violet/30 mx-auto flex items-center justify-center text-2xl shadow-glow-violet/20">
              💬
            </div>
            <p className="text-sm font-bold text-white">Start the conversation</p>
            <p className="text-xs text-text-dim leading-relaxed">
              Send an inquiry message to <span className="text-white font-semibold">{thread.user.name}</span> about &quot;{thread.context.title}&quot;. Tap a quick prompt below or type your message.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender === "me";

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <Avatar
                  size="sm"
                  src={thread.user.avatar}
                  name={thread.user.name}
                  alt={thread.user.name}
                  className="mb-1 shrink-0 h-8 w-8 text-[10px] ring-2 ring-white/10"
                />
              )}

              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[70%]`}>
                {/* Sender label for other person so the user always knows who chatted */}
                {!isMe && (
                  <span className="text-[11px] font-bold text-brand-violet-light px-2 mb-1 flex items-center gap-1.5">
                    <span>{thread.user.name}</span>
                    <span className="text-[9px] font-normal text-text-dim">• {thread.user.role}</span>
                  </span>
                )}

                <div
                  className={`w-full rounded-3xl p-3.5 space-y-1.5 shadow-lg ${
                    isMe
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-br-xs shadow-[0_4px_16px_rgba(139,92,246,0.25)]"
                      : "bg-[#1E183D] border border-white/15 text-slate-100 rounded-bl-xs"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Attached media"
                      className="rounded-2xl max-h-56 w-full object-cover border border-white/10"
                    />
                  )}

                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>

                  <div className={`flex items-center gap-1 justify-end text-[10px] ${isMe ? "text-white/80" : "text-text-dim"}`}>
                    <span>{msg.time}</span>
                    {isMe && (
                      <CheckCheck className={`h-3.5 w-3.5 ${msg.status === "read" ? "text-cyan-300" : "text-white/60"}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={chatBottomRef} />
      </div>

      {/* ========================================================================= */}
      {/* 4. CONTEXTUAL PROMPT SUGGESTION CHIPS */}
      {/* ========================================================================= */}
      {showPromptBar && thread.suggestedPrompts?.length > 0 && (
        <div className="px-4 py-2 bg-[#16112E]/90 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 select-none">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-violet-light shrink-0">
            <Sparkles className="h-3 w-3" />
            <span>Quick Prompts:</span>
          </div>

          {thread.suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-[11px] font-medium text-white whitespace-nowrap transition-all active:scale-95 shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MESSAGE INPUT BAR */}
      {/* ========================================================================= */}
      <footer className="p-3 sm:p-4 bg-[#181333] border-t border-white/10 flex items-center gap-2 shrink-0 z-20">
        <button
          title="Attach image"
          onClick={() => alert("Photo attachment ready!")}
          className="p-2.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type a message or offer..."
          className="flex-1 py-2.5 px-4 rounded-full bg-white/[0.05] border border-white/10 text-xs text-white placeholder:text-text-dim focus:outline-none focus:border-brand-violet/60"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="p-3 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta hover:brightness-110 disabled:opacity-40 text-white shadow-glow-magenta/40 transition-all active:scale-95 flex items-center justify-center shrink-0"
        >
          <Send className="h-4 w-4 fill-white" />
        </button>
      </footer>

    </div>
  );
}

export default function ChatThreadPage() {
  return (
    <AppShell>
      <React.Suspense fallback={<div className="p-8 text-center text-xs text-text-dim">Loading conversation...</div>}>
        <ChatThreadContent />
      </React.Suspense>
    </AppShell>
  );
}
