"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
});

async function getSb(): Promise<SupabaseClient | null> {
  try {
    const mod = await import("./supabase");
    return mod.supabase || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    let cancelled = false;

    async function init() {
      const sb = await getSb();
      if (!sb || cancelled) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await sb.auth.getSession();
        if (session) {
          const { data: profile } = await sb
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setUser({
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              "User",
            email: session.user.email || "",
            role: profile?.role,
          });
        }
      } catch {
        // supabase not available
      }
      if (!cancelled) setLoading(false);

      try {
        const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setUser({
              id: session.user.id,
              name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                "User",
              email: session.user.email || "",
            });
          } else {
            setUser(null);
          }
        });
        unsub = () => subscription.unsubscribe();
      } catch {
        // supabase not available
      }
    }

    init();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: async (email, password) => {
          const sb = await getSb();
          if (!sb) return { error: "Supabase not configured" };
          const { error } = await sb.auth.signInWithPassword({ email, password });
          return error ? { error: error.message } : {};
        },
        signUp: async (email, password, name) => {
          const sb = await getSb();
          if (!sb) return { error: "Supabase not configured" };
          const { data, error } = await sb.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          });
          if (error) return { error: error.message };
          if (data.user) {
            const { error: profileError } = await sb.from("profiles").insert({
              id: data.user.id,
              name,
              email,
              role: "customer",
            });
            if (profileError) return { error: profileError.message };
          }
          return {};
        },
        signOut: async () => {
          const sb = await getSb();
          try { await sb?.auth.signOut(); } catch {}
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
