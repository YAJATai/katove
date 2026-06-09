"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, ShoppingBag, Star, ShieldCheck, Truck, Clock, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function ProductModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const productSlug = searchParams.get("product");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productSlug) {
      setProduct(null);
      return;
    }

    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, categories!inner(name, slug)")
          .eq("slug", productSlug)
          .single();

        if (!error && data) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productSlug]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (productSlug) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [productSlug]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("product");
    const newQuery = params.toString();
    router.replace(`${pathname}${newQuery ? `?${newQuery}` : ""}`, { scroll: false });
  };

  const handleAdd = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!productSlug) return null;

  const isAdded = items.some((item) => item.id === product?.id) || added;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeModal}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-5xl bg-[var(--color-surface-default)] rounded-2xl md:rounded-3xl border border-[var(--color-border-default)] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white transition-all duration-200 hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-[var(--color-text-tertiary)]">
              <ShoppingBag className="w-10 h-10 animate-pulse" />
              <p className="text-sm tracking-widest uppercase">Loading Product...</p>
            </div>
          </div>
        ) : !product ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <p className="text-[var(--color-text-secondary)]">Product not found.</p>
          </div>
        ) : (
          <>
            {/* Left Column: Image */}
            <div className="w-full md:w-1/2 bg-[var(--color-surface-elevated)] relative overflow-hidden flex-shrink-0 min-h-[300px] md:min-h-0">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover md:object-contain p-0 md:p-8"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-[var(--color-text-tertiary)] opacity-50" />
                </div>
              )}
              {product.is_top_pick && (
                <div className="absolute top-6 left-6 backdrop-blur-md bg-[var(--color-brand-400)]/20 border border-[var(--color-brand-400)] text-[var(--color-brand-400)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Top Pick
                </div>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="w-full md:w-1/2 flex flex-col h-full max-h-full overflow-y-auto">
              <div className="p-6 md:p-10 flex flex-col flex-1">
                <div className="mb-6">
                  <p className="text-[var(--color-brand-400)] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                    {product.categories?.name || "Premium Collection"}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl text-[var(--color-brand-400)] font-bold">
                      ₾{product.price.toFixed(2)}
                    </span>
                    <div className="h-4 w-px bg-[var(--color-border-strong)]" />
                    <div className="flex items-center gap-1">
                      <div className="flex text-[var(--color-brand-400)]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-[var(--color-text-tertiary)] text-sm ml-1">(4.9/5)</span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-[var(--color-border-default)] mb-6">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                      activeTab === "description" ? "text-white" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                    }`}
                  >
                    Description
                    {activeTab === "description" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-400)]" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                      activeTab === "reviews" ? "text-white" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                    }`}
                  >
                    Reviews
                    {activeTab === "reviews" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-400)]" />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 mb-8">
                  {activeTab === "description" ? (
                    <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
                      <p>{product.description || "An exquisite piece crafted with the utmost attention to detail. Perfect for those who appreciate true luxury and uncompromising quality."}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-[var(--color-brand-400)] shrink-0" />
                          <div>
                            <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Authenticity Guaranteed</p>
                            <p className="text-xs opacity-70">100% verified by our expert authenticators.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Truck className="w-5 h-5 text-[var(--color-brand-400)] shrink-0" />
                          <div>
                            <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Secure Delivery</p>
                            <p className="text-xs opacity-70">Insured express shipping worldwide.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-[var(--color-surface-raised)] p-5 rounded-xl border border-[var(--color-border-default)]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-400)]/20 flex items-center justify-center text-[var(--color-brand-400)] font-bold text-xs">
                              MK
                            </div>
                            <div>
                              <p className="text-white text-sm font-bold">Michael K.</p>
                              <p className="text-[var(--color-text-tertiary)] text-xs">Verified Buyer</p>
                            </div>
                          </div>
                          <span className="text-[var(--color-text-tertiary)] text-xs">2 days ago</span>
                        </div>
                        <div className="flex text-[var(--color-brand-400)] mb-2">
                          {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                        </div>
                        <p className="text-[var(--color-text-secondary)] text-sm">
                          "Absolutely flawless. The condition was exactly as described, and the packaging felt extremely premium. Katove never disappoints."
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add to Cart Section */}
                <div className="mt-auto pt-6 border-t border-[var(--color-border-default)]">
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] mb-4">
                    <Clock className="w-4 h-4" />
                    <span>In high demand. Order soon to secure this piece.</span>
                  </div>
                  <button
                    onClick={handleAdd}
                    className={`btn-primary w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 border ${
                      isAdded
                        ? "bg-[var(--color-brand-400)] text-black border-[var(--color-brand-400)]"
                        : "bg-transparent text-white border-[var(--color-border-strong)] hover:border-[var(--color-brand-400)] hover:text-[var(--color-brand-400)]"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
