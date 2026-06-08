"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getApiUrl } from "@/lib/supabase";

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    const tracked = searchParams.get("ref_tracked") === "1";

    if (ref) {
      localStorage.setItem("referral_code", ref);

      const storageKey = `tracked_ref_${ref}`;
      const alreadyTracked = sessionStorage.getItem(storageKey) === "1";

      if (tracked || alreadyTracked) return;

      sessionStorage.setItem(storageKey, "1");

      fetch(getApiUrl("/api/affiliates/track-click"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      }).catch(() => {});
    }
  }, [searchParams]);

  return null;
}
