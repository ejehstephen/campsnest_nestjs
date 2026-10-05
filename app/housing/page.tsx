"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  SlidersHorizontal, 
  Navigation, 
  Calendar, 
  Sparkles, 
  Zap, 
  Droplets, 
  Sun, 
  Video, 
  Wifi, 
  Shield, 
  CheckCircle2, 
  Map, 
  ArrowRight,
  Camera,
  Layers,
  Clock,
  Compass,
  Check,
  Search,
  PhoneCall,
  MessageSquare,
  PlusCircle,
  X,
  Play,
  GraduationCap,
  Globe
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostHouseModal, PublishedHouse } from "@/components/housing/post-house-modal";
import { isVideoUrl, parseUserName } from "@/lib/utils";
import { ShareModal } from "@/components/common/share-modal";
import { fetchHousingListingsAction } from "@/lib/housing/actions";
import { useAuth } from "@/lib/auth/auth-provider";
import { CAMPUS_LIST } from "@/lib/constants";
import { 
  HOUSING_FILTER_PILLS, 
  HOUSING_LISTINGS, 
  HousingItem 
} from "@/lib/housing/constants";

function getAmenityIcon(iconOrLabel: any): React.ComponentType<{ className?: string }> {
  if (typeof iconOrLabel === "function") {
    return iconOrLabel;
  }
  if (iconOrLabel && typeof iconOrLabel === "object" && "$$typeof" in iconOrLabel) {
    return iconOrLabel;
  }
  const label = typeof iconOrLabel === "string" ? iconOrLabel.toLowerCase() : "";
  if (label.includes("water") || label.includes("borehole")) return Droplets;
  if (label.includes("solar") || label.includes("sun") || label.includes("inverter")) return Sun;
  if (label.includes("light") || label.includes("meter") || label.includes("prepaid") || label.includes("power")) return Zap;
  if (label.includes("security") || label.includes("guard") || label.includes("gated")) return Shield;
  if (label.includes("wifi") || label.includes("internet")) return Wifi;
  if (label.includes("video") || label.includes("tour")) return Video;
  return Building2;
}

