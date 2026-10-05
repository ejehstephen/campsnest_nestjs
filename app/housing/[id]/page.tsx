"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
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
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  PhoneCall, 
  MessageSquare, 
  Lock, 
  Star, 
  Check, 
  Compass, 
  Bike,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Loader2,
  X,
  Play
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { ReportModal } from "@/components/common/report-modal";
import { ShareModal } from "@/components/common/share-modal";
import { fetchHousingListingByIdAction, bookInspectionAction } from "@/lib/housing/actions";
import { HOUSING_LISTINGS, HousingItem } from "@/lib/housing/constants";
import { useAuth } from "@/lib/auth/auth-provider";
import { parseUserName } from "@/lib/utils";
import { isVideoUrl } from "@/lib/utils";

export default function HousingDetailPage({ params }: { params: { id: string } }) {
  const { profile } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [activePhoto, setActivePhoto] = React.useState(0);
  const [inspectionModalOpen, setInspectionModalOpen] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [dbHouse, setDbHouse] = React.useState<any | null>(null);

  // Inspection Form State
  const [inspectionDate, setInspectionDate] = React.useState("");
  const [inspectionTime, setInspectionTime] = React.useState("10:00 AM - 12:00 PM");
  const [inspectionNotes, setInspectionNotes] = React.useState("");
  const [isBooking, setIsBooking] = React.useState(false);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // 1. First check localStorage for immediate instant rendering of custom posted lodges
    if (typeof window !== "undefined") {
      try {
        const localLodges = JSON.parse(localStorage.getItem("campsnest_custom_lodges") || "[]");
        const match = localLodges.find((l: any) => l.id === params.id);
        if (match) {
          setDbHouse(match);
        }
      } catch (e) {
        console.warn("Could not read local lodges:", e);
      }
    }

    // 2. Fetch live from Supabase database
    const loadHouse = async () => {
      try {
        const res = await fetchHousingListingByIdAction(params.id);
        if (res.success && res.item) {
          setDbHouse(res.item);
        }
      } catch (err) {
        console.warn("Could not fetch DB house:", err);
      }
    };
    loadHouse();
  }, [params.id]);

  // Fallback to mock item if not in DB or local cache
  const fallbackHouse = HOUSING_LISTINGS.find((h) => h.id === params.id);
  const house = dbHouse || fallbackHouse || {
    id: params.id,
    title: "Campus Student Accommodation",
    category: "Self Contain",
    categoryBadge: "Self Contain",
    statusBadge: "Verified & Ready",
    statusBadgeColor: "bg-[#3B82F6]/30 text-[#ADC6FF] border-[#3B82F6]/40",
    address: "Greenfield Estate, Opp. Old Library Annex, Wukari",
    price: 240000,
    priceUnit: "/ year",
    distance: "6 mins to Gate",
    photoCount: 4,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Fully tiled executive student accommodation with constant borehole water, dedicated prepaid meter, perimeter electric fence, and solar inverter backup.",
    features: [
      { label: "24/7 Water", icon: Droplets },
      { label: "Prepaid", icon: Zap },
      { label: "Gated Sec", icon: Shield },
      { label: "Fenced", icon: Building2 }
    ],
    host: {
      initials: "KA",
      name: "Kelechi A.",
      role: "Student Verified Host (Level 400)",
      badge: "No Agent Fee",
      badgeColor: "bg-brand-magenta/20 text-brand-magenta-light border-brand-magenta/30",
      whatsapp: "2348123456789",
      phone: "08123456789"
    }
  };

  const dbImages = (house.room_listing_images || []).map((r: any) => r.images || r.image).filter(Boolean);
  const rawImages: string[] = house.images && house.images.length > 0
    ? house.images
    : dbImages.length > 0
    ? dbImages
    : house.image
    ? [house.image]
    : [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
      ];

  const galleryImages = rawImages.map((url, idx) => ({
    url,
    isVideo: isVideoUrl(url),
    title: isVideoUrl(url)
      ? "Video Tour Walkthrough"
      : idx === 0 ? "Main Room / Studio" : idx === 1 ? "Ensuite Bathroom" : idx === 2 ? "Kitchenette" : `Exterior / Angle #${idx + 1}`
  }));

  const currentMedia = galleryImages[activePhoto] || galleryImages[0];

  const rawTitle = house.title || "Campus Accommodation";
  const title = /^\+?[0-9\s-]{7,16}$/.test(rawTitle.trim()) 
    ? (house.location ? `Executive Lodge (${house.location})` : "Executive Student Lodge") 
    : rawTitle;
  const price = Number(house.price) || 180000;
  const address = house.address || house.location || "Campus Neighborhood, Wukari";
  const distance = house.distance || house.distance_from_campus || "5 mins to Gate";
  const categoryBadge = house.categoryBadge || (house.house_type ? house.house_type.replace(/_/g, " ").toUpperCase() : "Self Contain");
  const description = house.description || "Clean, fully tiled student accommodation with reliable amenities and safe campus walking distance.";

  // Dynamic host profile extraction from Supabase owner relation or local listing
  const ownerRecord = house.owner || null;
  const hostName = parseUserName(ownerRecord, null, house.host?.name || house.host_name || "Verified Student Host");
  const hostAvatar = house.host?.avatar || (ownerRecord?.profile_image && !ownerRecord.profile_image.includes("example.com") ? ownerRecord.profile_image : "") || "";
  const hostRole = ownerRecord?.level || house.host?.role || house.host_role || (ownerRecord?.role === "admin" ? "Verified Host Admin" : "Student Host");
  const hostSchool = ownerRecord?.school || house.school || "Federal University Wukari";
  const hostPhone = ownerRecord?.phone_number || house.owner_phone || house.host?.phone || house.host_phone || "";
  const hostWhatsapp = ownerRecord?.whatsapp_number || house.whatsapp_link || house.host?.whatsapp || house.host_whatsapp || ownerRecord?.phone_number || house.owner_phone || "";
  const hostInitials = hostName.split(" ").filter(Boolean).map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "VH";

  // Dynamic Verified Facilities & Utilities Resolution
  const AMENITY_CATALOG: Record<string, { title: string; subtitle: string; icon: any; color: string }> = {
    borehole_water: { title: "Treated Borehole", subtitle: "24/7 Flowing water", icon: Droplets, color: "bg-blue-500/20 text-blue-300" },
    water: { title: "Treated Borehole", subtitle: "24/7 Flowing water", icon: Droplets, color: "bg-blue-500/20 text-blue-300" },
    borehole: { title: "Treated Borehole", subtitle: "24/7 Flowing water", icon: Droplets, color: "bg-blue-500/20 text-blue-300" },
    solar_inverter: { title: "Solar Inverter", subtitle: "Guaranteed power backup", icon: Sun, color: "bg-pink-500/20 text-pink-300" },
    solar: { title: "Solar Inverter", subtitle: "Guaranteed power backup", icon: Sun, color: "bg-pink-500/20 text-pink-300" },
    prepaid_meter: { title: "Prepaid Meter", subtitle: "Individual unit billing", icon: Zap, color: "bg-amber-500/20 text-amber-300" },
    light: { title: "Dedicated Power", subtitle: "Prepaid / regular line", icon: Zap, color: "bg-amber-500/20 text-amber-300" },
    prepaid: { title: "Prepaid Meter", subtitle: "Individual unit billing", icon: Zap, color: "bg-amber-500/20 text-amber-300" },
    gated_security: { title: "24h Gated Security", subtitle: "Secured student compound", icon: Shield, color: "bg-indigo-500/20 text-indigo-300" },
    security: { title: "24h Guard & Gate", subtitle: "Secured student compound", icon: Shield, color: "bg-indigo-500/20 text-indigo-300" },
    guard: { title: "Gated Guard", subtitle: "Secured checkpoint", icon: Shield, color: "bg-indigo-500/20 text-indigo-300" },
    wifi_network: { title: "Campus Wi-Fi", subtitle: "High-speed study connection", icon: Wifi, color: "bg-cyan-500/20 text-cyan-300" },
    wifi: { title: "Fast Campus Wi-Fi", subtitle: "High-speed study connection", icon: Wifi, color: "bg-cyan-500/20 text-cyan-300" },
    cctv: { title: "CCTV Surveillance", subtitle: "24/7 Monitored security", icon: Video, color: "bg-emerald-500/20 text-emerald-300" },
    electric_fence: { title: "Perimeter Fence", subtitle: "High security boundary", icon: Building2, color: "bg-purple-500/20 text-purple-300" },
    fenced: { title: "Electric Perimeter", subtitle: "High security boundary", icon: Building2, color: "bg-purple-500/20 text-purple-300" },
    fence: { title: "Perimeter Fence", subtitle: "Gated student compound", icon: Building2, color: "bg-purple-500/20 text-purple-300" },
    private_kitchen: { title: "Private Kitchen", subtitle: "Ensuite kitchenette", icon: Sparkles, color: "bg-orange-500/20 text-orange-300" },
    kitchen: { title: "Private Kitchen", subtitle: "Ensuite kitchenette", icon: Sparkles, color: "bg-orange-500/20 text-orange-300" },
    ensuite_toilet: { title: "Ensuite Bathroom", subtitle: "Private tiled toilet", icon: Droplets, color: "bg-teal-500/20 text-teal-300" },
    toilet: { title: "Ensuite Bathroom", subtitle: "Private tiled toilet", icon: Droplets, color: "bg-teal-500/20 text-teal-300" },
    bathroom: { title: "Ensuite Bathroom", subtitle: "Private shower & toilet", icon: Droplets, color: "bg-teal-500/20 text-teal-300" }
  };

  // Collect from all sources
  const rawDbAmenities: string[] = (house.room_listing_amenities || []).map((a: any) => (a.amenities || a.amenity || "").toLowerCase()).filter(Boolean);
  const rawHouseAmenities: string[] = (house.amenities || []).map((a: string) => a.toLowerCase());
  const rawFeatures: string[] = (house.features || []).map((f: any) => (f.label || "").toLowerCase());
  const descLower = description.toLowerCase();

  const detectedKeys = new Set<string>();

  [...rawDbAmenities, ...rawHouseAmenities, ...rawFeatures].forEach((item) => {
    Object.keys(AMENITY_CATALOG).forEach((key) => {
      if (item.includes(key) || key.includes(item)) {
        detectedKeys.add(key);
      }
    });
  });

  // Check description text for mentions
  if (descLower.includes("water") || descLower.includes("borehole")) detectedKeys.add("water");
  if (descLower.includes("solar") || descLower.includes("inverter")) detectedKeys.add("solar");
  if (descLower.includes("prepaid") || descLower.includes("meter")) detectedKeys.add("prepaid");
  if (descLower.includes("guard") || descLower.includes("security")) detectedKeys.add("security");
  if (descLower.includes("fence") || descLower.includes("fenced")) detectedKeys.add("fenced");
  if (descLower.includes("wifi") || descLower.includes("wi-fi")) detectedKeys.add("wifi");
  if (descLower.includes("cctv") || descLower.includes("camera")) detectedKeys.add("cctv");
  if (descLower.includes("kitchen")) detectedKeys.add("kitchen");
  if (descLower.includes("toilet") || descLower.includes("bathroom") || descLower.includes("ensuite")) detectedKeys.add("bathroom");

  // If none detected, fall back to core essentials
  if (detectedKeys.size === 0 && rawDbAmenities.length === 0 && rawHouseAmenities.length === 0) {
    ["water", "prepaid", "security", "fenced"].forEach(k => detectedKeys.add(k));
  }

  const dynamicAmenities: { title: string; subtitle: string; icon: any; color: string }[] = [];
  const addedTitles = new Set<string>();

  detectedKeys.forEach((key) => {
    const matched = AMENITY_CATALOG[key];
    if (matched && !addedTitles.has(matched.title)) {
      dynamicAmenities.push(matched);
      addedTitles.add(matched.title);
    }
  });

  // Also include any raw DB amenity that wasn't mapped by keyword
  [...rawDbAmenities, ...rawHouseAmenities].forEach((rawAm) => {
    const formattedTitle = rawAm.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (!addedTitles.has(formattedTitle) && !Array.from(addedTitles).some(t => t.toLowerCase().includes(rawAm.toLowerCase()))) {
      dynamicAmenities.push({
        title: formattedTitle,
        subtitle: "Verified Amenity",
        icon: Building2,
        color: "bg-brand-violet/20 text-brand-violet-light",
      });
      addedTitles.add(formattedTitle);
    }
  });

  const handlePrevPhoto = () => {
    setActivePhoto((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNextPhoto = () => {
    setActivePhoto((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-24 max-w-7xl mx-auto">
        
        {/* ========================================================================= */}
        {/* 1. TOP BREADCRUMB & HEADER ACTIONS */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-2 text-xs py-1">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden text-text-dim">
            <Link
              href="/housing"
              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-brand-violet-light transition-colors shrink-0 bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1.5 rounded-full border border-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Lodges</span>
            </Link>
            
            <div className="hidden sm:flex items-center gap-1.5 truncate">
              <span>/</span>
              <Link href="/housing" className="hover:text-white transition-colors">Housing</Link>
              <span>/</span>
              <span className="hover:text-white transition-colors">{hostSchool}</span>
              <span>/</span>
              <span className="text-white font-semibold truncate max-w-[220px] lg:max-w-none">
                {title}
              </span>
            </div>
          </div>

          {/* Action buttons on Right */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] sm:text-xs font-bold transition-all"
            >
              <Shield className="h-3.5 w-3.5 text-rose-400" />
              <span>Report</span>
            </button>
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-[11px] sm:text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <Share2 className="h-3.5 w-3.5 text-brand-magenta-light" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 sm:p-2 rounded-full border transition-all ${
                isBookmarked
                  ? "bg-brand-magenta text-white border-transparent shadow-glow-magenta/40"
                  : "bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/10"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MEDIA GALLERY & RIGHT DETAILS LAYOUT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: Multi-Photo Gallery & Amenities */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Hero Photo / Video Container */}
            <div className="space-y-3">
              <div className="relative h-[360px] sm:h-[460px] w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group flex items-center justify-center">
                {currentMedia?.isVideo ? (
                  <video
                    key={currentMedia.url}
                    src={currentMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <img
                    src={currentMedia?.url || galleryImages[0]?.url}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none z-10">
                  {currentMedia?.isVideo && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-extrabold shadow-lg animate-pulse border border-rose-400/40">
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>VIDEO WALKTHROUGH</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181232]/85 backdrop-blur-md border border-brand-violet/40 text-xs font-bold text-brand-violet-light shadow-lg">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{categoryBadge}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-lg">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>VERIFIED PROPERTY</span>
                  </span>
                </div>

                {/* Gallery Next / Prev Controls */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 hover:opacity-100 transition-all shadow-xl hover:scale-110 z-10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 hover:opacity-100 transition-all shadow-xl hover:scale-110 z-10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Bottom Overlays */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                    {currentMedia?.isVideo ? (
                      <Video className="h-3.5 w-3.5 text-rose-400" />
                    ) : (
                      <Camera className="h-3.5 w-3.5 text-brand-magenta-light" />
                    )}
                    <span>{activePhoto + 1} of {galleryImages.length} {currentMedia?.isVideo ? "Tour Video" : "Photos"}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-[#D0BCFF] shadow-lg">
                    <Navigation className="h-3.5 w-3.5 text-brand-magenta" />
                    <span>{distance}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhoto(idx)}
                      className={`relative h-20 w-24 rounded-2xl overflow-hidden border transition-all shrink-0 bg-[#18142E] group ${
                        activePhoto === idx
                          ? "border-brand-magenta scale-105 shadow-glow-magenta/50 ring-2 ring-brand-magenta/40"
                          : "border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {img.isVideo ? (
                        <div className="w-full h-full relative bg-black flex items-center justify-center">
                          <video
                            src={img.url}
                            className="w-full h-full object-cover pointer-events-none opacity-70"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="h-7 w-7 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-1 left-1 right-1 text-center pointer-events-none">
                        <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider truncate block">
                          {img.isVideo ? "▶ VIDEO" : img.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Overview */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-3.5 shadow-xl">
              <h3 className="text-sm font-heading font-extrabold text-white flex items-center gap-2">
                <span className="text-brand-violet-light">🏡</span>
                <span>Accommodation Description & House Rules</span>
              </h3>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Verified Amenities Grid */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-heading font-extrabold text-white flex items-center gap-2">
                <span className="text-brand-violet-light">✨</span>
                <span>Verified Facilities & Utilities</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
                {dynamicAmenities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all space-y-1 group"
                    >
                      <div className={`h-8 w-8 rounded-xl ${item.color} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{item.title}</span>
                        <span className="text-emerald-400 text-[10px]">✓</span>
                      </div>
                      <div className="text-[10px] text-text-dim truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Rent Card & Host Profile */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            
            {/* Main Rent & Contact Card */}
            <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#1C153B]/95 to-[#120D26]/95 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  DIRECT VERIFIED LODGE
                </span>
                <span className="text-text-dim">Zero Agent Fee</span>
              </div>

              {/* Title & Pricing */}
              <div className="space-y-2">
                <h1 className="text-lg sm:text-xl font-heading font-extrabold text-white leading-snug">
                  {title}
                </h1>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                    ₦{price.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-dim">/ year</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-text-dim pt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-magenta shrink-0" />
                  <span className="truncate">{address}</span>
                </div>
              </div>

              {/* Direct In-App & WhatsApp Contact CTAs */}
              <div className="space-y-2.5 pt-1">
                <Link
                  href={`/messages/h-${params.id}?context=housing&id=${params.id}&name=${encodeURIComponent(hostName)}&title=${encodeURIComponent(title)}&price=${price}${galleryImages[0]?.url && !galleryImages[0]?.url.startsWith("data:") && galleryImages[0]?.url.length < 300 ? `&image=${encodeURIComponent(galleryImages[0].url)}` : ""}`}
                  className="block w-full"
                >
                  <button className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta hover:brightness-110 text-white text-xs sm:text-sm font-extrabold shadow-[0_4px_20px_rgba(236,72,153,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>In-App Message Host 💬</span>
                  </button>
                </Link>

                {hostWhatsapp ? (
                  <a
                    href={`https://wa.me/${hostWhatsapp.replace(/\+/g, "").replace(/\s+/g, "").replace(/-/g, "")}?text=${encodeURIComponent(`Hi ${hostName}, I am inquiring about "${title}" listed for ₦${price.toLocaleString()} on CampsNest Housing.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-102">
                      <span className="text-sm">💬</span>
                      <span>Chat with Host on WhatsApp</span>
                    </button>
                  </a>
                ) : null}

                {hostPhone && (
                  <a
                    href={`tel:${hostPhone}`}
                    className="block w-full"
                  >
                    <button className="w-full py-2.5 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
                      <PhoneCall className="h-3.5 w-3.5 text-brand-magenta-light" />
                      <span>Call Host ({hostPhone})</span>
                    </button>
                  </a>
                )}
              </div>

              {/* Safety Footnote */}
              <div className="flex items-center justify-between text-[10px] text-text-dim px-1 pt-1 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Student Safety Verified</span>
                </div>
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="flex items-center gap-1 hover:text-rose-300 text-text-dim transition-colors"
                >
                  <Flag className="h-3 w-3 text-rose-400" />
                  <span>Report Listing</span>
                </button>
              </div>
            </div>

            {/* Host Profile Card (Dynamic Poster Identity) */}
            <div className="p-5 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar
                      src={hostAvatar}
                      name={hostName}
                      alt={hostName}
                      size="lg"
                      className="h-12 w-12 border-2 border-brand-violet"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#141029] flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-black stroke-[3]" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                      {hostName}
                    </h4>
                    <p className="text-[11px] text-text-dim truncate">
                      {hostRole} • {hostSchool}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Host ID ✓
                  </span>
                  <Link href="/profile" className="text-[10px] text-brand-violet-light hover:underline font-semibold">
                    Profile →
                  </Link>
                </div>
              </div>

              {/* Host Badges & Live Status */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>5.0 ★ Host</span>
                  <span className="text-text-dim font-normal text-[10px]">(Verified)</span>
                </div>

                <div className="flex items-center gap-1.5 text-brand-blue-light font-bold justify-end">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Instant</span>
                  <span className="text-text-dim font-normal text-[10px]">Response</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title={title}
          price={price}
          category="Housing"
          image={galleryImages[0]?.url}
          description={description}
        />

        {/* Safety Report Modal */}
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          targetTitle={title}
          targetType="listing"
        />

      </div>
    </AppShell>
  );
}
