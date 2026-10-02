"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  ShoppingBag,
  Heart,
  Sparkles,
  ArrowRight,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Bookmark,
  Share2,
  Zap,
  Flame,
  Laptop,
  Gamepad2,
  Calendar,
  FileText,
  Bus,
  Search,
  PhoneCall,
  Clock,
  Check,
  Play
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, isVideoUrl } from "@/lib/utils";
import { fetchHousingListingsAction } from "@/lib/housing/actions";
import { fetchMarketItemsAction } from "@/lib/market/actions";
import { HOUSING_LISTINGS, HousingItem } from "@/lib/housing/constants";
import { MARKET_PRODUCTS, MarketItem } from "@/lib/market/constants";
import { useAuth } from "@/lib/auth/auth-provider";
import { CAMPUS_LIST } from "@/lib/constants";

export default function HomeFeedPage() {
  const { profile } = useAuth();
  const [selectedCampus, setSelectedCampus] = React.useState<typeof CAMPUS_LIST[0]>(CAMPUS_LIST[0]);
  const [savedHousing, setSavedHousing] = React.useState<string[]>([]);
  const [wavedUsers, setWavedUsers] = React.useState<string[]>([]);
  const [housingListings, setHousingListings] = React.useState<HousingItem[]>([]);
  const [marketItems, setMarketItems] = React.useState<MarketItem[]>([]);

  // Synchronize active campus with student profile or saved choice
  React.useEffect(() => {
    if (typeof window !== "undefined") {
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
          return;
        }
      }

      const saved = localStorage.getItem("campsnest_selected_campus");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const found = CAMPUS_LIST.find((c) => c.id === parsed.id || c.name === parsed.name);
          if (found) setSelectedCampus(found);
        } catch (e) {}
      }
    }
  }, [profile?.school]);

  React.useEffect(() => {
    // 1. Load custom local data first
    if (typeof window !== "undefined") {
      try {
        const localLodges = JSON.parse(localStorage.getItem("campsnest_custom_lodges") || "[]");
        if (localLodges.length > 0) {
          setHousingListings(localLodges);
        }

        const localProducts = JSON.parse(localStorage.getItem("campsnest_custom_market_items") || "[]");
        if (localProducts.length > 0) {
          setMarketItems(localProducts);
        }
      } catch (e) {
        console.warn("Could not parse local data on home page:", e);
      }
    }

    // 2. Fetch live data from Supabase
    const loadLiveData = async () => {
      try {
        const [housingRes, marketRes] = await Promise.all([
          fetchHousingListingsAction(),
          fetchMarketItemsAction(),
        ]);

        if (housingRes?.success && housingRes.items?.length > 0) {
          const formattedHouses: HousingItem[] = housingRes.items.map((item: any) => {
            const dbImages = item.room_listing_images?.map((r: any) => r.images).filter(Boolean) || [];
            const primaryImg = item.image || (dbImages.length > 0 ? dbImages[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80");
            const ownerRecord = item.owner || null;
            const hostName = ownerRecord?.name || item.host_name || "Verified Campus Host";
            const hostRole = ownerRecord?.level || (ownerRecord?.role === "admin" ? "Verified Host Admin" : "Lodge Host");
            const hostInitials = hostName.split(" ").filter(Boolean).map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "VH";

            return {
              id: item.id,
              title: item.title,
              category: item.house_type || "self-contain",
              categoryBadge: item.house_type ? item.house_type.replace(/_/g, " ").toUpperCase() : "Self Contain",
              statusBadge: item.status === "available" ? "Verified & Ready" : "Verified Lodge",
              statusBadgeColor: "bg-[#3B82F6]/30 text-[#ADC6FF] border-[#3B82F6]/40",
              address: item.location || "Campus Enclave",
              price: Number(item.price) || 180000,
              priceUnit: "/ year",
              distance: item.distance_from_campus || "5 mins to Gate",
              photoCount: dbImages.length > 0 ? dbImages.length : 4,
              image: primaryImg,
              images: dbImages.length > 0 ? dbImages : [primaryImg],
              description: item.description,
              school: item.school || ownerRecord?.school || (item.location?.toLowerCase().includes("wukari") ? "Federal University Wukari" : "Campus"),
              features: [
                { label: "Borehole Water", icon: Building2 },
                { label: "Prepaid Meter", icon: Zap },
                { label: "Gated Guard", icon: ShieldCheck }
              ],
              host: {
                initials: hostInitials,
                name: hostName,
                role: hostRole,
                badge: "Verified Lodge",
                badgeColor: "bg-brand-magenta/20 text-brand-magenta-light border-brand-magenta/30",
                whatsapp: ownerRecord?.whatsapp_number || item.whatsapp_link || item.host_whatsapp || "",
                phone: ownerRecord?.phone_number || item.owner_phone || item.host_phone || ""
              }
            };
          });

          setHousingListings((prev) => {
            const liveIds = new Set(formattedHouses.map((h) => h.id));
            return [...formattedHouses, ...prev.filter((p) => !liveIds.has(p.id))];
          });
        }

        if (marketRes?.success && marketRes.items?.length > 0) {
          const formattedProducts: MarketItem[] = marketRes.items.map((item: any) => {
            const rawImages = item.images && item.images.length > 0 ? item.images : [item.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80"];
            return {
              id: item.id,
              title: item.title,
              category: item.category || "electronics",
              conditionBadge: item.condition_badge || "Like New",
              conditionColor: item.condition_color || "bg-[#1E293B]/80 text-emerald-300 border-emerald-500/30",
              price: Number(item.price) || 15000,
              originalPrice: item.original_price ? Number(item.original_price) : undefined,
              isNegotiable: item.is_negotiable ?? true,
              location: item.location || item.campus_location || "Campus Gate",
              postedTime: "Just now",
              seller: {
                name: item.seller_name || item.seller?.name || "Verified Student",
                level: item.seller_level || item.seller?.level || "300 Level",
                avatar: item.seller_avatar || item.seller?.avatar || "",
                verified: true,
                whatsapp: item.seller_whatsapp || item.seller?.whatsapp || ""
              },
              image: rawImages[0],
              images: rawImages,
              description: item.description || "Student pre-loved campus item."
            };
          });

          setMarketItems((prev) => {
            const liveIds = new Set(formattedProducts.map((p) => p.id));
            return [...formattedProducts, ...prev.filter((p) => !liveIds.has(p.id))];
          });
        }
      } catch (err) {
        console.warn("Error fetching live data for home page:", err);
      }
    };
    loadLiveData();
  }, []);

  const toggleBookmark = (id: string) => {
    setSavedHousing((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleWave = (userId: string) => {
    if (!wavedUsers.includes(userId)) {
      setWavedUsers((prev) => [...prev, userId]);
    }
  };

  const visibleHouses = React.useMemo(() => {
    const activeCode = selectedCampus?.code?.toLowerCase() || "";
    const activeName = selectedCampus?.name?.toLowerCase() || "";
    return housingListings.filter((h) => {
      const hSchool = (h.school || "").toLowerCase();
      const hAddress = (h.address || "").toLowerCase();
      const isFuw = hSchool.includes("wukari") || hSchool.includes("fuw") || hAddress.includes("wukari");

      if (activeCode !== "fuw" && isFuw) return false;
      if (activeCode === "fuw") return isFuw || !hSchool;

      return hSchool.includes(activeName) || activeName.includes(hSchool) || hSchool.includes(activeCode);
    });
  }, [housingListings, selectedCampus]);

  const visibleProducts = React.useMemo(() => {
    const activeCode = selectedCampus?.code?.toLowerCase() || "";
    const activeName = selectedCampus?.name?.toLowerCase() || "";
    return marketItems.filter((m) => {
      const mSchool = (m.school || "").toLowerCase();
      const mLocation = (m.location || "").toLowerCase();
      const isFuw = mSchool.includes("wukari") || mSchool.includes("fuw") || mLocation.includes("wukari");

      if (activeCode !== "fuw" && isFuw) return false;
      if (activeCode === "fuw") return isFuw || !mSchool;

      return mSchool.includes(activeName) || activeName.includes(mSchool) || mSchool.includes(activeCode);
    });
  }, [marketItems, selectedCampus]);

  return (
    <AppShell>
      <div className="space-y-8 sm:space-y-12 pb-12">

        {/* ========================================================================= */}
        {/* 1. HERO WELCOME SECTION (Desktop only, hidden on mobile) */}
        {/* ========================================================================= */}
        <section className="hidden sm:block relative rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden border border-white/10 bg-[#141122]">
          {/* Subtle Ambient Accent Lighting */}
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-brand-violet/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            {/* Top Campus Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-white/90">
              <span className="font-bold text-brand-violet-light">Verified Students Active</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary">{selectedCampus?.name || "Campus"}</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-[1.2]">
              Your campus. Your space. <br className="hidden sm:inline" />
              <span className="text-brand-violet-light">Your people.</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-2xl font-normal">
              Verified campus housing, peer-to-peer student marketplace, and roommate vibe matching in one place.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/housing">
                <button className="flex items-center justify-center px-5 h-10 rounded-xl bg-brand-violet hover:bg-brand-violet/90 text-white text-xs font-bold transition-all gap-2 shadow-glow-violet/30">
                  <Building2 className="h-4 w-4" />
                  <span>Find Housing</span>
                </button>
              </Link>

              <Link href="/market">
                <button className="flex items-center justify-center px-5 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 transition-all gap-2">
                  <ShoppingBag className="h-4 w-4 text-brand-magenta-light" />
                  <span>Browse Market</span>
                </button>
              </Link>

              <Link href="/connect">
                <button className="flex items-center justify-center px-5 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 transition-all gap-2">
                  <Heart className="h-4 w-4 text-[#FFB0CD]" />
                  <span>Discover Matches</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mobile Quick Search Bar (Prominent in mobile view) */}
        <div className="block sm:hidden">
          <div className="flex items-center w-full px-4 py-3 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md shadow-md focus-within:ring-2 focus-within:ring-brand-violet transition-all">
            <Search className="h-4 w-4 text-text-muted mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search rooms, books, rides, vibes..."
              className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-text-dim"
            />
            <Link href="/housing" className="h-7 w-7 rounded-full bg-white/[0.08] flex items-center justify-center text-text-secondary hover:text-white shrink-0 ml-1">
              <Zap className="h-3.5 w-3.5 text-brand-magenta-light" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. NEW HOUSING NEAR CAMPUS (Live Dynamic Cards) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-magenta" />
                <span>New Housing Near Campus</span>
              </h2>
              <p className="text-xs text-text-secondary">
                Verified student-friendly lodges, tested power lines, water running.
              </p>
            </div>
            <Link
              href="/housing"
              className="text-xs font-semibold text-brand-violet-light hover:underline shrink-0 pt-1 sm:pt-0 flex items-center gap-1"
            >
              <span>View All ({visibleHouses.length}) Listings</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {visibleHouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {visibleHouses.slice(0, 3).map((house) => {
              const displayMedia = house.image || (house.images && house.images[0]) || "";
              const mediaIsVideo = isVideoUrl(displayMedia);

              return (
                <div
                  key={house.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all p-3.5 space-y-3 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-[#18142E]">
                      <Link href={`/housing/${house.id}`} className="block h-full w-full relative">
                        {mediaIsVideo ? (
                          <div className="w-full h-full bg-black relative flex items-center justify-center">
                            <video
                              src={displayMedia}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none opacity-85"
                              muted
                              loop
                              autoPlay
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="h-10 w-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="h-4 w-4 fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={displayMedia}
                            alt={house.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </Link>

                      {/* Verified / Video Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white pointer-events-none">
                        {mediaIsVideo ? (
                          <>
                            <Play className="h-3 w-3 fill-white text-rose-400" />
                            <span>Video Tour</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3 w-3 text-emerald-400" />
                            <span>{house.statusBadge || "Verified Lodge"}</span>
                          </>
                        )}
                      </div>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBookmark(house.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${savedHousing.includes(house.id)
                            ? "bg-brand-magenta text-white border-transparent"
                            : "bg-black/50 text-white/80 hover:text-white border-white/20"
                          }`}
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>

                      {/* Price Pill Overlay */}
                      <div className="absolute bottom-3 left-3 pointer-events-none">
                        <span className="px-3 py-1 rounded-full bg-[#8B5CF6] text-xs font-extrabold text-white shadow-lg">
                          ₦{house.price.toLocaleString()}<span className="text-[10px] font-normal text-white/80">{house.priceUnit || "/yr"}</span>
                        </span>
                      </div>
                    </div>

                    <Link href={`/housing/${house.id}`} className="block space-y-1.5 px-1">
                      <div className="flex items-center justify-between text-[11px] text-text-dim">
                        <span className="font-extrabold text-brand-violet-light uppercase tracking-wide truncate max-w-[140px]">
                          {house.categoryBadge || "SELF-CONTAIN"}
                        </span>
                        <span className="flex items-center gap-1 text-text-secondary truncate">
                          <MapPin className="h-3 w-3 text-brand-magenta shrink-0" />
                          <span>{house.distance || "5 mins to Gate"}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-brand-violet-light transition-colors truncate">
                        {house.title}
                      </h3>

                      <p className="text-xs text-text-dim truncate">
                        {house.address}
                      </p>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between px-1">
                    <div className="text-[11px] text-text-secondary truncate">
                      Host: <span className="text-white font-semibold">{house.host?.name || "Verified Host"}</span>
                    </div>
                    <Link href={`/housing/${house.id}`}>
                      <button className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white text-[11px] font-bold border border-white/15 transition-all">
                        Details →
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <div className="text-2xl">🏡</div>
              <p className="text-xs text-text-dim">
                No verified lodges posted for {selectedCampus?.name || "your campus"} yet.
              </p>
              <Link href="/housing">
                <button className="px-4 py-1.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-violet/90 transition-all">
                  Post a House
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. MARKETPLACE FRESH DEALS (Live Dynamic Cards) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-brand-magenta-light" />
              <span>Marketplace Fresh Deals</span>
            </h2>
            <Link
              href="/market"
              className="text-xs font-semibold text-brand-violet-light hover:underline flex items-center gap-1"
            >
              <span>Browse All ({visibleProducts.length}) Items</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {visibleProducts.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-3 space-y-2.5 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <Link href={`/market/${item.id}`} className="block relative h-32 w-full rounded-xl overflow-hidden bg-[#18142E]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded bg-brand-violet/80 text-white backdrop-blur-md">
                        {item.conditionBadge || "Like New"}
                      </span>
                    </Link>
                    <Link href={`/market/${item.id}`} className="block">
                      <h3 className="text-xs font-bold text-white group-hover:text-brand-magenta-light transition-colors truncate">
                        {item.title}
                      </h3>
                      <div className="text-sm font-extrabold text-white">
                        ₦{item.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-text-dim truncate">
                        👤 {item.seller?.name || "Verified Student"}
                      </div>
                    </Link>
                  </div>
                  <Link href={`/market/${item.id}`} className="w-full">
                    <button className="w-full py-1.5 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition-all">
                      <MessageSquare className="h-3 w-3 text-brand-magenta-light" />
                      <span>Instant Chat</span>
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <div className="text-2xl">🛍️</div>
              <p className="text-xs text-text-dim">
                No active marketplace items listed for {selectedCampus?.name || "your campus"} yet.
              </p>
              <Link href="/market">
                <button className="px-4 py-1.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-violet/90 transition-all">
                  Sell an Item
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 5. VIBE RADAR & ROOMMATE MATCHES (3 Dynamic Match Cards) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-white flex items-center gap-2">
                <Heart className="h-4 w-4 text-brand-magenta" />
                <span>Vibe Roommate Matches</span>
              </h2>
              {/* <p className="text-xs text-text-secondary">
                AI compatibility based on your study habits.
              </p> */}
            </div>

            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-magenta/15 border border-brand-magenta/30 text-xs font-bold text-brand-magenta-light self-start sm:self-auto">
              <span>Vibe Profile Complete</span>
              <span className="text-white">92%</span>
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Match 1: Precious E. */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-5 space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    glow
                    className="h-12 w-12"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">Precious E.</h3>
                    <p className="text-[11px] text-text-dim">Computer Science • 300L</p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-brand-magenta text-[10px] font-extrabold text-white shadow-glow-magenta/40">
                  94% Match
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
                  SHARED VIBES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    🎧 Afrobeats & Drill
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    🌙 Night Owl Coder
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    🎮 FIFA 24
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleWave("precious")}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${wavedUsers.includes("precious")
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
                    }`}
                >
                  {wavedUsers.includes("precious") ? "Waved! 👋" : "Wave 👋"}
                </button>
                <Link
                  href="/connect"
                  className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-text-muted hover:text-white transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Match 2: Halima B. */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-5 space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                    glow
                    className="h-12 w-12"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">Halima B.</h3>
                    <p className="text-[11px] text-text-dim">Biochemistry • 200L</p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-brand-violet text-[10px] font-extrabold text-white shadow-glow-violet/40">
                  88% Match
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
                  SHARED VIBES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    🌅 Early Bird Study
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    🤫 Quiet Space
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    📚 Library Partner
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleWave("halima")}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${wavedUsers.includes("halima")
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
                    }`}
                >
                  {wavedUsers.includes("halima") ? "Waved! 👋" : "Wave 👋"}
                </button>
                <Link
                  href="/connect"
                  className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-text-muted hover:text-white transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Match 3: Chuka N. */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-5 space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                    glow
                    className="h-12 w-12"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">Chuka N.</h3>
                    <p className="text-[11px] text-text-dim">Economics • 400L</p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-brand-blue text-[10px] font-extrabold text-white shadow-glow-blue/40">
                  85% Match
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
                  SHARED VIBES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    ⚽ Premier League
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    🍔 Foodie Trips
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-text-secondary">
                    💼 Side Hustle
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleWave("chuka")}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${wavedUsers.includes("chuka")
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
                    }`}
                >
                  {wavedUsers.includes("chuka") ? "Waved! 👋" : "Wave 👋"}
                </button>
                <Link
                  href="/connect"
                  className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-text-muted hover:text-white transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </AppShell>
  );
}

