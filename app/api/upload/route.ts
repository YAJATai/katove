import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `screenshot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ url: "", demo: true, message: "Storage not configured — demo mode" });
    }

    const { error } = await supabase.storage
      .from("payment-screenshots")
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
