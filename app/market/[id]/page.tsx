"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  Bookmark, 
  Share2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  Camera,
  Battery,
  Shield,
  Layers,
  HeartHandshake,
  Check,
  Star,
  Lock,
  Eye,
  Flag,
  Calendar,
  UserCheck,
  Headphones,
  BookOpen,
  Monitor,
  Bike,
  ChevronLeft,
  ChevronRight,
  Tag
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ReportModal } from "@/components/common/report-modal";
import { ShareModal } from "@/components/common/share-modal";
import { fetchMarketItemByIdAction, fetchMarketItemsAction } from "@/lib/market/actions";
import { Avatar } from "@/components/ui/avatar";
import { MARKET_PRODUCTS, MarketItem } from "@/lib/market/constants";

export default function MarketProductDetailPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [activePhoto, setActivePhoto] = React.useState(0);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [dbItem, setDbItem] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [relatedDeals, setRelatedDeals] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);
    const loadItem = async () => {
      setIsLoading(true);
      try {
        const [res, allRes] = await Promise.all([
          fetchMarketItemByIdAction(params.id),
          fetchMarketItemsAction()
        ]);
        if (res.success && res.item) {
          setDbItem(res.item);
        }
        if (allRes.success && allRes.items?.length > 0) {
          const others = allRes.items
            .filter((i: any) => i.id !== params.id)
            .slice(0, 4)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              category: item.category ? (item.category.charAt(0).toUpperCase() + item.category.slice(1)) : "Essentials",
              location: item.location || "Campus Main Gate",
              price: Number(item.price) || 0,
              sellerLevel: item.seller_level || "Student Seller",
              image: item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80",
              description: item.description || "Campus item ready for inspection"
            }));
          setRelatedDeals(others);
        }
      } catch (e) {
        console.warn("Could not fetch DB item:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadItem();
  }, [params.id]);

  // Fallback matching from static market products if DB item is not yet present
  const mockFallback = MARKET_PRODUCTS.find((p) => p.id === params.id);
  const item = dbItem || mockFallback || {
    id: params.id,
    title: "Campus Marketplace Item",
    description: "Verified student listing in great condition. Available for quick campus inspection and safe handoff.",
    condition_badge: "MINT CONDITION",
    condition_color: "bg-[#1E293B]/80 text-emerald-300 border-emerald-500/30",
    price: 35000,
    category: "Market",
    location: "Hostel Block B, Main Campus",
    is_negotiable: true,
    seller_name: "Verified Student",
    seller_level: "300 Level",
    seller_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    seller_whatsapp: "",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop&q=80",
    images: []
  };

  // Extract raw images cleanly
  const rawImages: string[] = item.images && item.images.length > 0
    ? item.images
    : item.image
    ? [item.image]
    : [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop&q=80"
      ];

  const galleryImages = rawImages.map((url, idx) => ({
    url,
    tag: idx === 0 ? "Main Photo" : `Angle #${idx + 1}`
  }));

  // Title, price, category, condition
  const title = item.title || "Campus Marketplace Item";
  const category = item.category ? (item.category.charAt(0).toUpperCase() + item.category.slice(1)) : "Electronics";
  const price = Number(item.price) || 0;
  const originalPrice = item.original_price ? Number(item.original_price) : item.originalPrice ? Number(item.originalPrice) : undefined;
  const conditionBadge = item.condition_badge || item.conditionBadge || "MINT CONDITION";
  const conditionColor = item.condition_color || item.conditionColor || "bg-[#1E293B]/80 text-emerald-300 border-emerald-500/30";
  const isNegotiable = item.is_negotiable !== undefined ? item.is_negotiable : item.isNegotiable !== undefined ? item.isNegotiable : true;
  const description = item.description || "Clean, verified item in great condition. Available for quick campus inspection.";
  const location = item.location || "Campus Hostel / Faculty";
  const sellerName = item.seller_name || item.seller?.name || "Verified Student";
  const sellerLevel = item.seller_level || item.seller?.level || "Campus Resident";
  const sellerAvatar = (item.seller_avatar || item.seller?.avatar) && !item.seller_avatar?.includes("example.com")
    ? (item.seller_avatar || item.seller?.avatar)
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
  const sellerWhatsapp = item.seller_whatsapp || item.seller?.whatsapp || "";

  // Dynamic Item Attributes
  const itemSpecs = [
    {
      title: "Campus Pickup Point",
      value: location.split(",")[0] || location,
      sub: location.split(",")[1] || "Campus Handoff",
      accent: "text-white"
    },
    {
      title: "Item Condition",
      value: conditionBadge,
      sub: "Verified by seller",
      accent: "text-emerald-300"
    },
    {
      title: "Category",
      value: category,
      sub: "Campus Marketplace",
      accent: "text-brand-magenta-light"
    },
    {
      title: "Price Flexibility",
      value: isNegotiable ? "Open to Offers" : "Fixed Price",
      sub: isNegotiable ? "Chat to negotiate" : "Non-negotiable",
      accent: "text-brand-violet-light"
    },
    {
      title: "Inspection",
      value: "Test on Meetup",
      sub: "Pay after check",
      accent: "text-brand-blue-light"
    },
    {
      title: "Safety Escrow",
      value: "100% Protected",
      sub: "Zero listing fees",
      accent: "text-emerald-400"
    }
  ];

  const hostelDeals = relatedDeals;

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
          {/* Back button & Breadcrumbs */}
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden text-text-dim">
            <Link
              href="/market"
              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-brand-violet-light transition-colors shrink-0 bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1.5 rounded-full border border-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
            
            <div className="hidden sm:flex items-center gap-1.5 truncate">
              <span>/</span>
              <Link href="/market" className="hover:text-white transition-colors">Market</Link>
              <span>/</span>
              <span className="hover:text-white transition-colors">{category}</span>
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
          
          {/* LEFT 8 COLUMNS: Multi-Photo Gallery & Hardware Specs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Hero Photo Container */}
            <div className="space-y-3">
              <div className="relative h-[360px] sm:h-[460px] w-full rounded-3xl overflow-hidden bg-[#18142E] border border-white/10 shadow-2xl group">
                <img
                  src={galleryImages[activePhoto]?.url || galleryImages[0]?.url}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-lg ${conditionColor}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span>{conditionBadge}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-magenta/80 backdrop-blur-md border border-brand-magenta/40 text-xs font-bold text-white shadow-lg">
                    <Tag className="h-3 w-3" />
                    <span>{category.toUpperCase()}</span>
                  </span>
                </div>

                {/* Left / Right Carousel Arrow Controls */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 hover:opacity-100 transition-all shadow-xl hover:scale-110"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 hover:opacity-100 transition-all shadow-xl hover:scale-110"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Bottom Overlays */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                    <Camera className="h-3.5 w-3.5 text-brand-magenta-light" />
                    <span>{activePhoto + 1} of {galleryImages.length} Photos</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-400 shadow-lg">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>STUDENT VERIFIED</span>
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
                      className={`relative h-20 w-24 rounded-2xl overflow-hidden border transition-all shrink-0 bg-[#18142E] ${
                        activePhoto === idx
                          ? "border-brand-magenta scale-105 shadow-glow-magenta/50 ring-2 ring-brand-magenta/40"
                          : "border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.tag}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1 left-1 right-1 text-center">
                        <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider truncate block">
                          {img.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Key Details & Overview Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-heading font-extrabold text-white flex items-center gap-2">
                <span className="text-brand-violet-light">📋</span>
                <span>Listing Overview & Campus Specs</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
                {itemSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1"
                  >
                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
                      {spec.title}
                    </span>
                    <div className={`text-xs sm:text-sm font-extrabold truncate ${spec.accent}`}>
                      {spec.value}
                    </div>
                    <div className="text-[10px] text-text-dim truncate">
                      {spec.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Purchase Actions, Seller Profile, Safe Handoff Zone */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            
            {/* Main Purchase Card */}
            <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#1C153B]/95 to-[#120D26]/95 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-5">
              
              {/* Deal Eyebrows */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30 uppercase tracking-wider">
                  FUW STUDENT DEAL
                </span>
                <span className="text-text-dim flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Verified Listing</span>
                </span>
              </div>

              {/* Title & Pricing */}
              <div className="space-y-2">
                <h1 className="text-lg sm:text-xl font-heading font-extrabold text-white leading-snug">
                  {title}
                </h1>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                      ₦{price.toLocaleString()}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-xs text-text-dim line-through">
                        ₦{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-brand-magenta text-white shadow-glow-magenta/40 text-center leading-tight">
                    {isNegotiable ? "Negotiable" : "Fixed Price"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-text-dim pt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-magenta shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              </div>

              {/* Description Box */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <span className="text-[9px] font-extrabold text-brand-violet-light uppercase tracking-wider block">
                  ITEM DESCRIPTION & DETAILS
                </span>
                <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Link 
                  href={`/messages/m-${params.id}?context=market&id=${params.id}&name=${encodeURIComponent(sellerName)}&title=${encodeURIComponent(title)}&price=${price}${galleryImages[0]?.url && !galleryImages[0]?.url.startsWith("data:") && galleryImages[0]?.url.length < 300 ? `&image=${encodeURIComponent(galleryImages[0].url)}` : ""}`} 
                  className="block w-full"
                >
                  <button className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9D74FF] hover:to-[#F472B6] text-white text-xs font-bold shadow-[0_4px_20px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>In-App Message & Make Offer 💬</span>
                  </button>
                </Link>

                {sellerWhatsapp && (
                  <a 
                    href={`https://wa.me/${sellerWhatsapp.replace(/\+/g, "").replace(/\s+/g, "")}?text=${encodeURIComponent(`Hi ${sellerName}, I am interested in your listing: "${title}" on CampsNest Marketplace.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-102">
                      <span>💬 Chat on WhatsApp</span>
                    </button>
                  </a>
                )}
              </div>

              {/* Escrow Footnote */}
              <div className="flex items-center justify-between text-[10px] text-text-dim px-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Campus Handoff Protection</span>
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

            {/* Seller Profile Card */}
            <div className="p-5 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar
                      src={sellerAvatar}
                      name={sellerName}
                      alt={sellerName}
                      size="md"
                      className="h-11 w-11"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border border-black flex items-center justify-center">
                      <Check className="h-2 w-2 text-black stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {sellerName}
                    </h4>
                    <p className="text-[10px] text-text-dim">
                      {sellerLevel} • FU Wukari
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Student ID ✓
                  </span>
                  <Link href="/profile" className="text-[10px] text-brand-violet-light hover:underline">
                    Profile →
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>4.9 ★ Rating</span>
                  <span className="text-text-dim font-normal text-[10px]">(Verified)</span>
                </div>

                <div className="flex items-center gap-1.5 text-brand-blue-light font-bold justify-end">
                  <Zap className="h-3.5 w-3.5" />
                  <span>~5 Mins</span>
                  <span className="text-text-dim font-normal text-[10px]">Response Rate</span>
                </div>
              </div>

              <div className="text-[10px] text-text-dim pt-1 border-t border-white/5 truncate">
                📍 {location}
              </div>
            </div>

            {/* CampsNest Safe Handoff Zone Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#201438]/90 to-[#120B20]/90 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤝</span>
                <h4 className="text-xs font-heading font-extrabold text-white">
                  CampsNest Safe Handoff Zone
                </h4>
              </div>

              <p className="text-[11px] text-text-secondary leading-relaxed">
                Suggested Meetup Spot: <strong className="text-white">FUW Main Library Ground Floor</strong> or <strong className="text-white">Campus Cafe</strong>. Inspect thoroughly, test the item, and pay via instant bank transfer only after you're 100% satisfied.
              </p>

              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-brand-blue-light pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
                <span>Verified Campus Security Monitored Spot</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MORE DEALS IN HOSTEL / CAMPUS */}
        {/* ========================================================================= */}
        {hostelDeals.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-base sm:text-lg font-heading font-extrabold text-white">
                  More Deals on Campus
                </h3>
                <p className="text-xs text-text-secondary">
                  Skip shipping delays — inspect and pick up right inside your residence hall or faculty.
                </p>
              </div>

              <Link
                href="/market"
                className="text-xs font-bold text-brand-violet-light hover:underline shrink-0"
              >
                Browse all listings →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hostelDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/market/${deal.id}`}
                  className="block"
                >
                  <div className="rounded-3xl border border-white/10 bg-[#141029]/80 hover:bg-[#181432]/90 hover:border-white/20 p-3.5 space-y-3 group transition-all h-full">
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-[#18142E]">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                      
                      {/* Category Pill */}
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {deal.category}
                      </span>

                      {/* Location Overlay */}
                      <div className="absolute bottom-2 left-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-white/90 truncate">
                        📍 {deal.location}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-violet-light transition-colors">
                        {deal.title}
                      </h4>
                      <p className="text-[10px] text-text-dim truncate">
                        {deal.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-heading font-extrabold text-white">
                          ₦{deal.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-text-dim">
                          {deal.sellerLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Mobile Fixed Bottom Buying Action Bar */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#0E0B1F]/95 backdrop-blur-2xl border-t border-white/10 p-3.5 z-40 pb-safe flex items-center justify-between gap-3 shadow-[0_-8px_32px_rgba(0,0,0,0.8)]">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-heading font-extrabold text-white">
                ₦{price.toLocaleString()}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-text-dim line-through">
                  ₦{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[9px] text-brand-magenta-light font-medium">
              {isNegotiable ? "Open to Offers" : "Verified Campus Deal"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {sellerWhatsapp && (
              <a 
                href={`https://wa.me/${sellerWhatsapp.replace(/\+/g, "").replace(/\s+/g, "")}?text=${encodeURIComponent(`Hi ${sellerName}, I am interested in your listing: "${title}" on CampsNest.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="h-10 px-3 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                  <span>💬 WhatsApp</span>
                </button>
              </a>
            )}
            <Link href={`/messages?user=${encodeURIComponent(sellerName)}&item=${encodeURIComponent(title)}`}>
              <button className="h-10 px-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-extrabold shadow-lg active:scale-95 transition-all flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Message</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Share Listing Modal */}
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title={title}
          price={price}
          category={category}
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
