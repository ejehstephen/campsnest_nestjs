import type { Metadata } from "next";
import { fetchHousingListingByIdAction } from "@/lib/housing/actions";
import { HOUSING_LISTINGS } from "@/lib/housing/constants";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params?.id;
  let listing: any = null;

  try {
    const res = await fetchHousingListingByIdAction(id);
    if (res && res.item) {
      listing = res.item;
    }
  } catch (e) {
    // Ignore and fallback
  }

  if (!listing) {
    listing = HOUSING_LISTINGS.find((h) => h.id === id);
  }

  if (!listing) {
    return {
      title: "Student Accommodation | CampsNest Housing",
      description: "Discover verified student accommodation and lodges on CampsNest.",
      openGraph: {
        images: ["https://campsnest.com/campsnest-logo.png"],
      },
      twitter: {
        images: ["https://campsnest.com/campsnest-logo.png"],
      },
    };
  }

  // Extract the authentic image of this specific accommodation listing
  const dbImages = (listing.room_listing_images || []).map((r: any) => r.images || r.image).filter(Boolean);
  let imageUrl = "https://campsnest.com/campsnest-logo.png";
  if (Array.isArray(listing.images) && listing.images.length > 0) {
    imageUrl = typeof listing.images[0] === "string" ? listing.images[0] : (listing.images[0]?.url || imageUrl);
  } else if (dbImages.length > 0) {
    imageUrl = dbImages[0];
  } else if (listing.image) {
    imageUrl = listing.image;
  }

  const title = `${listing.title} — ₦${Number(listing.price || 0).toLocaleString()}/yr`;
  const description = `${listing.house_type ? listing.house_type.replace(/_/g, " ") : "Accommodation"} in ${listing.location || "Campus"}. ${listing.description ? listing.description.slice(0, 150) : "Verified student lodge listing on CampsNest."}`;

  return {
    title: `${listing.title} | CampsNest Housing`,
    description,
    openGraph: {
      title,
      description,
      url: `https://campsnest.com/housing/${id}`,
      siteName: "CampsNest",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
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

export default function HousingDetailLayout({ children }: Props) {
  return <>{children}</>;
}
