export interface MarketItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  conditionBadge: string;
  conditionColor: string;
  price: number;
  originalPrice?: number;
  isNegotiable?: boolean;
  school?: string;
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

export const MARKET_CATEGORIES = [
  { id: "all", label: "All Deals" },
  { id: "electronics", label: "Electronics" },
  { id: "computers", label: "Laptops & Tech" },
  { id: "books", label: "Books & Notes" },
  { id: "essentials", label: "Hostel Essentials" },
  { id: "fashion", label: "Fashion" }
];

export const MARKET_PRODUCTS: MarketItem[] = [];
