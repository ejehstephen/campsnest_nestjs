export const APP_CONFIG = {
  name: "CampsNest",
  version: "2.0.0",
  tagline: "Your Campus. Your Space. Your People.",
  subTagline: "Everything campus living, in one place.",
  supportWhatsApp: "2348134351762",
  supportPhoneFormatted: "+234 813 435 1762",
  supportEmail: "support@campsnest.com",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mmzchrpwefipnmodpwor.supabase.co",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__",
};

export const CAMPUS_LIST = [
  { id: "fuwukari", name: "Federal University Wukari", code: "FUW" },
  { id: "unilag", name: "University of Lagos", code: "UNILAG" },
  { id: "ui", name: "University of Ibadan", code: "UI" },
  { id: "oau", name: "Obafemi Awolowo University", code: "OAU" },
  { id: "uniben", name: "University of Benin", code: "UNIBEN" },
  { id: "futa", name: "Federal University of Technology Akure", code: "FUTA" },
  { id: "unn", name: "University of Nigeria Nsukka", code: "UNN" },
  { id: "absu", name: "Abia State University", code: "ABSU" },
  { id: "uniport", name: "University of Port Harcourt", code: "UNIPORT" },
  { id: "unilorin", name: "University of Ilorin", code: "UNILORIN" },
  { id: "abu", name: "Ahmadu Bello University Zaria", code: "ABU" },
  { id: "lasu", name: "Lagos State University", code: "LASU" },
  { id: "delsu", name: "Delta State University Abraka", code: "DELSU" },
  { id: "buk", name: "Bayero University Kano", code: "BUK" },
  { id: "uniabuja", name: "University of Abuja", code: "UNIABUJA" },
  { id: "covenant", name: "Covenant University", code: "CU" },
  { id: "babcock", name: "Babcock University", code: "BABCOCK" },
];

export const NAVIGATION_ITEMS = [
  { label: "Home", href: "/", icon: "Home", badge: null },
  { label: "Housing", href: "/housing", icon: "Building2", badge: "24 new" },
  { label: "Market", href: "/market", icon: "ShoppingBag", badge: "Hot" },
  { label: "Connect", href: "/connect", icon: "Heart", badge: "94% Match" },
  { label: "Profile", href: "/profile", icon: "User", badge: null },
];

export const HOUSING_FILTERS = [
  "All",
  "Self Contain",
  "Single Room",
  "Shared Apartment",
  "Walking Distance",
  "Under ₦150k",
  "Verified Host",
];

export const MARKETPLACE_CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "Smartphone" },
  { id: "computers", name: "Computers & Laptops", icon: "Laptop" },
  { id: "books", name: "Books & Study Material", icon: "BookOpen" },
  { id: "hostel_essentials", name: "Hostel Essentials", icon: "Bed" },
  { id: "fashion", name: "Fashion & Wears", icon: "Shirt" },
  { id: "gaming", name: "Gaming & Fun", icon: "Gamepad2" },
  { id: "others", name: "Other Items", icon: "Package" },
];
