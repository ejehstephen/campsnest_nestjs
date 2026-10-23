import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { HOUSING_LISTINGS } from "@/lib/housing/constants";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params?.id;
  if (!id) {
    return NextResponse.redirect(new URL("/campsnest-logo.png", request.url));
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let imageRaw: string | null = null;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("room_listings")
        .select("*, room_listing_images(images)")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const dbImages = (data.room_listing_images || [])
          .map((r: any) => r.images || r.image)
          .filter(Boolean);
        if (dbImages.length > 0) {
          imageRaw = dbImages[0];
        } else if (data.image) {
          imageRaw = data.image;
        }
      }
    }

    // Fallback to local static constants if not in DB
    if (!imageRaw) {
      const localHouse = HOUSING_LISTINGS.find((h) => h.id === id);
      if (localHouse) {
        imageRaw = (Array.isArray(localHouse.images) && localHouse.images[0]) || localHouse.image || null;
      }
    }

    if (!imageRaw) {
      return NextResponse.redirect(new URL("/campsnest-logo.png", request.url));
    }

    // Check if it's a base64 data URI
    if (imageRaw.startsWith("data:image/")) {
      const match = imageRaw.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");

        return new Response(buffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
          },
        });
      }
    }

    // If it's already an HTTP / HTTPS URL, redirect directly to it
    if (imageRaw.startsWith("http://") || imageRaw.startsWith("https://")) {
      return NextResponse.redirect(imageRaw, 302);
    }

    // Fallback to logo
    return NextResponse.redirect(new URL("/campsnest-logo.png", request.url));
  } catch (err) {
    console.error("Error serving housing image preview:", err);
    return NextResponse.redirect(new URL("/campsnest-logo.png", request.url));
  }
}
