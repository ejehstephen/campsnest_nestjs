"use client";

import * as React from "react";
import { 
  X, 
  Sparkles, 
  Upload, 
  Tag, 
  ShoppingBag, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Layers, 
  ShieldCheck, 
  Check, 
  Info,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-provider";
import { compressMarketImage } from "@/lib/utils";
import { createMarketItemAction } from "@/lib/market/actions";

export interface PublishedItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  conditionBadge: string;
  conditionColor: string;
  price: number;
  originalPrice?: number;
  isNegotiable?: boolean;
  location: string;
  postedTime: string;
  image: string;
  images?: string[];
  seller: {
    name: string;
    level: string;
    avatar: string;
    verified: boolean;
    whatsapp?: string;
  };
}

interface SellItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (item: PublishedItem) => void;
  currentCampus?: string;
}

const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "computers", label: "Computers & Laptops", icon: "💻" },
  { id: "books", label: "Books & Study Material", icon: "📚" },
  { id: "essentials", label: "Hostel Essentials", icon: "🛏️" },
  { id: "fashion", label: "Fashion & Wears", icon: "👟" },
  { id: "gaming", label: "Gaming & Fun", icon: "🎮" },
  { id: "others", label: "Other Items", icon: "📦" }
];

const CONDITIONS = [
  { 
    id: "brand_new", 
    label: "Brand New", 
    desc: "Unopened / unused in original packaging", 
    badgeText: "BRAND NEW IN BOX",
    badgeColor: "bg-[#142A4D]/80 text-blue-300 border-blue-500/30" 
  },
  { 
    id: "like_new", 
    label: "Like New", 
    desc: "Pristine, used for only 1 semester", 
    badgeText: "MINT CONDITION",
    badgeColor: "bg-[#1E293B]/80 text-emerald-300 border-emerald-500/30" 
  },
  { 
    id: "gently_used", 
    label: "Gently Used", 
    desc: "Fully functional, minor cosmetic wear", 
    badgeText: "GENTLY USED 2 SEMESTERS",
    badgeColor: "bg-[#3D1432]/80 text-pink-300 border-pink-500/30" 
  },
  { 
    id: "fairly_used", 
    label: "Fairly Used", 
    desc: "Works well, budget friendly", 
    badgeText: "FAIRLY USED",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" 
  }
];

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580481077197-28e67fef2954?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
];

const CAMPUS_LOCATIONS = [
  "Hostel Block B, Main Campus",
  "Hostel Block D, Room 14",
  "Faculty of Science Complex",
  "Faculty of Technology Annex",
  "North Gate Shuttle Park",
  "University Library Quad",
  "College Road / Staff Quarters"
];

