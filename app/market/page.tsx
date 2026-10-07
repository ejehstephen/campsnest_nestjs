"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  PlusCircle,
  Bookmark,
  MapPin,
  Clock,
  ShieldCheck,
  SlidersHorizontal,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Sun,
  ArrowRight,
  TrendingDown,
  Shield,
  Layers,
  HeartHandshake,
  Check,
  Share2,
  X,
  GraduationCap,
  Trash2,
  Loader2
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SellItemModal, PublishedItem } from "@/components/market/sell-item-modal";
import { ShareModal } from "@/components/common/share-modal";
import { fetchMarketItemsAction, deleteMarketItemAction } from "@/lib/market/actions";
import { useAuth } from "@/lib/auth/auth-provider";
import { CAMPUS_LIST } from "@/lib/constants";
import { MARKET_CATEGORIES, MARKET_PRODUCTS, MarketItem } from "@/lib/market/constants";

export default function MarketPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [selectedCampus, setSelectedCampus] = React.useState<typeof CAMPUS_LIST[0]>(CAMPUS_LIST[0]);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [savedItems, setSavedItems] = React.useState<string[]>([]);
  const [products, setProducts] = React.useState<MarketItem[]>([]);
  const [isSellModalOpen, setIsSellModalOpen] = React.useState(false);
  const [shareItem, setShareItem] = React.useState<MarketItem | null>(null);
  const [deleteItemTarget, setDeleteItemTarget] = React.useState<MarketItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = React.useState(false);

  const confirmDeleteItem = async () => {
    if (!deleteItemTarget) return;
    setIsDeletingItem(true);
    try {
      await deleteMarketItemAction(deleteItemTarget.id);

      // Remove from active state
      setProducts((prev) => prev.filter((p) => p.id !== deleteItemTarget.id));

      // Remove from client local storage
      if (typeof window !== "undefined") {
        try {
          const localItems = JSON.parse(localStorage.getItem("campsnest_custom_market_items") || "[]");
          const updated = localItems.filter((i: any) => i.id !== deleteItemTarget.id);
          localStorage.setItem("campsnest_custom_market_items", JSON.stringify(updated));

          const localMarket = JSON.parse(localStorage.getItem("campsnest_local_market_items") || "[]");
          const updatedMarket = localMarket.filter((i: any) => i.id !== deleteItemTarget.id);
          localStorage.setItem("campsnest_local_market_items", JSON.stringify(updatedMarket));
        } catch (e) {}
      }

      setDeleteItemTarget(null);
    } catch (err) {
      console.warn("Could not delete market item:", err);
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Load campus and listen to changes
  React.useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      try {
        // 1. If student profile has a registered school, prioritize it
        if (profile?.school) {
          const matched = CAMPUS_LIST.find(
            (c) =>
              c.name.toLowerCase().includes(profile.school!.toLowerCase()) ||
              profile.school!.toLowerCase().includes(c.name.toLowerCase()) ||
              c.id.toLowerCase() === profile.school!.toLowerCase() ||
              c.code.toLowerCase() === profile.school!.toLowerCase()
          );
          if (matched) {
            setSelectedCampus(matched);
            localStorage.setItem("campsnest_selected_campus", JSON.stringify(matched));
          }
        } else {
          // 2. Otherwise fallback to saved campus or default
          const saved = localStorage.getItem("campsnest_selected_campus");
          if (saved) {
            const parsed = JSON.parse(saved);
            const found = CAMPUS_LIST.find((c) => c.id === parsed.id || c.name === parsed.name);
            if (found) setSelectedCampus(found);
          }
        }
      } catch (e) {
        console.warn("Could not parse saved campus:", e);
      }

      const handleCampusChange = (e: any) => {
        if (e.detail) setSelectedCampus(e.detail);
      };

      window.addEventListener("campsnest:campus_changed", handleCampusChange);
      return () => window.removeEventListener("campsnest:campus_changed", handleCampusChange);
    }
  }, [profile?.school]);

  React.useEffect(() => {
    // 1. Load locally created market items
    if (typeof window !== "undefined") {
      try {
        const localItems = JSON.parse(localStorage.getItem("campsnest_custom_market_items") || "[]");
        if (localItems.length > 0) {
          setProducts(localItems);
        }
      } catch (e) {
        console.warn("Could not load local market items:", e);
      }
    }

    // 2. Fetch live marketplace items from Supabase
    const loadDbItems = async () => {
      const res = await fetchMarketItemsAction();
      if (res.success && res.items.length > 0) {
        const formattedDbItems: MarketItem[] = res.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category || "electronics",
          conditionBadge: item.condition_badge || "MINT CONDITION",
          conditionColor: item.condition_color || "bg-[#1E293B]/80 text-emerald-300 border-emerald-500/30",
          price: Number(item.price) || 0,
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          isNegotiable: item.is_negotiable ?? true,
          school: item.school || "Federal University Wukari",
          location: item.location || "Campus Main Gate",
          postedTime: "Just now",
          image: item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
          images: item.images && item.images.length > 0 ? item.images : item.image ? [item.image] : [],
          seller_id: item.seller_id,
          seller: {
            id: item.seller_id,
            name: item.seller_name || "Verified Student",
            level: item.seller_level || "300 Level",
            avatar: item.seller_avatar && !item.seller_avatar.includes("example.com")
              ? item.seller_avatar
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            verified: true,
            whatsapp: item.seller_whatsapp || "2348134351762"
          },
        }));

        setProducts((prev) => {
          const localOnly = prev.filter(p => !formattedDbItems.some(db => db.id === p.id));
          return [...localOnly, ...formattedDbItems];
        });
      }
    };
    loadDbItems();
  }, []);

  const toggleBookmark = (id: string) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePublishItem = (newItem: PublishedItem) => {
    setProducts((prev) => [newItem, ...prev]);
  };

  // Filter products by active School & search queries
  const filteredProducts = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const activeSchoolName = selectedCampus?.name?.toLowerCase() || "";
    const activeSchoolCode = selectedCampus?.code?.toLowerCase() || "";

    // Check if user is searching for a different school explicitly
    const isExplicitSchoolSearch = q.length > 1 && CAMPUS_LIST.some(
      (c) => q.includes(c.name.toLowerCase()) || q.includes(c.code.toLowerCase())
    );

    return products.filter((item) => {
      // 1. Campus / School Match
      if (!isExplicitSchoolSearch && activeSchoolName) {
        const itemSchool = (item.school || "").toLowerCase();
        const itemLocation = (item.location || "").toLowerCase();

        const isFuwItem = itemSchool.includes("wukari") || itemSchool.includes("fuw") || itemLocation.includes("wukari");

        // Never show FUW items to UNILAG or other universities
        if (activeSchoolCode !== "fuw" && isFuwItem) {
          return false;
        }

        if (itemSchool) {
          const matchesCurrentSchool =
            itemSchool.includes(activeSchoolName) ||
            activeSchoolName.includes(itemSchool) ||
            itemSchool.includes(activeSchoolCode) ||
            (activeSchoolCode === "fuw" && isFuwItem);

          if (!matchesCurrentSchool) return false;
        }
      }

      // 2. Search Query filter (matches title, description, location, seller name, category, school)
      const matchesSearch = !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        (item.school && item.school.toLowerCase().includes(q)) ||
        item.seller?.name?.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 3. Category filter
      const matchesCategory = activeCategory === "all" ||
        (item.category && item.category.toLowerCase() === activeCategory.toLowerCase());

      return matchesCategory;
    });
  }, [products, searchQuery, activeCategory, selectedCampus]);

  return (
    <AppShell>
      <div className="space-y-8 pb-20">

        {/* ========================================================================= */}
        {/* 1. HEADER SECTION (Eyebrows, Title & Full-Width Search Bar) */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Campus Market</span>
                <span className="text-2xl sm:text-3xl">🛒</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-magenta/15 border border-brand-magenta/30 text-[10px] font-bold text-brand-magenta-light shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-magenta animate-pulse"></span>
                <span>{selectedCampus?.code || "Campus"} Live</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Buy &amp; sell student gear and essentials near <span className="text-white font-semibold">{selectedCampus?.name || "campus"}</span>. Zero middlemen.
            </p>
          </div>

          {/* Full-width Search Bar */}
          <div className="w-full">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search tech, books, dorm kits in ${selectedCampus?.name || "campus"}...`}
                className="w-full h-12 rounded-full border border-white/15 bg-white/[0.04] pl-11 pr-10 text-xs sm:text-sm font-semibold text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY TABS (Horizontal Scrollable with active counts) */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none w-full max-w-full">
          {MARKET_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = cat.id === "all"
              ? filteredProducts.length
              : filteredProducts.filter(p => p.category?.toLowerCase() === cat.id.toLowerCase()).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${isActive
                    ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-[0_4px_16px_rgba(236,72,153,0.3)] scale-105"
                    : "bg-white/[0.04] text-text-dim hover:text-white hover:bg-white/[0.08] border border-white/10"
                  }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-text-dim"
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. PRODUCT CARDS GRID (2 COLUMNS) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-dim">
            <span>
              Showing <strong className="text-white">{filteredProducts.length}</strong> available items
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5 w-full">
            {filteredProducts.map((item) => {
              const isSaved = savedItems.includes(item.id);
              const isOwner = Boolean(
                profile?.id && (
                  item.seller_id === profile.id ||
                  item.seller?.id === profile.id ||
                  (item.seller?.whatsapp && profile.whatsapp_number && item.seller.whatsapp === profile.whatsapp_number)
                )
              );
              const hasDiscount = item.originalPrice && item.originalPrice > item.price;
              const discountPercent = hasDiscount
                ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
                : null;

              return (
                <GlassCard
                  key={item.id}
                  elevation="elevated"
                  interactive
                  className="rounded-2xl border-white/10 overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:border-brand-violet/50 cursor-pointer"
                >
                  <Link href={`/market/${item.id}`} className="block group cursor-pointer focus:outline-none">
                    {/* Media / Photo Box */}
                    <div className="relative aspect-square overflow-hidden bg-slate-900">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none z-10">
                        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md font-bold text-[9px] sm:text-[10px] text-brand-magenta-light border border-white/10 uppercase tracking-wider truncate max-w-[70%]">
                          {item.conditionBadge}
                        </span>

                        <div className="flex items-center gap-1 pointer-events-auto">
                          {isOwner && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteItemTarget(item);
                              }}
                              className="h-7 w-7 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white backdrop-blur-md border border-rose-400/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
                              title="Delete your item listing"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(item.id);
                            }}
                            className={`h-7 w-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                              isSaved
                                ? "bg-brand-magenta text-white border-brand-magenta shadow-glow-magenta"
                                : "bg-black/60 hover:bg-black/80 text-white border-white/20"
                            }`}
                          >
                            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-white" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Location Pill */}
                      <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-semibold text-text-dim flex items-center gap-1 max-w-[85%] truncate">
                        <MapPin className="h-3 w-3 text-brand-violet-light shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                      <div>
                        {/* Price display */}
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-base sm:text-lg font-extrabold text-white font-heading tracking-tight">
                            ₦{item.price.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] sm:text-xs text-text-muted line-through font-mono">
                              ₦{item.originalPrice!.toLocaleString()}
                            </span>
                          )}
                          {discountPercent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading font-extrabold text-white text-xs sm:text-sm group-hover:text-brand-violet-light transition-colors line-clamp-1 mt-0.5">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>

                  {/* Card Bottom CTA Actions */}
                  <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1.5 border-t border-white/5 flex items-center justify-between gap-1.5">
                    {/* Seller Name / Avatar */}
                    <Link
                      href={`/market/${item.id}`}
                      className="flex items-center gap-1.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
                    >
                      <Avatar
                        src={item.seller.avatar}
                        name={item.seller.name}
                        alt={item.seller.name}
                        size="sm"
                        className="h-5 w-5 text-[9px] shrink-0"
                      />
                      <span className="text-[10px] font-semibold text-text-secondary truncate">
                        {item.seller.name}
                      </span>
                    </Link>

                    {/* Direct Contact Seller via WhatsApp OR Delete if Owner */}
                    {isOwner ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteItemTarget(item);
                        }}
                        className="py-1 px-2.5 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    ) : (
                      <a
                        href={`https://wa.me/${item.seller.whatsapp || "2348134351762"}?text=Hello%20${encodeURIComponent(item.seller.name)},%20I%20am%20interested%20in%20buying%20"${encodeURIComponent(item.title)}"%20for%20₦${item.price.toLocaleString()}%20on%20CampsNest.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="py-1.5 px-3 rounded-full bg-gradient-to-r from-brand-violet via-[#A855F7] to-brand-magenta text-white text-[11px] font-bold shadow-[0_2px_10px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
                          <MessageSquare className="h-3 w-3" />
                          <span>Chat</span>
                        </button>
                      </a>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="py-16 text-center space-y-4 rounded-3xl bg-[#141029]/60 border border-white/10 p-8">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-2xl">
                🛒
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-extrabold text-white">
                  No Items Found in {selectedCampus?.name}
                </h3>
                <p className="text-xs text-text-dim max-w-sm mx-auto">
                  There are no products listed in this category for your active campus yet. Be the first to sell!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  onClick={() => setIsSellModalOpen(true)}
                  className="rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold"
                >
                  Sell an Item
                </Button>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="rounded-full border-white/15 text-white text-xs font-bold"
                  >
                    Switch Campus
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Floating Action Button (FAB) for Sell an Item */}
        <div className="fixed bottom-20 md:bottom-8 right-5 sm:right-8 z-40">
          <button
            onClick={() => setIsSellModalOpen(true)}
            className="h-12 sm:h-14 px-5 sm:px-6 rounded-full bg-gradient-to-r from-brand-violet via-[#A855F7] to-brand-magenta text-white font-bold text-xs sm:text-sm shadow-[0_8px_30px_rgba(236,72,153,0.45)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-white/20 backdrop-blur-md cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span>+ Sell an Item</span>
          </button>
        </div>

        {/* Sell Item Modal */}
        <SellItemModal
          isOpen={isSellModalOpen}
          onClose={() => setIsSellModalOpen(false)}
          onPublish={handlePublishItem}
          currentCampus={selectedCampus?.name}
        />

        {/* Share Modal */}
        {shareItem && (
          <ShareModal
            isOpen={!!shareItem}
            onClose={() => setShareItem(null)}
            title={shareItem.title}
            url={typeof window !== "undefined" ? `${window.location.origin}/market` : ""}
            description={`Check out ${shareItem.title} for ₦${shareItem.price.toLocaleString()} in ${selectedCampus?.name || "campus"} on CampsNest.`}
          />
        )}

        {/* Delete Market Item Confirmation Modal */}
        {deleteItemTarget && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-[#1A1535] border border-rose-500/30 p-6 space-y-4 shadow-2xl animate-scale-up text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-rose-400">
                  <div className="h-9 w-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-heading font-extrabold text-white">
                    Delete Market Listing
                  </h3>
                </div>
                <button
                  onClick={() => !isDeletingItem && setDeleteItemTarget(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-text-dim hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <img
                  src={deleteItemTarget.image}
                  alt={deleteItemTarget.title}
                  className="h-12 w-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{deleteItemTarget.title}</h4>
                  <p className="text-[11px] text-text-dim truncate">{deleteItemTarget.location}</p>
                  <p className="text-xs font-extrabold text-emerald-400">₦{deleteItemTarget.price.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to delete this marketplace item? It will be permanently removed from the student marketplace feed.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setDeleteItemTarget(null)}
                  disabled={isDeletingItem}
                  className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-text-dim hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteItem}
                  disabled={isDeletingItem}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isDeletingItem ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Item</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
