"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, ShoppingBag, Building2, Heart, Search, Filter, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { sanitizeUUID } from "@/lib/utils";
import { fetchUserConversationsAction } from "@/lib/messages/actions";

export interface ConversationSummary {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  context: {
    type: "market" | "housing" | "connect";
    title: string;
  };
}

// In-memory module cache for instantaneous (0ms) render on back-navigation
let globalConversationsCache: ConversationSummary[] | null = null;

export default function MessagesPage() {
  const [conversations, setConversations] = React.useState<ConversationSummary[]>(
    () => globalConversationsCache || []
  );
  const [loading, setLoading] = React.useState(
    () => !globalConversationsCache || globalConversationsCache.length === 0
  );
  const [filterType, setFilterType] = React.useState<"all" | "market" | "housing" | "connect">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      // Only show full loader if cache is completely empty
      if (!globalConversationsCache || globalConversationsCache.length === 0) {
        setLoading(true);
      }

      try {
        // 1. Fetch live conversations from Supabase
        const dbRes = await fetchUserConversationsAction();
        const dbList: ConversationSummary[] = dbRes.success && dbRes.conversations ? dbRes.conversations : [];

        // 2. Read locally cached / offline dynamic conversations
        let localList: ConversationSummary[] = [];
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem("campsnest_dynamic_conversations");
          if (raw) {
            try {
              localList = JSON.parse(raw);
            } catch (e) {
              console.warn("Could not parse local conversations:", e);
            }
          }
        }

        // 3. Merge and deduplicate by clean UUID
        const deduplicatedMap = new Map<string, ConversationSummary>();

        // Insert local first, then override/merge with DB
        localList.forEach((thread) => {
          const cleanId = sanitizeUUID(thread.id);
          let cleanTitle = thread.context?.title || "Campus Accommodation";
          if (/^\+?[0-9\s-]{7,16}$/.test(cleanTitle.trim())) {
            cleanTitle = "Executive Student Lodge";
          }
          deduplicatedMap.set(cleanId, {
            ...thread,
            id: cleanId,
            context: {
              ...thread.context,
              title: cleanTitle,
            }
          });
        });

        dbList.forEach((thread) => {
          const cleanId = sanitizeUUID(thread.id);
          deduplicatedMap.set(cleanId, thread);
        });

        const mergedList = Array.from(deduplicatedMap.values());
        globalConversationsCache = mergedList;

        if (isMounted) {
          setConversations(mergedList);
        }
      } catch (err) {
        console.error("Error loading conversations:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    if (filterType !== "all" && conv.context.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        conv.name.toLowerCase().includes(q) ||
        conv.context.title.toLowerCase().includes(q) ||
        conv.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getContextIcon = (type: string) => {
    switch (type) {
      case "market":
        return ShoppingBag;
      case "housing":
        return Building2;
      default:
        return Heart;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto pb-20 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2.5">
              Messages & Inquiries <span className="text-2xl">💬</span>
            </h1>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, student names, or listings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-text-dim focus:outline-none focus:border-brand-violet/50"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Chats" },
              { id: "market", label: "🛒 Marketplace" },
              { id: "housing", label: "🏠 Housing" },
              { id: "connect", label: "💕 Connect" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  filterType === tab.id
                    ? "bg-brand-violet text-white border-transparent shadow-md"
                    : "bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-16 text-center rounded-3xl bg-[#141029]/40 border border-white/10 space-y-3 flex flex-col items-center justify-center">
              <Loader2 className="h-7 w-7 text-brand-violet-light animate-spin" />
              <p className="text-xs text-text-dim">Loading your conversations from database...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#141029]/40 border border-white/10 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-2xl">
                💬
              </div>
              <p className="text-sm font-bold text-white">No conversations found</p>
              <p className="text-xs text-text-dim max-w-sm mx-auto">
                Inquire on a house listing, chat with a marketplace seller, or send a vibe wave on Connect to start chatting!
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const ContextIcon = getContextIcon(conv.context.type);

              return (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}?context=${conv.context.type}&name=${encodeURIComponent(conv.name)}&title=${encodeURIComponent(conv.context.title)}&role=${encodeURIComponent(conv.role)}${conv.avatar && conv.avatar.startsWith("http") && conv.avatar.length < 300 ? `&avatar=${encodeURIComponent(conv.avatar)}` : ""}`}
                  className="block"
                >
                  <GlassCard
                    elevation="base"
                    interactive
                    glow={conv.context.type === "market" ? "magenta" : conv.context.type === "connect" ? "violet" : "blue"}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:scale-[1.005]"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar
                        size="lg"
                        src={conv.avatar}
                        name={conv.name}
                        alt={conv.name}
                        glow
                        online
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{conv.name}</span>
                          <span className="text-[11px] text-text-dim">• {conv.role}</span>
                        </div>

                        {/* Context Tag */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] text-brand-violet-light font-medium">
                          <ContextIcon className="h-3 w-3" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{conv.context.title}</span>
                        </div>

                        {/* Last Message Snippet */}
                        <p className="text-xs text-text-secondary line-clamp-1 pt-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-[11px] text-text-dim shrink-0">
                      <span>{conv.time}</span>
                      {conv.unread > 0 && (
                        <span className="h-5 w-5 rounded-full bg-brand-magenta text-white font-bold flex items-center justify-center text-[10px] shadow-glow-magenta/40">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </AppShell>
  );
}