export function SellItemModal({ isOpen, onClose, onPublish, currentCampus }: SellItemModalProps) {
  const { profile } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Wizard Steps (1 = Details & Photos, 2 = Price & Condition, 3 = Location & Preview, 4 = Success)
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("electronics");
  const [image, setImage] = React.useState(SAMPLE_PHOTOS[0]);
  const [imagesList, setImagesList] = React.useState<string[]>([SAMPLE_PHOTOS[0]]);
  const [price, setPrice] = React.useState<string>("35000");
  const [originalPrice, setOriginalPrice] = React.useState<string>("45000");
  const [isNegotiable, setIsNegotiable] = React.useState(true);
  const [conditionId, setConditionId] = React.useState("like_new");
  const [description, setDescription] = React.useState("");
  const [location, setLocation] = React.useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = React.useState("");
  const [isPublishing, setIsPublishing] = React.useState(false);

  // Reset when opened
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsPublishing(false);
    }
  }, [isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        const compressedList = await Promise.all(
          files.map((file) => compressMarketImage(file))
        );
        setImagesList((prev) => [...compressedList, ...prev].slice(0, 6));
        setImage(compressedList[0]);
      } catch (err) {
        console.error("Error compressing images:", err);
      }
    }
  };

  if (!isOpen) return null;

  const activeCondition = CONDITIONS.find((c) => c.id === conditionId) || CONDITIONS[1];
  const finalLocation = customLocation.trim() || location;
  const numericPrice = Number(price.replace(/,/g, "")) || 0;
  const numericOriginalPrice = Number(originalPrice.replace(/,/g, "")) || undefined;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!title.trim()) return;
      setStep(2);
    } else if (step === 2) {
      if (!price || numericPrice <= 0) return;
      setStep(3);
    } else if (step === 3) {
      handleFinalPublish();
    }
  };

  const handleFinalPublish = async () => {
    setIsPublishing(true);

    const sellerAvatar = profile?.profile_image && !profile.profile_image.includes("example.com") && profile.profile_image.trim() !== ""
      ? profile.profile_image
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";

    const coverPhoto = image || imagesList[0] || SAMPLE_PHOTOS[0];
    const finalImages = imagesList.length > 0 ? imagesList : [coverPhoto];
    const finalSchool = currentCampus || profile?.school || "Federal University Wukari";

    const newItem: PublishedItem & { school?: string } = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "Clean, verified item in great condition. Available for quick campus inspection.",
      category,
      conditionBadge: activeCondition.badgeText,
      conditionColor: activeCondition.badgeColor,
      price: numericPrice,
      originalPrice: numericOriginalPrice && numericOriginalPrice > numericPrice ? numericOriginalPrice : undefined,
      isNegotiable,
      location: finalLocation,
      postedTime: "Just now",
      image: coverPhoto,
      images: finalImages,
      school: finalSchool,
      seller: {
        name: profile?.name || "Verified Student",
        level: profile?.level || "300 Level",
        avatar: sellerAvatar,
        verified: true,
        whatsapp: profile?.whatsapp_number || profile?.phone_number || "2348134351762",
      }
    };

    try {
      await createMarketItemAction({
        seller_id: profile?.id,
        title: title.trim(),
        description: description.trim() || "Clean, verified item in great condition.",
        category,
        condition_badge: activeCondition.badgeText,
        condition_color: activeCondition.badgeColor,
        price: numericPrice,
        original_price: numericOriginalPrice,
        is_negotiable: isNegotiable,
        school: finalSchool,
        location: finalLocation,
        image: coverPhoto,
        images: finalImages,
        seller_name: profile?.name || "Verified Student",
        seller_level: profile?.level || "300 Level",
        seller_avatar: sellerAvatar,
        seller_whatsapp: profile?.whatsapp_number || profile?.phone_number || "2348134351762",
      });
    } catch (err) {
      console.warn("DB save warning caught:", err);
    }

    onPublish(newItem);
    setIsPublishing(false);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      
      {/* Modal Card (Full-width bottom sheet on mobile, centered card on desktop) */}
      <div className="relative w-full max-w-xl h-[88vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[28px] sm:rounded-[32px] bg-[#141122] border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden text-white mb-0 sm:mb-auto">
        
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-12 h-1 rounded-full bg-white/20" />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-brand-magenta/20 via-brand-violet/20 to-transparent blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 px-5 sm:px-6 pt-3 sm:pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-violet to-brand-magenta flex items-center justify-center shadow-glow-magenta/30">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-white">
                Sell an Item on Campus
              </h2>
              <p className="text-[11px] text-text-dim">
                Zero listing fees • Meet safely with student buyers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Progress Bar (Steps 1 to 3) */}
        {step < 4 && (
          <div className="relative z-10 px-5 sm:px-6 pt-3 pb-1 space-y-1.5 bg-white/[0.01]">
            <div className="flex items-center justify-between text-[11px] font-bold text-text-dim">
              <span className={step >= 1 ? "text-brand-violet-light" : ""}>1. Item & Photo</span>
              <span className={step >= 2 ? "text-brand-magenta-light" : ""}>2. Pricing & Condition</span>
              <span className={step >= 3 ? "text-emerald-400" : ""}>3. Location & Preview</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-violet via-brand-magenta to-emerald-400 transition-all duration-300 rounded-full"
                style={{
                  width: step === 1 ? "33%" : step === 2 ? "66%" : "100%"
                }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-6 no-scrollbar space-y-5">
          
          {/* ========================================================================= */}
          {/* STEP 1: ITEM BASIC INFO & PHOTO */}
          {/* ========================================================================= */}
          {step === 1 && (
            <form onSubmit={handleNext} id="sell-form-step-1" className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Item Title <span className="text-brand-magenta">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apple iPad 9th Gen 64GB with Stylus"
                  className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 px-4 text-xs font-semibold text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Category <span className="text-brand-magenta">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-gradient-to-r from-brand-violet/30 to-brand-magenta/30 text-white border-brand-magenta shadow-glow-magenta/20"
                            : "bg-white/[0.03] hover:bg-white/[0.06] text-text-secondary border-white/10"
                        }`}
                      >
                        <span className="text-sm">{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Selector - 4 Photo Upload Grid */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-text-dim block">
                      Product Photos <span className="text-brand-magenta">*</span>
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                      {imagesList.length} / 6 Photos (Min 1, Up to 6)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-brand-magenta-light font-bold flex items-center gap-1 hover:underline cursor-pointer bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload Multiple</span>
                  </button>
                </div>

                {/* Primary Preview Card */}
                <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-white/15 bg-[#100C22] group shadow-inner">
                  <img
                    src={image || imagesList[0] || SAMPLE_PHOTOS[0]}
                    alt="Selected Product"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-3.5">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <Camera className="h-3.5 w-3.5 text-brand-magenta-light" />
                        <span>Cover / Main Display Photo</span>
                      </span>
                      <p className="text-[10px] text-white/70">
                        This is the first photo buyers see in the feed
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-brand-violet hover:bg-brand-violet-light text-white shadow-lg transition-all"
                    >
                      + Add Photos
                    </button>
                  </div>
                </div>

                {/* 4-Slot Dedicated Photo Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-text-dim">
                    <span>Photo Gallery ({imagesList.length} attached)</span>
                    <span className="text-[10px] text-text-dim">Click a photo to preview or set as Cover</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                    {/* Render up to 4 dedicated slots (plus extra if uploaded) */}
                    {[0, 1, 2, 3].map((slotIdx) => {
                      const photo = imagesList[slotIdx];
                      const slotLabels = ["1. Front / Cover", "2. Back / Side", "3. Detail / Angle", "4. Accessories"];

                      if (photo) {
                        const isMain = image === photo || (slotIdx === 0 && !imagesList.includes(image));
                        return (
                          <div
                            key={slotIdx}
                            className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 group transition-all bg-[#141029] ${
                              isMain
                                ? "border-brand-magenta shadow-glow-magenta/30 ring-1 ring-brand-magenta"
                                : "border-white/20 hover:border-white/50"
                            }`}
                          >
                            <img
                              src={photo}
                              alt={`Slot ${slotIdx + 1}`}
                              className="h-full w-full object-cover cursor-pointer"
                              onClick={() => setImage(photo)}
                            />

                            {/* Slot Badge */}
                            <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 backdrop-blur-xs text-[8px] font-bold text-white uppercase tracking-wider">
                              {slotIdx === 0 ? "Cover" : `#${slotIdx + 1}`}
                            </div>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = imagesList.filter((_, i) => i !== slotIdx);
                                setImagesList(updated);
                                if (image === photo) {
                                  setImage(updated[0] || SAMPLE_PHOTOS[0]);
                                }
                              }}
                              className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow transition-all opacity-90 hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </button>

                            {/* Set Cover overlay on hover */}
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [photo, ...imagesList.filter((_, i) => i !== slotIdx)];
                                  setImagesList(updated);
                                  setImage(photo);
                                }}
                                className="absolute inset-x-0 bottom-0 py-0.5 bg-brand-violet/90 text-[8px] font-extrabold text-white text-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Set Cover
                              </button>
                            )}
                          </div>
                        );
                      }

                      // Empty Slot Card
                      return (
                        <button
                          key={slotIdx}
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-20 sm:h-24 rounded-xl border border-dashed border-white/20 hover:border-brand-magenta/60 bg-white/[0.02] hover:bg-white/[0.05] flex flex-col items-center justify-center p-1 text-center transition-all group"
                        >
                          <Camera className="h-4 w-4 text-text-dim group-hover:text-brand-magenta-light mb-1 transition-colors" />
                          <span className="text-[9px] font-semibold text-text-dim group-hover:text-white leading-tight">
                            {slotLabels[slotIdx]}
                          </span>
                          <span className="text-[8px] text-brand-magenta-light font-bold mt-0.5">
                            + Add
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Presets Row */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-text-dim">
                    <span className="uppercase font-bold tracking-wider">
                      Or Pick Fast Campus Presets:
                    </span>
                    <span className="text-[9px]">Tap to add to your photos</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {SAMPLE_PHOTOS.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!imagesList.includes(photoUrl)) {
                            setImagesList((prev) => [...prev, photoUrl].slice(0, 6));
                          }
                          setImage(photoUrl);
                        }}
                        className={`relative h-12 w-12 rounded-xl overflow-hidden border shrink-0 transition-all ${
                          imagesList.includes(photoUrl)
                            ? "border-brand-magenta scale-105 shadow-glow-magenta/40"
                            : "border-white/20 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={photoUrl} alt="Preset" className="h-full w-full object-cover" />
                        {imagesList.includes(photoUrl) && (
                          <div className="absolute inset-0 bg-brand-violet/40 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: PRICING & CONDITION */}
          {/* ========================================================================= */}
          {step === 2 && (
            <form onSubmit={handleNext} id="sell-form-step-2" className="space-y-4">
              
              {/* Price Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Selling Price (₦) <span className="text-brand-magenta">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-brand-magenta-light">
                      ₦
                    </span>
                    <input
                      type="number"
                      required
                      min={100}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="35000"
                      className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-8 pr-4 text-sm font-extrabold text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Original Retail Price (₦) <span className="text-text-dim text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-text-muted">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={100}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="45000"
                      className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-8 pr-4 text-sm font-medium text-white/80 placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Negotiable Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">Open to Price Offers?</div>
                  <div className="text-[10px] text-text-dim">Allows students to chat and negotiate politely</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNegotiable(!isNegotiable)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isNegotiable ? "bg-gradient-to-r from-brand-violet to-brand-magenta" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      isNegotiable ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Condition Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-dim block">
                  Item Condition <span className="text-brand-magenta">*</span>
                </label>
                <div className="space-y-2">
                  {CONDITIONS.map((cond) => {
                    const isSelected = conditionId === cond.id;
                    return (
                      <div
                        key={cond.id}
                        onClick={() => setConditionId(cond.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-brand-violet/20 border-brand-violet shadow-glow-violet/20"
                            : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{cond.label}</span>
                            <span className={`text-[8px] font-extrabold px-2 py-0.2 rounded border ${cond.badgeColor}`}>
                              {cond.badgeText}
                            </span>
                          </div>
                          <div className="text-[11px] text-text-secondary">{cond.desc}</div>
                        </div>

                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-brand-violet bg-brand-violet text-white" : "border-white/30"
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: LOCATION & LIVE PREVIEW */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-5">
              
              {/* Location Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-dim block">
                  Campus Pickup Point <span className="text-brand-magenta">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-magenta pointer-events-none" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 sm:h-12 rounded-2xl bg-[#1C153B] border border-white/15 pl-10 pr-8 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet cursor-pointer"
                  >
                    {CAMPUS_LOCATIONS.map((loc, idx) => (
                      <option key={idx} value={loc} className="bg-[#1C153B] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Or enter custom hostel/room (e.g. Queen Amina Hall Block A)..."
                  className="w-full h-10 rounded-xl bg-white/[0.03] border border-white/10 px-3.5 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-brand-violet"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Item Description / Details <span className="text-text-dim text-[10px]">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Clean device, battery health 92%, comes with original fast charger."
                  className="w-full rounded-2xl bg-white/[0.04] border border-white/15 p-3 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet resize-none"
                />
              </div>

              {/* Live Preview Card */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-violet-light uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-brand-magenta-light" />
                  <span>Live Card Preview in Feed</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#181332] border border-brand-violet/30 shadow-xl space-y-3 max-w-sm mx-auto">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#100C22]">
                    <img 
                      src={image || imagesList[0] || SAMPLE_PHOTOS[0]} 
                      alt="Preview" 
                      className="h-full w-full object-cover" 
                    />
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${activeCondition.badgeColor}`}>
                      {activeCondition.badgeText}
                    </div>
                    {imagesList.length > 1 && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                        <Camera className="h-3 w-3 text-brand-magenta-light" />
                        <span>{imagesList.length} photos</span>
                      </div>
                    )}
                  </div>

                  {imagesList.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                      {imagesList.map((pic, idx) => (
                        <div key={idx} className="h-10 w-10 rounded-lg overflow-hidden border border-white/20 shrink-0">
                          <img src={pic} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-heading font-extrabold text-white">
                        ₦{numericPrice.toLocaleString()}
                      </span>
                      {numericOriginalPrice && (
                        <span className="text-[10px] text-text-dim line-through">
                          ₦{numericOriginalPrice.toLocaleString()}
                        </span>
                      )}
                      {isNegotiable && (
                        <span className="text-[9px] font-bold text-text-dim uppercase">
                          Negotiable
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{title}</h4>
                    <p className="text-[10px] text-text-dim truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brand-magenta" />
                      <span>{finalLocation}</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: PUBLISH SUCCESS CELEBRATION */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-glow-magenta/30 animate-bounce">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Listing Published! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary max-w-xs mx-auto">
                  Your item <span className="text-white font-bold">"{title}"</span> is now live on the Campus Marketplace feed.
                </p>
              </div>

              <div className="pt-3 max-w-xs mx-auto">
                <button
                  onClick={onClose}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-brand-violet via-brand-magenta to-emerald-400 text-white text-xs sm:text-sm font-bold shadow-[0_4px_24px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                  View Listing in Market Feed 🚀
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {step < 4 && (
          <div className="relative z-10 px-5 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3 bg-white/[0.02]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-text-dim hover:text-white transition-all"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 1 && !title.trim()}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9D74FF] hover:to-[#F472B6] text-white text-xs font-bold shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalPublish}
                disabled={isPublishing}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-400 text-white text-xs font-bold shadow-[0_4px_20px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Listing 🚀</span>
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
