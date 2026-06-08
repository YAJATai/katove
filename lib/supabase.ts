import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = !!(url && key && !url.includes("placeholder"));

if (typeof window !== "undefined" && !isConfigured) {
  console.warn("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
}

export const supabase = isConfigured
  ? createClient(url!, key!, { auth: { persistSession: true, detectSessionInUrl: true } })
  : (null as unknown as SupabaseClient);

export function getApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const route = path.startsWith("/") ? path : `/${path}`;
  return `${base}${route}`;
}

export async function fetchSettings() {
  try {
    const res = await fetch(getApiUrl("/api/settings"));
    return res.json();
  } catch {
    return { font_family: null, primary_color: "#e8e0d0" };
  }
}
