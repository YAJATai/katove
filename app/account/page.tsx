"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Shield, LogOut, Package, MapPin, Plus } from "lucide-react";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const mod = await import("@/lib/supabase");
        if (!mod.supabase) return;
        const { data } = await mod.supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });
        if (data) setAddresses(data);
      } catch {}
    })();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="mb-10 stagger-children">
          <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">Account</span>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mt-2">Your Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {/* Profile card */}
          <div className="md:col-span-2 bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-6 card-hover">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--color-brand-400)]" /> Personal Info
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-surface-default)] border border-[var(--color-border-weak)]">
                <div className="w-12 h-12 rounded-full bg-[var(--color-brand-400)]/10 flex items-center justify-center text-[var(--color-brand-400)] font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[var(--color-text-primary)] font-medium">{user.name}</p>
                  <p className="text-[var(--color-text-tertiary)] text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {user.email}
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-surface-default)] border border-[var(--color-border-weak)]">
                <p className="text-[var(--color-text-tertiary)] text-xs font-medium mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Role
                </p>
                <p className="text-[var(--color-text-primary)] font-medium capitalize">{user.role || "Customer"}</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <Link
              href="/collections"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] card-hover transition-all duration-200 group"
            >
              <Package className="w-5 h-5 text-[var(--color-brand-400)] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Browse Products</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-4 rounded-xl bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] card-hover transition-all duration-200 group text-left"
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-red-400">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Addresses */}
        <div className="mt-10 stagger-children">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--color-brand-400)]" /> Saved Addresses
            </h2>
            <Link
              href="/checkout"
              className="text-xs font-bold text-[var(--color-brand-400)] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add New
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 text-center card-hover">
              <MapPin className="w-10 h-10 text-[var(--color-text-tertiary)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--color-text-secondary)] text-sm">No saved addresses yet.</p>
              <Link
                href="/checkout"
                className="text-[var(--color-brand-400)] text-sm font-medium hover:underline mt-2 inline-block"
              >
                Add one during checkout
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-5 card-hover relative"
                >
                  {addr.is_default && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase text-[var(--color-brand-400)] bg-[var(--color-brand-400)]/10 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                  <p className="text-[var(--color-text-primary)] font-medium mb-1">{addr.full_name}</p>
                  <p className="text-[var(--color-text-tertiary)] text-sm">{addr.line1}</p>
                  {addr.line2 && <p className="text-[var(--color-text-tertiary)] text-sm">{addr.line2}</p>}
                  <p className="text-[var(--color-text-tertiary)] text-sm">
                    {addr.city}, {addr.postal_code}
                  </p>
                  <p className="text-[var(--color-text-tertiary)] text-sm">{addr.country}</p>
                  <p className="text-[var(--color-text-tertiary)] text-xs mt-1">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders placeholder */}
        <div className="mt-10 stagger-children mb-10">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--color-brand-400)]" /> Orders
          </h2>
          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 text-center card-hover">
            <Package className="w-10 h-10 text-[var(--color-text-tertiary)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--color-text-secondary)] text-sm">No orders yet.</p>
            <Link
              href="/collections"
              className="text-[var(--color-brand-400)] text-sm font-medium hover:underline mt-2 inline-block"
            >
              Start shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
