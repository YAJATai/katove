"use client";

import { useEffect } from "react";
import { fetchSettings } from "@/lib/supabase";

export default function ThemeInitializer() {
  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data.font_family) {
          document.body.style.fontFamily = data.font_family;
        }
        if (data.primary_color) {
          document.documentElement.style.setProperty("--color-brand-400", data.primary_color);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
