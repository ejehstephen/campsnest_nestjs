import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MARKET_PRODUCTS } from "@/lib/market/constants";

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
        .from("marketplace_items")
        .select("image")
        .eq("id", id)
        .maybeSingle();

      if (!error && data?.image) {
        imageRaw = data.image;
      }
    }

    // Fallback to local static constants if not in DB
    if (!imageRaw) {
      const localItem = MARKET_PRODUCTS.find((p) => p.id === id);
      if (localItem) {
        imageRaw = (Array.isArray(localItem.images) && localItem.images[0]) || localItem.image || null;
      }
    }

    if (!imageRaw) {
      return NextResponse.redirect(new URL("/campsnest-logo.png", request.url));
    }

    // Check if it's a base64 data URI (e.g. data:image/jpeg;base64,....)
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
    console.error("Error serving item image preview:", err);
    return NextResponse.redirect(new URL("/campsnest-logo.png", request.url));
  }
}
