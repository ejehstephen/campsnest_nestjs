"use client";

import * as React from "react";
import { 
  X, 
  Building2, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  ShieldCheck, 
  Check, 
  Info, 
  Droplets, 
  Zap, 
  Shield, 
  Wifi, 
  Sun, 
  Video, 
  DollarSign, 
  Loader2,
  Sparkles,
  Play
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { compressHouseImage, isVideoUrl } from "@/lib/utils";
import { createHousingListingAction } from "@/lib/housing/actions";
import { HousingItem } from "@/lib/housing/constants";

export interface PublishedHouse {
  id: string;
  title: string;
  category: string;
  categoryBadge: string;
  statusBadge: string;
  statusBadgeColor: string;
  address: string;
  price: number;
  priceUnit: string;
  distance: string;
  photoCount: number;
  image: string;
  images?: string[];
  description?: string;
  school?: string;
  features: { label: string; icon: any }[];
  host: {
    initials: string;
    name: string;
    role: string;
    badge: string;
    badgeColor: string;
    phone?: string;
    whatsapp?: string;
  };
}

interface PostHouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (house: PublishedHouse) => void;
  currentCampus?: string;
}

const HOUSE_TYPES = [
  { id: "self-contain", label: "Self Contain", desc: "Private room, kitchenette, and ensuite bathroom" },
  { id: "single-room", label: "Single Room", desc: "Private bedroom, shared kitchen/facilities" },
  { id: "shared-flat", label: "Shared Flat / Roommate", desc: "Co-lease apartment with fellow student" },
  { id: "flat", label: "2/3-Bedroom Flat", desc: "Full apartment for group students" }
];

const AMENITIES_OPTIONS = [
  { id: "water", label: "24/7 Running Water / Borehole", icon: Droplets },
  { id: "solar", label: "Solar Inverter / 24h Power", icon: Sun },
  { id: "prepaid", label: "Dedicated Prepaid Meter", icon: Zap },
  { id: "security", label: "Gated Compound & Security Guard", icon: Shield },
  { id: "wifi", label: "High-Speed Campus Wi-Fi", icon: Wifi },
  { id: "cctv", label: "CCTV Surveillance Camera", icon: Video },
  { id: "fenced", label: "Perimeter Electric Fence", icon: Building2 }
];

const SAMPLE_HOUSE_PHOTOS = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&auto=format&fit=crop&q=80"
];

