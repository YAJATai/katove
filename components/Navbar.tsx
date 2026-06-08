"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";

const navLinks = [
  { href: "/", label: "Store" },
  { href: "/categories", label: "Categories" },
  { href: "/collections", label: "Products" },
  { href: "/installments", label: "Finance" },
  { href: "/affiliate", label: "Partners" },
  { href: "/contact", label: "Support" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("auth=signin")) {
      setAuthOpen(true);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collections?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-navbar"
            : "bg-transparent backdrop-blur-none border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl md:text-2xl font-extrabold tracking-wider italic text-white hover:text-[var(--color-brand-400)] transition-colors duration-200 uppercase"
          >
            KATOVE
          </Link>

          <div className="hidden md:flex items-center gap-0.5 bg-[var(--color-surface-overlay)]/40 px-2 py-1.5 rounded-full border border-[var(--color-border-default)] backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors duration-150 flex items-center gap-1 px-4 py-1.5 rounded-full hover:bg-[var(--color-interactive-hover)] active:scale-[0.97]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pl-2 ml-2 border-l border-[var(--color-border-strong)]">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 text-[var(--color-text-tertiary)] hover:text-white hover:bg-[var(--color-interactive-hover)] active:scale-[0.95]"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => user ? window.location.href = "/account" : setAuthOpen(true)}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 text-[var(--color-text-tertiary)] hover:text-[var(--color-brand-400)] hover:bg-[var(--color-interactive-hover)] active:scale-[0.95]"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 text-white hover:text-[var(--color-brand-400)] hover:bg-[var(--color-interactive-hover)] active:scale-[0.95]"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#22c55e] text-black text-[10px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-lg shadow-[#22c55e]/30">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 text-white hover:text-[var(--color-brand-400)] hover:bg-[var(--color-interactive-hover)] active:scale-[0.95]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-[var(--color-border-default)]" style={{ background: "rgba(10, 10, 10, 0.55)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)" }}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl pl-11 pr-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-20 left-4 right-4 bg-[var(--color-surface-overlay)]/95 backdrop-blur-xl border border-[var(--color-border-strong)] rounded-2xl p-4 elevation-3 transition-all duration-300 ${
            mobileOpen ? "animate-fade-in-up" : ""
          }`}
        >
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-interactive-hover)] rounded-xl transition-all duration-150 active:scale-[0.98]"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--color-border-default)] pt-2 mt-2">
              <button
                onClick={() => { user ? window.location.href = "/account" : setAuthOpen(true); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-interactive-hover)] rounded-xl transition-all duration-150 active:scale-[0.98]"
              >
                My Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
