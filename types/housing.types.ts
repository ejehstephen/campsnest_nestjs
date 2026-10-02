export type HousingType = "self_contain" | "single_room" | "shared_apartment" | "flat" | "duplex";
export type HousingStatus = "available" | "inspection_scheduled" | "taken" | "inactive";
export type GenderPreference = "male" | "female" | "any";

export interface HousingListing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  house_type: HousingType;
  price: number;
  inspection_fee: number;
  location: string;
  distance_from_campus?: string | null;
  school: string;
  gender_preference: GenderPreference;
  available_from: string;
  status: HousingStatus;
  is_active: boolean;
  is_featured: boolean;
  report_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  images?: string[];
  amenities?: string[];
  rules?: string[];
  owner?: {
    name: string;
    phone_number?: string;
    is_verified: boolean;
    profile_image?: string;
  };
}