export function PostHouseModal({ isOpen, onClose, onPublish, currentCampus }: PostHouseModalProps) {
  const { profile } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Wizard Steps (1 = Basic Info & Photos, 2 = Pricing & Amenities, 3 = Location & Review, 4 = Success)
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [title, setTitle] = React.useState("");
  const [houseType, setHouseType] = React.useState("self-contain");
  const [price, setPrice] = React.useState("200000");
  const [inspectionFee, setInspectionFee] = React.useState("1000");
  const [description, setDescription] = React.useState("");
  const [address, setAddress] = React.useState("Greenfield Estate, Opp. Main Gate, Wukari");
  const [distance, setDistance] = React.useState("5 mins walk to Gate");
  const [genderPref, setGenderPref] = React.useState("any");
  
  // Photos State
  const [image, setImage] = React.useState(SAMPLE_HOUSE_PHOTOS[0]);
  const [imagesList, setImagesList] = React.useState<string[]>([SAMPLE_HOUSE_PHOTOS[0]]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(["water", "prepaid", "security"]);
  const [isPublishing, setIsPublishing] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsPublishing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        const processed = await Promise.all(
          files.map(async (file) => {
            if (file.type.startsWith("video/")) {
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target?.result as string);
                reader.onerror = (err) => reject(err);
                reader.readAsDataURL(file);
              });
            }
            return compressHouseImage(file);
          })
        );
        setImagesList((prev) => [...processed, ...prev].slice(0, 6));
        setImage(processed[0]);
      } catch (err) {
        console.error("Error processing house photos & videos:", err);
      }
    }
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!title.trim() || imagesList.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const handleFinish = async () => {
    setIsPublishing(true);

    const houseTypeObj = HOUSE_TYPES.find((t) => t.id === houseType);
    const categoryName = houseTypeObj ? houseTypeObj.label : "Self Contain";
    const finalSchool = currentCampus || profile?.school || "Federal University Wukari";

    const newHouse: PublishedHouse = {
      id: `house-post-${Date.now()}`,
      title: title.trim(),
      category: categoryName,
      categoryBadge: categoryName.toUpperCase(),
      statusBadge: "Verified Student Host",
      statusBadgeColor: "bg-brand-violet/20 text-brand-violet-light border-brand-violet/30",
      address: address.trim(),
      price: parseInt(price) || 200000,
      priceUnit: "/ year",
      distance: distance.trim(),
      photoCount: imagesList.length,
      image: image || imagesList[0] || SAMPLE_HOUSE_PHOTOS[0],
      images: imagesList.length > 0 ? imagesList : [SAMPLE_HOUSE_PHOTOS[0]],
      description: description.trim() || "Student accommodation within safe campus walking distance with reliable facilities.",
      features: selectedAmenities.map((aId) => {
        const option = AMENITIES_OPTIONS.find((opt) => opt.id === aId);
        return { label: option ? option.label.split("/")[0].trim() : aId, icon: Building2 };
      }),
      school: finalSchool,
      host: {
        initials: profile?.name ? profile.name.slice(0, 2).toUpperCase() : "SH",
        name: profile?.name || "Student Host",
        role: `Verified Host (${finalSchool})`,
        badge: "No Agent Fee",
        badgeColor: "bg-brand-magenta/20 text-brand-magenta-light border-brand-magenta/30",
        whatsapp: profile?.whatsapp_number || profile?.phone_number || "2348134351762",
        phone: profile?.phone_number || "08134351762"
      }
    };

    // 1. Try publishing to Supabase DB via Action
    try {
      await createHousingListingAction({
        owner_id: profile?.id,
        title: newHouse.title,
        description: newHouse.description || "Clean, fully tiled student accommodation.",
        price: newHouse.price,
        location: newHouse.address,
        distance_from_campus: newHouse.distance,
        house_type: houseType,
        images: newHouse.images,
        amenities: selectedAmenities,
        inspection_fee: parseInt(inspectionFee) || 0,
        school: finalSchool,
        gender_preference: genderPref,
        image: newHouse.image,
        host_name: newHouse.host.name,
        host_whatsapp: newHouse.host.whatsapp,
        host_phone: newHouse.host.phone
      });
    } catch (err) {
      console.warn("Could not save listing to Supabase (offline/mock fallback):", err);
    }

    // 2. Persist to LocalStorage for instant reactive display across all screens
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("campsnest_custom_lodges") || "[]");
        const updated = [newHouse, ...existing.filter((h: any) => h.id !== newHouse.id)];
        localStorage.setItem("campsnest_custom_lodges", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save lodge to localStorage:", e);
      }
    }

    onPublish(newHouse);
    setIsPublishing(false);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl h-[88vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[28px] sm:rounded-[32px] bg-[#141122] border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden text-white mb-0 sm:mb-auto">
        
        {/* Top Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-brand-violet/20 via-brand-magenta/20 to-transparent blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 px-5 sm:px-6 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-violet to-brand-magenta flex items-center justify-center shadow-glow-magenta/30">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-white">
                List a House / Roommate Space
              </h2>
              <p className="text-[11px] text-text-dim">
                Zero agent markup • Connect directly with verified student tenants
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

        {/* Progress Bar */}
        {step < 4 && (
          <div className="relative z-10 px-5 sm:px-6 pt-3 pb-1 space-y-1.5 bg-white/[0.01]">
            <div className="flex items-center justify-between text-[11px] font-bold text-text-dim">
              <span className={step >= 1 ? "text-brand-violet-light" : ""}>1. Property & Media</span>
              <span className={step >= 2 ? "text-brand-magenta-light" : ""}>2. Rent & Amenities</span>
              <span className={step >= 3 ? "text-emerald-400" : ""}>3. Location & Submit</span>
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
          
          {/* STEP 1: Basic Info & Multi-Photo/Video Upload */}
          {step === 1 && (
            <form onSubmit={handleNext} id="house-form-step-1" className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Lodge / Apartment Title <span className="text-brand-magenta">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Silver Crest Haven (Executive Block B)"
                  className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 px-4 text-xs font-semibold text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                />
              </div>

              {/* House Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Accommodation Type <span className="text-brand-magenta">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HOUSE_TYPES.map((type) => {
                    const isSelected = houseType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setHouseType(type.id)}
                        className={`p-3 rounded-2xl border text-left transition-all space-y-0.5 ${
                          isSelected
                            ? "bg-brand-violet/25 border-brand-violet text-white shadow-glow-violet/20 ring-1 ring-brand-violet"
                            : "bg-white/[0.03] hover:bg-white/[0.06] text-text-secondary border-white/10"
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{type.label}</div>
                        <div className="text-[10px] text-text-dim leading-tight">{type.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4-Photo/Video Multi-Media Uploader */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-text-dim block">
                      Photos & Video Tours <span className="text-brand-magenta">*</span>
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                      {imagesList.length} / 6 Media
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-brand-magenta-light font-bold flex items-center gap-1 hover:underline cursor-pointer bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload Photos / Videos</span>
                  </button>
                </div>

                {/* 4-Slot Dedicated Media Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const photo = imagesList[slotIdx];
                    const slotLabels = ["1. Room / Main", "2. Bathroom", "3. Kitchenette", "4. Compound"];

                    if (photo) {
                      const isMain = image === photo || (slotIdx === 0 && !imagesList.includes(image));
                      const isVid = isVideoUrl(photo);

                      return (
                        <div
                          key={slotIdx}
                          className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all bg-[#141029] ${
                            isMain
                              ? "border-brand-magenta shadow-glow-magenta/30 ring-1 ring-brand-magenta"
                              : "border-white/20 hover:border-white/50"
                          }`}
                        >
                          {isVid ? (
                            <div
                              className="h-full w-full relative bg-black flex items-center justify-center cursor-pointer"
                              onClick={() => setImage(photo)}
                            >
                              <video
                                src={photo}
                                className="h-full w-full object-cover opacity-70 pointer-events-none"
                                muted
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="h-6 w-6 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow">
                                  <Play className="h-3 w-3 fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={photo}
                              alt={`Slot ${slotIdx + 1}`}
                              className="h-full w-full object-cover cursor-pointer"
                              onClick={() => setImage(photo)}
                            />
                          )}
                          <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white uppercase">
                            {isVid ? "Video" : slotIdx === 0 ? "Cover" : `#${slotIdx + 1}`}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = imagesList.filter((_, i) => i !== slotIdx);
                              setImagesList(updated);
                              if (image === photo) setImage(updated[0] || SAMPLE_HOUSE_PHOTOS[0]);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slotIdx}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-20 sm:h-24 rounded-xl border border-dashed border-white/20 hover:border-brand-magenta/60 bg-white/[0.02] flex flex-col items-center justify-center p-1 text-center transition-all group"
                      >
                        <Camera className="h-4 w-4 text-text-dim group-hover:text-brand-magenta-light mb-1" />
                        <span className="text-[9px] font-semibold text-text-dim leading-tight">
                          {slotLabels[slotIdx]}
                        </span>
                        <span className="text-[8px] text-brand-magenta-light font-bold mt-0.5">
                          + Add
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Presets */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-text-dim uppercase font-bold tracking-wider block">
                    Or Pick Sample Photos:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {SAMPLE_HOUSE_PHOTOS.map((photoUrl, idx) => (
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

          {/* STEP 2: Rent & Amenities */}
          {step === 2 && (
            <form onSubmit={handleNext} id="house-form-step-2" className="space-y-4">
              
              {/* Rent Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Rent / Year (₦) <span className="text-brand-magenta">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-brand-magenta-light">₦</span>
                    <input
                      type="number"
                      required
                      min={10000}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="200000"
                      className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-8 pr-4 text-sm font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Inspection Fee (₦) <span className="text-[10px] text-text-dim">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-text-muted">₦</span>
                    <input
                      type="number"
                      value={inspectionFee}
                      onChange={(e) => setInspectionFee(e.target.value)}
                      placeholder="1000"
                      className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-8 pr-4 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-dim block">
                  Included Amenities & Utilities <span className="text-brand-magenta">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AMENITIES_OPTIONS.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity.id);
                    const Icon = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-brand-violet/25 border-brand-violet text-white shadow-glow-violet/20"
                            : "bg-white/[0.03] hover:bg-white/[0.06] text-text-secondary border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${isSelected ? "text-brand-magenta-light" : "text-text-dim"}`} />
                          <span className="text-xs font-semibold">{amenity.label}</span>
                        </div>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "bg-brand-violet border-brand-violet text-white" : "border-white/30"
                        }`}>
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </form>
          )}

          {/* STEP 3: Location, Description & Review */}
          {step === 3 && (
            <div className="space-y-4">
              
              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Address / Neighborhood <span className="text-brand-magenta">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-magenta pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Greenfield Estate, Opp. Old Library Annex"
                    className="w-full h-11 sm:h-12 rounded-2xl bg-[#1C153B] border border-white/15 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet"
                  />
                </div>
              </div>

              {/* Distance to Campus */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Distance to Campus Gate
                </label>
                <input
                  type="text"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 5 mins walk to Gate, 2 mins by shuttle"
                  className="w-full h-10 rounded-xl bg-white/[0.03] border border-white/10 px-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-violet"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Property Description / Special Rules
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Constant light and water. Clean, gated compound with CCTV surveillance."
                  className="w-full rounded-2xl bg-white/[0.04] border border-white/15 p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-violet resize-none"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl bg-[#181332] border border-brand-violet/30 shadow-xl space-y-2.5 max-w-sm mx-auto">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#100C22]">
                  <img src={image || imagesList[0]} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-brand-violet/80 border border-white/20">
                    Verified & Ready
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-bold text-white flex items-center gap-1">
                    <Camera className="h-3 w-3 text-brand-magenta-light" />
                    <span>{imagesList.length} photos</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-heading font-extrabold text-white">
                      ₦{Number(price.replace(/,/g, "") || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-text-dim">/ year</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{title}</h4>
                  <p className="text-[10px] text-text-dim truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-brand-magenta" />
                    <span>{address}</span>
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-glow-magenta/30 animate-bounce">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Lodge Published! 🏡
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary max-w-xs mx-auto">
                  Your property <span className="text-white font-bold">"{title}"</span> is now live for students to inspect and contact you.
                </p>
              </div>

              <div className="pt-3 max-w-xs mx-auto">
                <button
                  onClick={onClose}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-brand-violet via-brand-magenta to-emerald-400 text-white text-xs sm:text-sm font-bold shadow-[0_4px_24px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                  View Listing in Housing Feed 🚀
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
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
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
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
                    <span>Publish Property 🚀</span>
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
