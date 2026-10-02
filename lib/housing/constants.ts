import { 
  Building2, 
  Droplets, 
  Zap, 
  Shield, 
  Sun, 
  Video, 
  Wifi,
  Sparkles
} from "lucide-react";

export interface HousingItem {
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
    avatar?: string;
  };
}

export const HOUSING_FILTER_PILLS = [
  { id: "all", label: "All Nests" },
  { id: "self-contain", label: "Self Contain" },
  { id: "single-room", label: "Single Room" },
  { id: "shared-flat", label: "Shared Flat" },
  { id: "under-150k", label: "Under ₦150k/yr" },
  { id: "walking-dist", label: "< 10 Mins Walk" },
  { id: "solar", label: "Solar / 24h Power" },
  { id: "water", label: "Borehole Water" }
];

export const HOUSING_LISTINGS: HousingItem[] = [];
