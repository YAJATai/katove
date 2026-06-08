import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const supabase = getClient();

  if (!supabase) {
    return NextResponse.json({
      font_family: "Inter, sans-serif",
      primary_color: "#e8e0d0",
      site_name: "Katove",
    });
  }

  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  return NextResponse.json(
    data ?? {
      font_family: "Inter, sans-serif",
      primary_color: "#e8e0d0",
      site_name: "Katove",
    }
  );
}
