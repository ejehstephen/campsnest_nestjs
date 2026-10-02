"use server";

import { createClient } from "@/lib/supabase/server";
import { HOUSING_LISTINGS, HousingItem } from "@/lib/housing/constants";
import { CONNECT_QUESTIONS } from "@/lib/connect/constants";

export interface ProfileListingItem {
  id: string;
  type: "market" | "housing";
  title: string;
  subtitle: string;
  price: number;
  status: "Active" | "Pending" | "Sold Out" | "Archived";
  inquiries?: number | null;
  image: string;
  createdAt?: string;
  archived?: boolean;
}

export interface ProfileInspectionItem {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  location: string;
  preferredDate: string;
  preferredTimeSlot: string;
  inspectionFee: number;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  hostName?: string;
  studentNotes?: string;
  createdAt: string;
}

/**
 * Fetch all listings (Marketplace + Housing) belonging to the authenticated user
 */
export async function fetchUserAllListingsAction(userId?: string): Promise<ProfileListingItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const activeUserId = userId || user?.id;

    const results: ProfileListingItem[] = [];

    // 1. Fetch user's Marketplace items
    if (activeUserId) {
      const { data: marketItems, error: mErr } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("seller_id", activeUserId)
        .order("created_at", { ascending: false });

      if (marketItems && marketItems.length > 0) {
        marketItems.forEach((m) => {
          results.push({
            id: m.id,
            type: "market",
            title: m.title,
            subtitle: `${m.category || "Item"} • ${m.condition_badge || "Good Condition"}`,
            price: m.price || 0,
            status: m.status === "sold" ? "Sold Out" : "Active",
            inquiries: Math.floor(Math.random() * 8) + 2,
            image: m.image || (m.images && m.images[0]) || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
            createdAt: m.created_at,
            archived: m.status === "sold"
          });
        });
      }

      // 2. Fetch user's Housing listings
      const { data: houseItems, error: hErr } = await supabase
        .from("room_listings")
        .select("*, room_listing_images(images)")
        .eq("owner_id", activeUserId)
        .order("created_at", { ascending: false });

      if (houseItems && houseItems.length > 0) {
        houseItems.forEach((h) => {
          const img = (h.room_listing_images && h.room_listing_images[0]?.images) || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80";
          results.push({
            id: h.id,
            type: "housing",
            title: h.title,
            subtitle: `${h.location} • ${h.gender_preference || "Any"}`,
            price: h.price || 0,
            status: h.is_active ? "Active" : "Archived",
            inquiries: Math.floor(Math.random() * 12) + 4,
            image: img,
            createdAt: h.created_at,
            archived: !h.is_active
          });
        });
      }
    }

    // Return user results, or if user has no DB items yet, return an initial demo set so profile isn't blank
    return results;
  } catch (err) {
    console.warn("Error fetching user listings from DB:", err);
    return [];
  }
}

function sanitizeHousingItem(h: any): HousingItem {
  return {
    id: h.id,
    title: h.title,
    category: h.category || "self-contain",
    categoryBadge: h.categoryBadge || "Verified Lodge",
    statusBadge: h.statusBadge || "Verified & Ready",
    statusBadgeColor: h.statusBadgeColor || "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    address: h.address || h.location || "Wukari Campus Area",
    price: h.price || 0,
    priceUnit: h.priceUnit || "/ year",
    distance: h.distance || "5 mins to Gate",
    photoCount: h.photoCount || (h.images?.length || 1),
    image: h.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80",
    images: h.images || [h.image],
    description: h.description,
    features: [],
    host: {
      initials: (h.host?.name || "VH").slice(0, 2).toUpperCase(),
      name: h.host?.name || "Verified Host",
      role: h.host?.role || "Lodge Host",
      badge: h.host?.badge || "Verified Lodge",
      badgeColor: h.host?.badgeColor || "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      phone: h.host?.phone || "",
      whatsapp: h.host?.whatsapp || "",
      avatar: h.host?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    }
  };
}

/**
 * Fetch Saved Houses for the user
 */
export async function fetchUserSavedHousesAction(savedIds: string[] = []): Promise<HousingItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let allSavedIds = [...savedIds];

    // Check saved_houses table in Supabase
    if (user?.id) {
      const { data: dbSaved } = await supabase
        .from("saved_houses")
        .select("listing_id")
        .eq("user_id", user.id);

      if (dbSaved && dbSaved.length > 0) {
        dbSaved.forEach((s) => {
          if (!allSavedIds.includes(s.listing_id)) {
            allSavedIds.push(s.listing_id);
          }
        });
      }
    }

    if (allSavedIds.length === 0) {
      return [];
    }

    // Fetch matching listings from Supabase
    const { data: dbListings } = await supabase
      .from("room_listings")
      .select("*, room_listing_images(images), room_listing_amenities(amenities)")
      .in("id", allSavedIds);

    const mappedListings: HousingItem[] = (dbListings || []).map((h) => ({
      id: h.id,
      title: h.title,
      category: h.house_type || "self-contain",
      categoryBadge: h.gender_preference ? `${h.gender_preference.toUpperCase()} ONLY` : "Executive Self-Contain",
      statusBadge: h.is_active ? "Verified & Ready" : "Occupied",
      statusBadgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      address: h.location || "Wukari Campus Area",
      price: h.price,
      priceUnit: "/ year",
      distance: h.distance_from_campus || "5 mins to Gate",
      photoCount: h.room_listing_images?.length || 1,
      image: (h.room_listing_images && h.room_listing_images[0]?.images) || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80",
      images: h.room_listing_images?.map((i: any) => i.images) || [],
      description: h.description,
      features: [],
      host: {
        initials: (h.host_name || "VH").slice(0, 2).toUpperCase(),
        name: h.host_name || "Verified Host",
        role: "Lodge Host",
        badge: "Verified Lodge",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        phone: h.owner_phone || "",
        whatsapp: h.whatsapp_link || "",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
      }
    }));

    return mappedListings;
  } catch (err) {
    console.warn("Error fetching saved houses:", err);
    return [];
  }
}

/**
 * Fetch User Inspections
 */
export async function fetchUserInspectionsAction(userId?: string): Promise<ProfileInspectionItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const activeUserId = userId || user?.id;

    if (!activeUserId) {
      return [];
    }

    const { data: dbInspections, error } = await supabase
      .from("inspections")
      .select(`
        *,
        listing:room_listings (
          id,
          title,
          location,
          room_listing_images (
            images
          )
        )
      `)
      .eq("student_id", activeUserId)
      .order("created_at", { ascending: false });

    if (dbInspections && dbInspections.length > 0) {
      return dbInspections.map((i: any) => ({
        id: i.id,
        listingId: i.listing_id,
        listingTitle: i.listing?.title || "Campus Accommodation",
        listingImage: i.listing?.room_listing_images?.[0]?.images || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80",
        location: i.listing?.location || "FU Wukari Campus Area",
        preferredDate: i.preferred_date,
        preferredTimeSlot: i.preferred_time_slot,
        inspectionFee: i.inspection_fee || 1000,
        status: i.status || "pending",
        hostName: "Host Property Manager",
        studentNotes: i.student_notes,
        createdAt: i.created_at
      }));
    }

    return [];
  } catch (err) {
    console.warn("Error fetching inspections:", err);
    return [];
  }
}
