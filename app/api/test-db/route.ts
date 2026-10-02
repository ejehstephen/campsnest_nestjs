import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mmzchrpwefipnmodpwor.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__";

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const tables = ["notifications", "users", "room_listings", "marketplace_items", "questionnaire_answers", "questionnaire_questions"];
  const status: Record<string, any> = {};

  for (const t of tables) {
    const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
    status[t] = error ? { status: "error", message: error.message } : { status: "connected", rowCount: count };
  }

  return NextResponse.json({
    database: "Supabase PostgreSQL",
    url: supabaseUrl,
    timestamp: new Date().toISOString(),
    tables: status
  });
}
