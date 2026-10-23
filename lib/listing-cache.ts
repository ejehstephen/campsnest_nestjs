import { MarketItem } from "@/lib/market/constants";
import { HousingItem } from "@/lib/housing/constants";

let memoryMarketItems: MarketItem[] | null = null;
let memoryHousingListings: HousingItem[] | null = null;

export function getCachedMarketItems(): MarketItem[] | null {
  if (memoryMarketItems && memoryMarketItems.length > 0) {
    return memoryMarketItems;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("campsnest_cached_market_items");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryMarketItems = parsed;
          return parsed;
        }
      }
    } catch (e) {
      // Ignore session storage errors
    }
  }
  return null;
}

export function setCachedMarketItems(items: MarketItem[]) {
  memoryMarketItems = items;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("campsnest_cached_market_items", JSON.stringify(items));
    } catch (e) {
      // Ignore quota exceeded errors
    }
  }
}

export function findCachedMarketItem(id: string): MarketItem | null {
  if (!id) return null;
  const items = getCachedMarketItems();
  if (!items) return null;
  return items.find((item) => String(item.id) === String(id)) || null;
}

export function getCachedHousingListings(): HousingItem[] | null {
  if (memoryHousingListings && memoryHousingListings.length > 0) {
    return memoryHousingListings;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("campsnest_cached_housing_listings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryHousingListings = parsed;
          return parsed;
        }
      }
    } catch (e) {
      // Ignore session storage errors
    }
  }
  return null;
}

export function setCachedHousingListings(items: HousingItem[]) {
  memoryHousingListings = items;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("campsnest_cached_housing_listings", JSON.stringify(items));
    } catch (e) {
      // Ignore quota exceeded errors
    }
  }
}

export function findCachedHousingListing(id: string): HousingItem | null {
  if (!id) return null;
  const listings = getCachedHousingListings();
  if (!listings) return null;
  return listings.find((h) => String(h.id) === String(id)) || null;
}
