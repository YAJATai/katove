"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Completing sign in...");

  useEffect(() => {
    const complete = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/");
        } else {
          setMsg("Sign in failed. Redirecting...");
          setTimeout(() => router.push("/?auth=signin"), 2000);
        }
      } catch {
        setMsg("Something went wrong. Redirecting...");
        setTimeout(() => router.push("/?auth=signin"), 2000);
      }
    };
    complete();
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[var(--color-brand-400)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--color-text-secondary)] text-sm">{msg}</p>
      </div>
    </div>
  );
}