export default function HousingDiscoveryPage() {
  const { profile } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [selectedCampus, setSelectedCampus] = React.useState<typeof CAMPUS_LIST[0]>(CAMPUS_LIST[0]);
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [maxBudget, setMaxBudget] = React.useState<number>(350000);
  const [savedNests, setSavedNests] = React.useState<string[]>([]);
  const [housingListings, setHousingListings] = React.useState<HousingItem[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [shareHouse, setShareHouse] = React.useState<HousingItem | null>(null);

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
    // 1. Load locally saved lodges immediately
    let localLodges: HousingItem[] = [];
    if (typeof window !== "undefined") {
      try {
        localLodges = JSON.parse(localStorage.getItem("campsnest_custom_lodges") || "[]");
        if (localLodges.length > 0) {
          setHousingListings(localLodges);
        }
      } catch (e) {
        console.warn("Could not load local lodges:", e);
      }
    }

    // 2. Fetch live listings from Supabase
    const loadDbHouses = async () => {
      try {
        const res = await fetchHousingListingsAction();
        if (res.success && res.items.length > 0) {
          const formattedDbHouses: HousingItem[] = res.items.map((item: any) => {
            const dbImages = item.room_listing_images?.map((r: any) => r.images).filter(Boolean) || [];
            const primaryImg = item.image || (dbImages.length > 0 ? dbImages[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80");
            
            const ownerRecord = item.owner || null;
            const hostName = parseUserName(ownerRecord, null, item.host_name || "Verified Campus Host");
            const hostAvatar = (ownerRecord?.profile_image && !ownerRecord.profile_image.includes("example.com") ? ownerRecord.profile_image : "") || "";
            const hostRole = ownerRecord?.level || (ownerRecord?.role === "admin" ? "Verified Host Admin" : "Lodge Host");
            const hostInitials = hostName.split(" ").filter(Boolean).map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "VH";

            const dbAmenityList: string[] = (item.room_listing_amenities || []).map((a: any) => a.amenities).filter(Boolean);
            const descText = (item.description || "").toLowerCase();

            const dynamicFeatures: { label: string; icon: any }[] = [];
            if (dbAmenityList.length > 0) {
              dbAmenityList.forEach((am) => {
                const amLower = am.toLowerCase();
                const icon = amLower.includes("water") || amLower.includes("borehole") ? Droplets :
                             amLower.includes("solar") || amLower.includes("sun") ? Sun :
                             amLower.includes("meter") || amLower.includes("light") || amLower.includes("prepaid") ? Zap :
                             amLower.includes("guard") || amLower.includes("security") ? Shield :
                             amLower.includes("wifi") ? Wifi : Building2;
                dynamicFeatures.push({ label: am, icon });
              });
            } else {
              if (descText.includes("water") || descText.includes("borehole")) dynamicFeatures.push({ label: "Borehole Water", icon: Droplets });
              if (descText.includes("solar") || descText.includes("inverter")) dynamicFeatures.push({ label: "Solar Inverter", icon: Sun });
              if (descText.includes("prepaid") || descText.includes("meter") || descText.includes("light")) dynamicFeatures.push({ label: "Prepaid Meter", icon: Zap });
              if (descText.includes("guard") || descText.includes("security") || descText.includes("gated")) dynamicFeatures.push({ label: "Gated Guard", icon: Shield });
              if (descText.includes("fence") || descText.includes("fenced")) dynamicFeatures.push({ label: "Fenced Compound", icon: Building2 });
            }

            if (dynamicFeatures.length === 0) {
              dynamicFeatures.push(
                { label: "Borehole Water", icon: Droplets },
                { label: "Prepaid Meter", icon: Zap },
                { label: "Gated Guard", icon: Shield }
              );
            }

            return {
              id: item.id,
              title: item.title,
              category: item.house_type || "self-contain",
              categoryBadge: item.house_type ? item.house_type.replace(/_/g, " ").toUpperCase() : "Self Contain",
              statusBadge: item.status === "available" ? "Verified & Ready" : "Verified Listing",
              statusBadgeColor: "bg-[#3B82F6]/30 text-[#ADC6FF] border-[#3B82F6]/40",
              address: item.location || "Campus Enclave",
              price: Number(item.price) || 180000,
              priceUnit: "/ year",
              distance: item.distance_from_campus || "5 mins to Gate",
              photoCount: dbImages.length > 0 ? dbImages.length : 4,
              image: primaryImg,
              images: dbImages.length > 0 ? dbImages : [primaryImg],
              description: item.description,
              school: item.school || ownerRecord?.school || (item.location?.toLowerCase().includes("wukari") ? "Federal University Wukari" : (selectedCampus?.name || "Campus")),
              room_listing_amenities: item.room_listing_amenities,
              amenities: dbAmenityList,
              features: dynamicFeatures,
              host: {
                initials: hostInitials,
                name: hostName,
                role: hostRole,
                badge: "Verified Lodge",
                badgeColor: "bg-brand-magenta/20 text-brand-magenta-light border-brand-magenta/30",
                whatsapp: ownerRecord?.whatsapp_number || item.whatsapp_link || item.host_whatsapp || ownerRecord?.phone_number || item.owner_phone || "2348134351762",
                phone: ownerRecord?.phone_number || item.owner_phone || item.host_phone || "08134351762"
              }
            };
          });

          setHousingListings((prev) => {
            const localOnly = prev.filter(p => !formattedDbHouses.some(db => db.id === p.id));
            return [...localOnly, ...formattedDbHouses];
          });
        }
      } catch (err) {
        console.warn("Could not load DB houses:", err);
      }
    };
    loadDbHouses();
  }, [selectedCampus?.name]);

  const toggleBookmark = (id: string) => {
    setSavedNests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePublishHouse = (newHouse: PublishedHouse) => {
    setHousingListings((prev) => [newHouse, ...prev.filter(h => h.id !== newHouse.id)]);
  };

  // Filter listings by active School & search queries
  const filteredListings = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const activeSchoolName = selectedCampus?.name?.toLowerCase() || "";
    const activeSchoolCode = selectedCampus?.code?.toLowerCase() || "";

    // Check if user is searching for a different university explicitly
    const isExplicitSchoolSearch = q.length > 1 && CAMPUS_LIST.some(
      (c) => q.includes(c.name.toLowerCase()) || q.includes(c.code.toLowerCase())
    );

    return housingListings.filter((listing) => {
      // 1. Campus / School Match
      if (!isExplicitSchoolSearch && activeSchoolName) {
        const listingSchool = (listing.school || "").toLowerCase();
        const listingAddress = (listing.address || "").toLowerCase();
        
        const isFuwListing = listingSchool.includes("wukari") || listingSchool.includes("fuw") || listingAddress.includes("wukari");

        // Never show FUW listings to other campuses like UNILAG
        if (activeSchoolCode !== "fuw" && isFuwListing) {
          return false;
        }

        const matchesCurrentSchool =
          listingSchool.includes(activeSchoolName) ||
          activeSchoolName.includes(listingSchool) ||
          listingSchool.includes(activeSchoolCode) ||
          (activeSchoolCode === "fuw" && isFuwListing);

        if (!matchesCurrentSchool) return false;
      }

      // 2. Search Query Filter
      const matchesSearch = !q ||
        listing.title.toLowerCase().includes(q) ||
        listing.address.toLowerCase().includes(q) ||
        listing.category.toLowerCase().includes(q) ||
        listing.distance.toLowerCase().includes(q) ||
        (listing.school && listing.school.toLowerCase().includes(q)) ||
        (listing.description && listing.description.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 3. Budget Slider Filter
      if (listing.price > maxBudget) return false;

      // 4. Category / Pill Filters
      if (activeFilter === "self-contain") {
        return listing.category.toLowerCase().includes("self-contain") || listing.category.toLowerCase().includes("self_contain");
      }
      if (activeFilter === "single-room") {
        return listing.category.toLowerCase().includes("single room") || listing.category.toLowerCase().includes("single_room");
      }
      if (activeFilter === "shared-flat") {
        return listing.category.toLowerCase().includes("shared") || listing.category.toLowerCase().includes("flat");
      }
      if (activeFilter === "under-150k") {
        return listing.price <= 150000;
      }
      if (activeFilter === "walking-dist") {
        return listing.distance.toLowerCase().includes("mins") && (listing.distance.includes("4") || listing.distance.includes("5") || listing.distance.includes("6") || listing.distance.includes("8") || listing.distance.includes("10"));
      }
      if (activeFilter === "solar") {
        return listing.features.some(f => f.label.toLowerCase().includes("solar")) || (listing.description && listing.description.toLowerCase().includes("solar"));
      }
      if (activeFilter === "water") {
        return listing.features.some(f => f.label.toLowerCase().includes("water") || f.label.toLowerCase().includes("borehole"));
      }

      return true;
    });
  }, [housingListings, searchQuery, maxBudget, activeFilter, selectedCampus]);

  return (
    <AppShell>
      <div className="space-y-8 pb-20">
        
        {/* ========================================================================= */}
        {/* 1. HEADER SECTION (Desktop and Mobile) */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Find Your Nest</span>
              <span className="text-3xl">🏡</span>
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Discover vetted, student-friendly lodges and rooms near <span className="text-white font-semibold">{selectedCampus?.name || "campus"}</span>.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="h-9 w-9 rounded-xl bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-brand-violet-light" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">
                  Active Nests
                </div>
                <div className="text-sm font-heading font-extrabold text-white">
                  {filteredListings.length} Lodges
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="h-9 w-9 rounded-xl bg-brand-magenta/20 border border-brand-magenta/30 flex items-center justify-center">
                <Navigation className="h-4 w-4 text-brand-magenta-light" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-text-dim uppercase tracking-wider">
                  Proximity
                </div>
                <div className="text-sm font-heading font-extrabold text-white">
                  &lt; 15 Mins Walk
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. HOUSING SEARCH BAR & CATEGORIES WITH FILTER DROPDOWN */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          
          <div className="flex items-center gap-3 w-full">
            {/* Full-width Search Input Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search lodges in ${selectedCampus?.name || "campus"} or type any university name...`}
                className="w-full h-12 rounded-full border border-white/15 bg-white/[0.04] pl-11 pr-12 text-xs sm:text-sm text-white placeholder:text-text-dim backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all shadow-inner"
              />
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                  isFilterDropdownOpen
                    ? "bg-brand-violet text-white shadow-glow-violet/30"
                    : "bg-white/10 text-text-secondary hover:text-white hover:bg-white/20"
                }`}
                title="Price Filter"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Expandable Price Slider */}
          {isFilterDropdownOpen && (
            <div className="p-4 rounded-3xl bg-[#141029]/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Max Budget Range</span>
                <span className="text-xs font-extrabold text-brand-violet-light font-mono">
                  ₦{maxBudget.toLocaleString()} / year
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="600000"
                step="10000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-brand-violet cursor-pointer h-2 bg-white/10 rounded-lg"
              />
            </div>
          )}

          {/* Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            {HOUSING_FILTER_PILLS.map((pill) => {
              const isActive = activeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-brand-violet text-white shadow-glow-violet/40 scale-105"
                      : "bg-white/[0.04] text-text-dim hover:text-white hover:bg-white/[0.08] border border-white/10"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. HOUSING LISTINGS GRID */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-dim">
            <span>
              Showing <strong className="text-white">{filteredListings.length}</strong> available nests
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((house) => {
              const isSaved = savedNests.includes(house.id);
              const hasVideo = isVideoUrl(house.image) || (house.images && house.images.some(img => isVideoUrl(img)));
              const videoSrc = isVideoUrl(house.image) ? house.image : (house.images?.find(img => isVideoUrl(img)) || "");

              return (
                <GlassCard
                  key={house.id}
                  elevation="elevated"
                  interactive
                  className="rounded-3xl border-white/10 overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:border-brand-violet/50"
                >
                  <div>
                    {/* Media / Photo Box */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      {hasVideo && videoSrc ? (
                        <div className="relative w-full h-full">
                          <video
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1">
                            <Play className="h-2.5 w-2.5 text-brand-magenta-light fill-brand-magenta-light" />
                            <span>Live Video Tour</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={house.image}
                          alt={house.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                        <Badge
                          variant="default"
                          className="bg-[#0E0B1F]/80 backdrop-blur-md border-white/20 text-white font-bold text-[10px] px-2.5 py-1"
                        >
                          {house.categoryBadge}
                        </Badge>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleBookmark(house.id);
                          }}
                          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all ${
                            isSaved
                              ? "bg-brand-magenta text-white border-brand-magenta shadow-glow-magenta"
                              : "bg-black/50 hover:bg-black/80 text-white border-white/20"
                          }`}
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Distance & Proximity Pill */}
                      <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-bold text-brand-blue-light flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-brand-blue-light" />
                        <span>{house.distance}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-heading font-extrabold text-white text-base sm:text-lg group-hover:text-brand-violet-light transition-colors line-clamp-1">
                            {house.title}
                          </h3>
                        </div>
                        <p className="text-xs text-text-dim flex items-center gap-1.5 mt-0.5 line-clamp-1">
                          <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
                          <span>{house.address}</span>
                        </p>
                      </div>

                      {/* Price display */}
                      <div className="flex items-baseline gap-1 pt-1 border-t border-white/5">
                        <span className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                          ₦{house.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-text-dim font-medium">{house.priceUnit}</span>
                      </div>

                      {/* Amenity Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {house.features.slice(0, 3).map((feat, idx) => {
                          const IconComp = getAmenityIcon(feat.icon || feat.label);
                          return (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-text-secondary flex items-center gap-1"
                            >
                              <IconComp className="h-3 w-3 text-brand-violet-light" />
                              <span>{feat.label}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Actions with Vibrant Gradient Button */}
                  <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    {/* View Details & Book Inspection */}
                    <Link href={`/housing/${house.id}`} className="flex-1">
                      <button className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-brand-violet via-[#A855F7] to-brand-magenta text-white text-xs sm:text-sm font-bold shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_25px_rgba(236,72,153,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>

                    {/* WhatsApp Chat Button */}
                    <a
                      href={`https://wa.me/${house.host.whatsapp || "2348134351762"}?text=Hello%20${encodeURIComponent(house.host.name)},%20I%20saw%20your%20listing%20"${encodeURIComponent(house.title)}"%20on%20CampsNest.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/[0.05] hover:bg-emerald-600/20 border border-white/10 hover:border-emerald-500/40 text-text-dim hover:text-emerald-300 transition-all shrink-0"
                      title="Chat Host on WhatsApp"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>

                    {/* Share Button */}
                    <button
                      onClick={() => setShareHouse(house)}
                      className="p-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-text-dim hover:text-white transition-all shrink-0"
                      title="Share Lodge"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="py-16 text-center space-y-4 rounded-3xl bg-[#141029]/60 border border-white/10 p-8">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-2xl">
                🏡
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-extrabold text-white">
                  No Lodges Found for {selectedCampus?.name}
                </h3>
                <p className="text-xs text-text-dim max-w-sm mx-auto">
                  There are no listings matching your current budget or filters for this campus yet. Be the first to post a house!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  onClick={() => setIsPostModalOpen(true)}
                  className="rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold"
                >
                  Post a House
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

        {/* Floating Action Button (FAB) for Post a House */}
        <div className="fixed bottom-20 md:bottom-8 right-5 sm:right-8 z-40">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="h-12 sm:h-14 px-5 sm:px-6 rounded-full bg-gradient-to-r from-brand-violet via-[#A855F7] to-brand-magenta text-white font-bold text-xs sm:text-sm shadow-[0_8px_30px_rgba(236,72,153,0.45)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-white/20 backdrop-blur-md cursor-pointer"
          >
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>+ Post a House</span>
          </button>
        </div>

        {/* Post House Modal */}
        <PostHouseModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onPublish={handlePublishHouse}
          currentCampus={selectedCampus?.name}
        />

        {/* Share Modal */}
        {shareHouse && (
          <ShareModal
            isOpen={!!shareHouse}
            onClose={() => setShareHouse(null)}
            title={shareHouse.title}
            url={typeof window !== "undefined" ? `${window.location.origin}/housing/${shareHouse.id}` : ""}
            description={`Check out ${shareHouse.title} for ₦${shareHouse.price.toLocaleString()} in ${selectedCampus?.name || "campus"} on CampsNest.`}
          />
        )}

      </div>
    </AppShell>
  );
}
