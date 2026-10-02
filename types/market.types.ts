export type MarketCategory =
  | "electronics"
  | "computers"
  | "books"
  | "hostel_essentials"
  | "fashion"
  | "gaming"
  | "kitchen_appliances"
  | "others";

export type ItemCondition = "new" | "like_new" | "fairly_used" | "used";
export type MarketItemStatus = "available" | "pending" | "sold" | "archived";

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: MarketCategory;
  condition: ItemCondition;
  price: number;
  school: string;
  campus_location?: string | null;
  images: string[];
  status: MarketItemStatus;
  is_featured: boolean;
  report_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  seller?: {
    name: string;
    department?: string;
    school?: string;
    profile_image?: string;
    is_verified: boolean;
  };
}
