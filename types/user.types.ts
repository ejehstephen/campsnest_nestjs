export type UserRole = "user" | "host" | "admin" | "super_admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_image?: string | null;
  school: string;
  faculty?: string | null;
  department?: string | null;
  level?: string | null;
  age: number;
  gender: string;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  bio?: string | null;
  preferences: string[];
  role: UserRole;
  is_banned: boolean;
  is_verified: boolean;
  is_super_admin: boolean;
  privacy_show_profile: boolean;
  privacy_show_marketplace: boolean;
  privacy_allow_matching: boolean;
  last_active_at?: string | null;
  created_at: string;
  updated_at: string;
}
