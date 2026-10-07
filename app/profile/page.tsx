"use client";

import * as React from "react";
import Link from "next/link";
import { 
  User, 
  ShieldCheck, 
  Building2, 
  ShoppingBag, 
  Heart, 
  Edit3,
  Settings,
  Zap,
  MoreVertical,
  Calendar,
  Sparkles,
  ChevronRight,
  LogOut,
  HelpCircle,
  Bell,
  CheckCircle2,
  Lock,
  Moon,
  Headphones,
  Utensils,
  PlusCircle,
  ExternalLink,
  Shield,
  Clock,
  MapPin,
  RefreshCw,
  Bookmark,
  Play,
  Check,
  Flame,
  Search,
  MessageSquare,
  Maximize2,
  Trash2,
  Loader2,
  X
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-provider";
import { 
  fetchUserAllListingsAction, 
  fetchUserSavedHousesAction, 
  fetchUserInspectionsAction,
  ProfileListingItem,
  ProfileInspectionItem
} from "@/lib/profile/actions";
import { fetchUserAnswersAction } from "@/lib/connect/actions";
import { CONNECT_QUESTIONS } from "@/lib/connect/constants";
import { HousingItem } from "@/lib/housing/constants";
import { deleteHousingListingAction } from "@/lib/housing/actions";
import { deleteMarketItemAction } from "@/lib/market/actions";
import { isVideoUrl, parseUserName, formatNameFromEmail } from "@/lib/utils";
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";

export default function ProfilePage() {
  const { profile, signOut } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"listings" | "saved" | "vibe" | "inspections">("listings");
  const [isViewingAvatar, setIsViewingAvatar] = React.useState(false);
  const [deleteListingTarget, setDeleteListingTarget] = React.useState<ProfileListingItem | null>(null);
  const [isDeletingListing, setIsDeletingListing] = React.useState(false);

  const confirmDeleteProfileListing = async () => {
    if (!deleteListingTarget) return;
    setIsDeletingListing(true);
    try {
      if (deleteListingTarget.type === "housing") {
        await deleteHousingListingAction(deleteListingTarget.id);
        if (typeof window !== "undefined") {
          try {
            const lodges = JSON.parse(localStorage.getItem("campsnest_custom_lodges") || "[]");
            localStorage.setItem("campsnest_custom_lodges", JSON.stringify(lodges.filter((l: any) => l.id !== deleteListingTarget.id)));
            const hList = JSON.parse(localStorage.getItem("campsnest_local_housing_items") || "[]");
            localStorage.setItem("campsnest_local_housing_items", JSON.stringify(hList.filter((h: any) => h.id !== deleteListingTarget.id)));
          } catch (e) {}
        }
      } else {
        await deleteMarketItemAction(deleteListingTarget.id);
        if (typeof window !== "undefined") {
          try {
            const mItems = JSON.parse(localStorage.getItem("campsnest_custom_market_items") || "[]");
            localStorage.setItem("campsnest_custom_market_items", JSON.stringify(mItems.filter((i: any) => i.id !== deleteListingTarget.id)));
            const mLocal = JSON.parse(localStorage.getItem("campsnest_local_market_items") || "[]");
            localStorage.setItem("campsnest_local_market_items", JSON.stringify(mLocal.filter((i: any) => i.id !== deleteListingTarget.id)));
          } catch (e) {}
        }
      }
      setUserListings((prev) => prev.filter((item) => item.id !== deleteListingTarget.id));
      setDeleteListingTarget(null);
    } catch (err) {
      console.error("Delete listing error:", err);
    } finally {
      setIsDeletingListing(false);
    }
  };

  // Dynamic Data States
  const [userListings, setUserListings] = React.useState<ProfileListingItem[]>([]);
  const [savedHouses, setSavedHouses] = React.useState<HousingItem[]>([]);
  const [inspections, setInspections] = React.useState<ProfileInspectionItem[]>([]);
  const [vibeAnswers, setVibeAnswers] = React.useState<Record<string, string>>({});
  const [loadingTab, setLoadingTab] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);

    async function loadProfileData() {
      setLoadingTab(true);

      // 1. Fetch user's listings from Supabase + localStorage
      let localMarketItems: any[] = [];
      let localHousingItems: any[] = [];
      let localSavedIds: string[] = [];
      let localAnswers: Record<string, string> = {};

      if (typeof window !== "undefined") {
        try {
          localMarketItems = JSON.parse(localStorage.getItem("campsnest_local_market_items") || "[]");
          localHousingItems = JSON.parse(localStorage.getItem("campsnest_local_housing_items") || "[]");
          localSavedIds = JSON.parse(localStorage.getItem("campsnest_saved_housing") || "[]");
          localAnswers = JSON.parse(localStorage.getItem("campsnest_questionnaire_answers") || "{}");
        } catch (e) {
          console.warn("localStorage read error in profile:", e);
        }
      }

      // Supabase fetch
      const [dbListings, dbSaved, dbInspections, dbAnswers] = await Promise.all([
        fetchUserAllListingsAction(profile?.id),
        fetchUserSavedHousesAction(localSavedIds),
        fetchUserInspectionsAction(profile?.id),
        fetchUserAnswersAction(profile?.id)
      ]);

      // Combine local session items with DB listings
      const formattedLocalMarket: ProfileListingItem[] = localMarketItems.map((m: any) => ({
        id: m.id || `m-${Date.now()}`,
        type: "market",
        title: m.title,
        subtitle: `${m.category || "Item"} • ${m.condition_badge || "Mint Condition"}`,
        price: m.price,
        status: "Active",
        inquiries: 6,
        image: m.image || (m.images && m.images[0]) || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
      }));

      const formattedLocalHousing: ProfileListingItem[] = localHousingItems.map((h: any) => ({
        id: h.id || `h-${Date.now()}`,
        type: "housing",
        title: h.title,
        subtitle: `${h.location} • Lodge`,
        price: h.price,
        status: "Active",
        inquiries: 9,
        image: h.image || (h.images && h.images[0]) || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80"
      }));

      const mergedListings = [...formattedLocalMarket, ...formattedLocalHousing, ...dbListings];
      setUserListings(mergedListings);
      setSavedHouses(dbSaved || []);
      setInspections(dbInspections || []);
      setVibeAnswers({ ...localAnswers, ...dbAnswers });
      setLoadingTab(false);
    }

    loadProfileData();
  }, [profile?.id]);

  const resolvedName = React.useMemo(() => {
    return parseUserName(
      profile,
      null,
      profile?.email ? formatNameFromEmail(profile.email) : "Campus Student"
    );
  }, [profile]);

  const displayName = resolvedName;
  const isInvalidAvatar = !profile?.profile_image || profile.profile_image.includes("example.com") || profile.profile_image.trim() === "";
  const displayAvatar = !isInvalidAvatar 
    ? profile!.profile_image! 
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
  const displayDepartment = profile?.department || "B.Sc Computer Science";
  const displaySchool = profile?.school || "Federal University Wukari";
  const displayLevel = profile?.level || "300 Level";
  const displayBio = profile?.bio || "Full-stack UI designer & night owl coder. Looking for a neat roommate around Greenfield Estate.";
  const displayHandle = `@${displayName.toLowerCase().replace(/[^a-z0-9_]/g, "").replace(/\s+/g, "_") || "student"}`;

  return (
    <AppShell>
      <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
        
        {/* ========================================================================= */}
        {/* 1. TOP PROFILE HERO BANNER & USER DETAILS (Compact View) */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#141122] p-4 sm:p-6 space-y-4 shadow-xl">
          
          {/* Top Row: Avatar + Name/Level + Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Compact Profile Avatar with Fullscreen Zoom Trigger */}
              <div 
                onClick={() => setIsViewingAvatar(true)}
                title="Click to view full screen"
                className="relative shrink-0 cursor-pointer group select-none"
              >
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border border-white/15 bg-[#18142E] group-hover:border-brand-violet transition-all group-hover:scale-105 shadow-xl relative">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-brand-violet flex items-center justify-center text-white shadow-md z-10">
                  <ShieldCheck className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Names & Department */}
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 suppressHydrationWarning className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
                    {displayName}
                  </h1>
                  <span suppressHydrationWarning className="text-xs font-semibold text-text-dim">{displayHandle}</span>
                  <span suppressHydrationWarning className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                    {displayLevel}
                  </span>
                </div>

                <div suppressHydrationWarning className="flex items-center gap-1.5 text-xs text-brand-violet-light font-medium truncate">
                  <Sparkles className="h-3.5 w-3.5 text-brand-magenta-light shrink-0" />
                  <span suppressHydrationWarning className="truncate">{displayDepartment} • {displaySchool}</span>
                </div>
              </div>
            </div>

            {/* Right: Live Sync Chip & Edit Actions */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2.5 pt-1 sm:pt-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold text-white shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300">SYNC LIVE</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/profile/edit">
                  <button className="h-9 px-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9D74FF] hover:to-[#F472B6] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </Link>

                <Link href="/settings">
                  <button className="h-9 w-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                    <Settings className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Compact Bio & Verification Chips */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <p className="text-xs text-text-secondary leading-relaxed max-w-3xl line-clamp-2">
              {displayBio}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold text-white/90">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Verified Student ID</span>
              </span>

              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold text-brand-magenta-light">
                <Shield className="h-3 w-3 text-brand-magenta" />
                <span>Ambassador Level 1</span>
              </span>

              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold text-brand-blue-light">
                <Zap className="h-3 w-3 text-brand-blue" />
                <span>Fast Responder (&lt;10m)</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FUNCTIONAL TABS NAVIGATION */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar select-none w-full max-w-full">
          {[
            { id: "listings", label: "My Listings", count: userListings.length },
            { id: "saved", label: "Saved Houses", count: savedHouses.length },
            { id: "vibe", label: "Vibe Preferences", count: Object.keys(vibeAnswers).length > 0 ? "Active" : null },
            { id: "inspections", label: "Inspections", count: inspections.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white border-transparent shadow-[0_4px_16px_rgba(139,92,246,0.35)] scale-[1.02]"
                    : "bg-white/[0.04] hover:bg-white/[0.09] text-text-secondary hover:text-white border-white/10"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && tab.count !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-white/10 text-text-dim"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. DYNAMIC TAB CONTENT */}
        {/* ========================================================================= */}
        <div className="space-y-6">
            
            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: MY LISTINGS (Marketplace Items + Housing Listings) */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "listings" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-heading font-extrabold text-white">
                      My Posted Listings
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Your active items and accommodation listings live on CampsNest
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href="/market">
                      <button className="px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-all">
                        <PlusCircle className="h-3.5 w-3.5 text-brand-magenta-light" />
                        <span>Sell Item</span>
                      </button>
                    </Link>

                    <Link href="/housing">
                      <button className="px-3.5 py-2 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>Post House</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Grid of Listings */}
                {userListings.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-[#141029]/80 border border-white/10 text-center space-y-3">
                    <ShoppingBag className="h-10 w-10 text-brand-violet-light mx-auto opacity-70" />
                    <h3 className="text-sm font-bold text-white">No Listings Posted Yet</h3>
                    <p className="text-xs text-text-dim max-w-sm mx-auto">
                      Post items you want to sell or student rooms for lease with zero commission.
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                      <Link href="/market">
                        <button className="px-5 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold">
                          Sell on Marketplace
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {userListings.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-white/10 bg-[#141029]/80 hover:bg-[#181432]/90 hover:border-white/20 p-3 space-y-2.5 group transition-all flex flex-col justify-between shadow-lg"
                      >
                        <div className="space-y-2">
                          <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-[#18142E]">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            
                            {/* Status Badge */}
                            <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${
                              item.status === "Active"
                                ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/40"
                                : "bg-gray-500/40 text-gray-300 border-gray-500/40"
                            }`}>
                              • {item.status}
                            </span>

                            {/* Type Tag */}
                            <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-brand-violet-light border border-white/15 uppercase">
                              {item.type === "housing" ? "🏠 House" : "🛍️ Market"}
                            </span>

                            {/* Inquiries Badge */}
                            {item.inquiries && (
                              <span className="absolute bottom-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/15">
                                {item.inquiries} inquiries
                              </span>
                            )}
                          </div>

                          <div className="space-y-0.5 px-0.5">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-violet-light transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-text-dim truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5 px-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-heading font-extrabold text-white">
                              ₦{item.price.toLocaleString()}
                            </span>
                            {item.archived && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-text-dim">
                                Archived
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setDeleteListingTarget(item)}
                              className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                              title="Delete listing"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <Link
                              href={item.type === "housing" ? `/housing/${item.id}` : `/market/${item.id}`}
                              className="p-1 rounded-lg hover:bg-white/[0.08] text-text-dim hover:text-white transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: SAVED HOUSES */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "saved" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-brand-magenta" />
                      <span>Saved Accommodations</span>
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Lodges and self-contains bookmarked for quick inspection and price tracking.
                    </p>
                  </div>

                  <Link href="/housing">
                    <button className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-all">
                      <Building2 className="h-3.5 w-3.5 text-brand-violet-light" />
                      <span>Browse More Lodges</span>
                    </button>
                  </Link>
                </div>

                {savedHouses.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-[#141029]/80 border border-white/10 text-center space-y-3">
                    <Building2 className="h-10 w-10 text-brand-magenta-light mx-auto opacity-70" />
                    <h3 className="text-sm font-bold text-white">No Saved Accommodations</h3>
                    <p className="text-xs text-text-dim max-w-sm mx-auto">
                      Click the bookmark icon on any housing listing to save it here for fast comparisons.
                    </p>
                    <div className="pt-2 flex justify-center">
                      <Link href="/housing">
                        <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold shadow-md">
                          Explore Lodges
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedHouses.map((house) => {
                      const displayMedia = house.image || (house.images && house.images[0]) || "";
                      const mediaIsVideo = isVideoUrl(displayMedia);

                      return (
                        <div
                          key={house.id}
                          className="rounded-3xl border border-white/10 bg-[#141029]/80 hover:bg-[#181432]/90 hover:border-white/20 p-3.5 space-y-3 group transition-all flex flex-col justify-between shadow-lg"
                        >
                          <div className="space-y-3">
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#18142E]">
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
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                      <div className="h-9 w-9 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
                                        <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
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

                              {/* Price Overlay */}
                              <div className="absolute bottom-2.5 left-2.5">
                                <span className="px-3 py-1 rounded-full bg-[#8B5CF6] text-xs font-extrabold text-white shadow-lg">
                                  ₦{house.price.toLocaleString()}<span className="text-[10px] font-normal text-white/80">{house.priceUnit || "/yr"}</span>
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1 px-1">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-brand-violet-light transition-colors">
                                {house.title}
                              </h4>
                              <p className="text-[11px] text-text-dim flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 text-brand-magenta shrink-0" />
                                <span className="truncate">{house.address}</span>
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                            <Link href={`/housing/${house.id}`} className="flex-1">
                              <button className="w-full py-2 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all">
                                <span>View Details</span>
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </Link>

                            <Link href={`/housing/${house.id}#inspection`}>
                              <button className="py-2 px-3.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Inspect</span>
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: VIBE & LIFESTYLE PREFERENCES */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "vibe" && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-extrabold text-brand-magenta uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5 text-brand-magenta" />
                        <span>AI COMPATIBILITY & VIBE PROFILE</span>
                      </div>
                      <h2 className="text-xl font-heading font-extrabold text-white pt-1">
                        Lifestyle & Roommate Questionnaire
                      </h2>
                      <p className="text-xs text-text-secondary">
                        Calibrated from your 10-step lifestyle answers on CampsNest.
                      </p>
                    </div>

                    <Link href="/connect">
                      <button className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-400 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Retake 10 Questions ✨</span>
                      </button>
                    </Link>
                  </div>

                  {/* 10-Step Answer Summary Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {CONNECT_QUESTIONS.map((q) => {
                      const userChoiceId = vibeAnswers[q.key] || q.options[0]?.id;
                      const matchedOption = q.options.find((o) => o.id === userChoiceId) || q.options[0];

                      return (
                        <div
                          key={q.key}
                          className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 hover:border-white/15 transition-all"
                        >
                          <div className="flex items-center justify-between text-[10px] text-text-dim font-semibold uppercase tracking-wider">
                            <span>{q.category}</span>
                            <span className="text-brand-magenta-light font-bold">{q.impactWeight}</span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="text-xl shrink-0">{matchedOption?.emoji || "✨"}</span>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">
                                {matchedOption?.title || "Option Selected"}
                              </h4>
                              <p className="text-[10px] text-text-dim truncate">
                                {matchedOption?.tag || "Calibrated"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: INSPECTIONS */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "inspections" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-violet-light" />
                      <span>Scheduled Housing Inspections</span>
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Your requested and scheduled accommodation walkthroughs with verified lodge hosts.
                    </p>
                  </div>

                  <Link href="/housing">
                    <button className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-all">
                      <PlusCircle className="h-3.5 w-3.5 text-brand-violet-light" />
                      <span>Book New Inspection</span>
                    </button>
                  </Link>
                </div>

                {inspections.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-[#141029]/80 border border-white/10 text-center space-y-3">
                    <Calendar className="h-10 w-10 text-brand-violet-light mx-auto opacity-70" />
                    <h3 className="text-sm font-bold text-white">No Inspections Scheduled</h3>
                    <p className="text-xs text-text-dim max-w-sm mx-auto">
                      Found a lodge you like? Book an on-ground physical inspection to test power and water running.
                    </p>
                    <div className="pt-2 flex justify-center">
                      <Link href="/housing">
                        <button className="px-5 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold">
                          Find Accommodations
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inspections.map((insp) => (
                      <div
                        key={insp.id}
                        className="p-4 sm:p-5 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-3 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-[#18142E] shrink-0 border border-white/15">
                            <img
                              src={insp.listingImage}
                              alt={insp.listingTitle}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                {insp.listingTitle}
                              </h4>
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                insp.status === "scheduled"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              }`}>
                                • {insp.status}
                              </span>
                            </div>

                            <p className="text-xs text-text-dim flex items-center gap-1.5 truncate">
                              <MapPin className="h-3 w-3 text-brand-magenta shrink-0" />
                              <span className="truncate">{insp.location}</span>
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-text-secondary pt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-brand-violet-light" />
                                <span>{insp.preferredDate} ({insp.preferredTimeSlot})</span>
                              </span>
                              <span>• Fee: ₦{insp.inspectionFee.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Link href={`/housing/${insp.listingId}`}>
                            <button className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white transition-all">
                              View Lodge
                            </button>
                          </Link>
                          
                          <Link href="/messages">
                            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Chat Host</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        {/* Fullscreen Avatar Modal */}
        <ImageLightboxModal
          isOpen={isViewingAvatar}
          onClose={() => setIsViewingAvatar(false)}
          imageUrl={displayAvatar}
          title={displayName}
          subtitle={`${displayDepartment} • ${displaySchool}`}
          badge="Verified Student ID"
        />

        {/* Delete Listing Confirmation Modal */}
        {deleteListingTarget && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-[#1A1535] border border-rose-500/30 p-6 space-y-4 shadow-2xl animate-scale-up text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-rose-400">
                  <div className="h-9 w-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-heading font-extrabold text-white">
                    Delete {deleteListingTarget.type === "housing" ? "Lodge Listing" : "Market Item"}
                  </h3>
                </div>
                <button
                  onClick={() => !isDeletingListing && setDeleteListingTarget(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-text-dim hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <img
                  src={deleteListingTarget.image}
                  alt={deleteListingTarget.title}
                  className="h-12 w-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{deleteListingTarget.title}</h4>
                  <p className="text-[11px] text-text-dim truncate">{deleteListingTarget.subtitle}</p>
                  <p className="text-xs font-extrabold text-emerald-400">₦{deleteListingTarget.price.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to delete this {deleteListingTarget.type === "housing" ? "property listing" : "marketplace product"}? It will be permanently removed.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setDeleteListingTarget(null)}
                  disabled={isDeletingListing}
                  className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-text-dim hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProfileListing}
                  disabled={isDeletingListing}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isDeletingListing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
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
