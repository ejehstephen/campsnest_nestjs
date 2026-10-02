"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateMarketItemParams {
  seller_id?: string;
  title: string;
  description: string;
  category: string;
  condition_badge?: string;
  condition_color?: string;
  price: number;
  original_price?: number;
  is_negotiable?: boolean;
  school?: string;
  location: string;
  image: string;
  images?: string[];
  seller_name?: string;
  seller_level?: string;
  seller_avatar?: string;
  seller_whatsapp?: string;
}

/**
 * Create a new Marketplace item in Supabase
 */
export async function createMarketItemAction(params: CreateMarketItemParams) {
  try {
    const supabase = createClient();

    const imagesList = params.images && params.images.length > 0 ? params.images : [params.image];

    // Attempt 1: full payload with school
    const fullPayload = {
      seller_id: params.seller_id || null,
      title: params.title,
      description: params.description,
      category: params.category,
      condition_badge: params.condition_badge || "MINT CONDITION",
      condition_color: params.condition_color || "bg-[#1E293B]/80 text-emerald-300 border-emerald-500/30",
      price: params.price,
      original_price: params.original_price || null,
      is_negotiable: params.is_negotiable ?? true,
      school: params.school || "Federal University Wukari",
      location: params.location,
      image: params.image,
      images: imagesList,
      seller_name: params.seller_name || "Verified Student",
      seller_level: params.seller_level || "300 Level",
      seller_avatar: params.seller_avatar || "",
      seller_whatsapp: params.seller_whatsapp || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("marketplace_items")
      .insert(fullPayload)
      .select()
      .single();

    if (error) {
      console.warn("Marketplace DB insert warning, trying safe insert:", error.message);

      // Fallback: strip optional array/extra columns if schema differs
      const safePayload = {
        title: params.title,
        description: params.description,
        category: params.category,
        price: params.price,
        school: params.school || "Federal University Wukari",
        location: params.location,
        image: params.image,
        seller_name: params.seller_name || "Verified Student",
        created_at: new Date().toISOString(),
      };

      const { data: safeData, error: safeError } = await supabase
        .from("marketplace_items")
        .insert(safePayload)
        .select()
        .single();

      if (safeError) {
        console.error("Marketplace safe DB insert error:", safeError.message);
        return { success: false, error: safeError.message };
      }

      revalidatePath("/market");
      return { success: true, item: safeData };
    }

    revalidatePath("/market");
    return { success: true, item: data };
  } catch (err: any) {
    console.warn("createMarketItemAction exception:", err?.message);
    return { success: false, error: err?.message || "Failed to create marketplace item." };
  }
}

/**
 * Fetch active Marketplace items from Supabase (Optionally filtered by campus/school)
 */
export async function fetchMarketItemsAction(school?: string) {
  try {
    const supabase = createClient();
    let query = supabase
      .from("marketplace_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (school && school !== "all" && school.trim() !== "") {
      query = query.ilike("school", `%${school.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Marketplace DB fetch error:", error.message);
      // Fallback without school filter
      const { data: fallbackData } = await supabase
        .from("marketplace_items")
        .select("*")
        .order("created_at", { ascending: false });
      return { success: true, items: fallbackData || [] };
    }

    return { success: true, items: data || [] };
  } catch (err: any) {
    return { success: false, items: [] };
  }
}

/**
 * Fetch single Marketplace item by ID
 */
export async function fetchMarketItemByIdAction(id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("marketplace_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return { success: false, item: null };
    }

    return { success: true, item: data };
  } catch (err: any) {
    return { success: false, item: null };
  }
}
