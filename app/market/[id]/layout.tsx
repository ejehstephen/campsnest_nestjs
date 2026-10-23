
import type { Metadata } from "next";
import { fetchMarketItemByIdAction } from "@/lib/market/actions";
import { MARKET_PRODUCTS } from "@/lib/market/constants";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params?.id;
  let item: any = null;

  try {
    const res = await fetchMarketItemByIdAction(id);
    if (res && res.item) {
      item = res.item;
    }
  } catch (e) {
    // Ignore and fallback
  }

  if (!item) {
    item = MARKET_PRODUCTS.find((p) => p.id === id);
  }

  if (!item) {
    return {
      title: "Campus Marketplace | CampsNest",
      description: "Buy & sell student essentials, textbooks, and gadgets on CampsNest.",
      openGraph: {
        images: ["https://campsnest.com/campsnest-logo.png"],
      },
      twitter: {
        images: ["https://campsnest.com/campsnest-logo.png"],
      },
    };
  }

  // Dedicated HTTP image route that always serves valid binary image data (handling base64 or storage URLs)
  const imageUrl = `https://campsnest.com/api/item-image/${id}`;

  const title = `${item.title} — ₦${Number(item.price || 0).toLocaleString()}`;
  const description = `${item.condition ? item.condition.replace(/_/g, " ") : "Fairly used"} ${item.category || "item"} on CampsNest Campus Marketplace. ${item.description ? item.description.slice(0, 150) : "Verified student deal."}`;

  return {
    title: `${item.title} | CampsNest Marketplace`,
    description,
    openGraph: {
      title,
      description,
      url: `https://campsnest.com/market/${id}`,
      siteName: "CampsNest Marketplace",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function MarketDetailLayout({ children }: Props) {
  return <>{children}</>;
}
