import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getClient();
    if (!supabase) {
      return NextResponse.json({ order: { id: "demo", status: "pending" } });
    }

    const body = await req.json();
    const { customer_name, customer_email, customer_phone, customer_address, address, items, total, user_id } = body;

    if (!customer_name || !customer_email || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let address_id: string | null = null;

    // Save address if provided
    if (address?.line1 && address?.city && address?.country) {
      const { data: addrData, error: addrError } = await supabase
        .from("addresses")
        .insert({
          user_id: user_id || null,
          full_name: customer_name,
          phone: customer_phone || null,
          line1: address.line1,
          line2: address.line2 || null,
          city: address.city,
          postal_code: address.postal_code || null,
          country: address.country,
          is_default: false,
        })
        .select()
        .single();

      if (!addrError && addrData) {
        address_id = addrData.id;
      }
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user_id || null,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        customer_address: customer_address || null,
        address_id,
        items,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
