/**
 * Centralized listing storage, ownership detection, and permanent deletion utilities
 * for CampsNest Housing and Marketplace.
 */

const STORAGE_KEYS = {
  DELETED_LISTINGS: "campsnest_deleted_listing_ids",
  MY_LISTINGS: "campsnest_my_listing_ids",
  CUSTOM_LODGES: "campsnest_custom_lodges",
  LOCAL_HOUSING: "campsnest_local_housing_items",
  CUSTOM_MARKET: "campsnest_custom_market_items",
  LOCAL_MARKET: "campsnest_local_market_items",
} as const;

/**
 * Normalize phone number by extracting the last 10 digits.
 * E.g., "+234 803 123 4567", "08031234567", "2348031234567" all become "8031234567".
 */
export function normalizePhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length <= 10) return digits;
  return digits.slice(-10);
}

/**
 * Get all deleted listing IDs from localStorage
 */
export function getDeletedListingIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_LISTINGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Check if a listing ID has been marked as deleted
 */
export function isListingDeleted(id?: string | null): boolean {
  if (!id) return false;
  const deletedIds = getDeletedListingIds();
  return deletedIds.includes(String(id));
}

/**
 * Permanently record a listing as deleted in local storage and purge from all local caches.
 */
export function recordDeletedListingId(id: string): void {
  if (!id || typeof window === "undefined") return;

  try {
    const idStr = String(id);
    const deleted = new Set(getDeletedListingIds());
    deleted.add(idStr);
    localStorage.setItem(STORAGE_KEYS.DELETED_LISTINGS, JSON.stringify(Array.from(deleted)));

    // Purge from custom lodges
    try {
      const lodges = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_LODGES) || "[]");
      const filteredLodges = lodges.filter((item: any) => String(item.id) !== idStr);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LODGES, JSON.stringify(filteredLodges));
    } catch (e) {}

    // Purge from local housing items
    try {
      const hList = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_HOUSING) || "[]");
      const filteredH = hList.filter((item: any) => String(item.id) !== idStr);
      localStorage.setItem(STORAGE_KEYS.LOCAL_HOUSING, JSON.stringify(filteredH));
    } catch (e) {}

    // Purge from custom market items
    try {
      const mItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_MARKET) || "[]");
      const filteredM = mItems.filter((item: any) => String(item.id) !== idStr);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_MARKET, JSON.stringify(filteredM));
    } catch (e) {}

    // Purge from local market items
    try {
      const mLocal = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_MARKET) || "[]");
      const filteredMLocal = mLocal.filter((item: any) => String(item.id) !== idStr);
      localStorage.setItem(STORAGE_KEYS.LOCAL_MARKET, JSON.stringify(filteredMLocal));
    } catch (e) {}

    // Purge from my created listings
    try {
      const myListings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_LISTINGS) || "[]");
      const filteredMy = myListings.filter((itemId: string) => String(itemId) !== idStr);
      localStorage.setItem(STORAGE_KEYS.MY_LISTINGS, JSON.stringify(filteredMy));
    } catch (e) {}

    // Broadcast event for live cross-component sync
    window.dispatchEvent(
      new CustomEvent("campsnest:listing_deleted", { detail: { id: idStr } })
    );
  } catch (err) {
    console.warn("Could not record deleted listing ID:", err);
  }
}

/**
 * Get all listing IDs created by this device/user
 */
export function getMyCreatedListingIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MY_LISTINGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Record a listing ID as created by the current user on this device.
 */
export function recordMyCreatedListingId(id: string): void {
  if (!id || typeof window === "undefined") return;
  try {
    const idStr = String(id);
    const existing = new Set(getMyCreatedListingIds());
    existing.add(idStr);
    localStorage.setItem(STORAGE_KEYS.MY_LISTINGS, JSON.stringify(Array.from(existing)));
  } catch (err) {
    console.warn("Could not save created listing ID:", err);
  }
}

/**
 * Check if the current user owns a listing (Housing lodge or Market item).
 * Multi-layer check:
 * 1. Was it created on this device (`campsnest_my_listing_ids`)?
 * 2. Does owner_id or seller_id match user profile id?
 * 3. Does normalized phone or WhatsApp number match?
 * 4. Does seller/host display name match profile name?
 */
export function checkIsListingOwner(listing: any, profile: any): boolean {
  if (!listing) return false;

  const listingId = String(listing.id || "");

  // 1. Device-level creator ownership
  if (typeof window !== "undefined" && listingId) {
    const myIds = getMyCreatedListingIds();
    if (myIds.includes(listingId)) {
      return true;
    }
  }

  if (!profile) return false;

  const profileId = String(profile.id || "");

  // 2. Direct ID comparison
  if (profileId) {
    if (listing.owner_id && String(listing.owner_id) === profileId) return true;
    if (listing.owner?.id && String(listing.owner.id) === profileId) return true;
    if (listing.seller_id && String(listing.seller_id) === profileId) return true;
    if (listing.seller?.id && String(listing.seller.id) === profileId) return true;
  }

  // 3. Normalized Phone & WhatsApp comparison
  const userPhones = [
    normalizePhoneNumber(profile.phone_number),
    normalizePhoneNumber(profile.whatsapp_number),
  ].filter((p) => p.length >= 8);

  if (userPhones.length > 0) {
    const listingPhones = [
      normalizePhoneNumber(listing.owner_phone),
      normalizePhoneNumber(listing.whatsapp_link),
      normalizePhoneNumber(listing.host?.phone),
      normalizePhoneNumber(listing.host?.whatsapp),
      normalizePhoneNumber(listing.seller?.whatsapp),
      normalizePhoneNumber(listing.seller_whatsapp),
    ].filter((p) => p.length >= 8);

    for (const uPhone of userPhones) {
      if (listingPhones.includes(uPhone)) {
        return true;
      }
    }
  }

  // 4. Exact profile name match (if not generic placeholder)
  const profileName = (profile.name || "").trim().toLowerCase();
  const isGenericName =
    !profileName ||
    profileName === "verified student" ||
    profileName === "campus student" ||
    profileName === "new user" ||
    profileName === "student";

  if (!isGenericName) {
    const candidateNames = [
      listing.seller_name,
      listing.seller?.name,
      listing.host?.name,
      listing.host_name,
      listing.owner?.name,
    ]
      .filter(Boolean)
      .map((n: string) => n.trim().toLowerCase());

    if (candidateNames.includes(profileName)) {
      return true;
    }
  }

  return false;
}
