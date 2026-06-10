"use client";

import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { ShoppingBag, ArrowLeft, CheckCircle, User, Mail, Phone, MapPin, Home, Building, Globe, Hash, Copy, Check, Upload, Banknote } from "lucide-react";
import { useState, FormEvent, useRef } from "react";
import Link from "next/link";

const BANK_DETAILS = {
  bank: "TBC Bank",
  account_name: "Katove LLC",
  account_number: "GE29TB0000000012345678",
  bank_code: "TBCBGE22",
  currency: "GEL",
  note: "Use your order reference as payment description.",
};

function formatAccountNumber(num: string) {
  const parts: string[] = [];
  for (let i = 0; i < num.length; i += 4) parts.push(num.slice(i, i + 4));
  return parts.join(" ");
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    postal_code: "",
    country: "Georgia",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const uploadScreenshot = async (): Promise<string | null> => {
    if (!screenshot) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", screenshot);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setScreenshotUrl(data.url);
        return data.url;
      }
      if (data.demo) return null;
      return null;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(BANK_DETAILS.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const url = await uploadScreenshot();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: `${form.line1}${form.line2 ? ", " + form.line2 : ""}, ${form.city}, ${form.postal_code}, ${form.country}`,
          address: {
            line1: form.line1,
            line2: form.line2 || null,
            city: form.city,
            postal_code: form.postal_code,
            country: form.country,
          },
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total: totalPrice,
          payment_method: "bank_transfer",
          payment_screenshot_url: url,
        }),
      });
      const data = await res.json();
      setOrderId(data.order?.id || "demo");
      clearCart();
      setDone(true);
    } catch {
      setDone(true);
      clearCart();
    }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-accent)] rounded-2xl p-12 animate-scale-in">
            <CheckCircle className="w-20 h-20 text-[var(--color-brand-400)] mx-auto mb-6 animate-success-pop" />
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Order Placed</h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Please transfer <span className="text-[var(--color-brand-400)] font-bold">₾{totalPrice.toFixed(2)}</span> to the account below and upload your payment screenshot to confirm.
            </p>

            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-xl p-5 mb-6 text-left space-y-2">
              <p className="text-xs text-[var(--color-text-tertiary)]">Reference: <span className="text-[var(--color-text-primary)] font-mono">{orderId.slice(0, 8)}...</span></p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Bank: <span className="text-[var(--color-text-primary)]">{BANK_DETAILS.bank}</span></p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Account Name: <span className="text-[var(--color-text-primary)]">{BANK_DETAILS.account_name}</span></p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Account Number: <span className="text-[var(--color-text-primary)] font-mono">{formatAccountNumber(BANK_DETAILS.account_number)}</span></p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Amount: <span className="text-[var(--color-brand-400)] font-bold">₾{totalPrice.toFixed(2)}</span></p>
            </div>

            <p className="text-[var(--color-text-tertiary)] text-xs mb-8">
              Our team will confirm your payment within 24 hours and ship your order.
            </p>

            <Link
              href="/collections"
              className="btn-primary inline-flex items-center gap-2 bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold px-8 py-3.5 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="py-20">
            <ShoppingBag className="w-16 h-16 text-[var(--color-text-tertiary)] mx-auto mb-4 opacity-50" />
            <p className="text-[var(--color-text-secondary)] text-lg">Your cart is empty</p>
            <Link
              href="/collections"
              className="btn-primary inline-flex items-center gap-2 bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold px-8 py-3.5 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98] mt-6"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10 stagger-children">
          <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">Checkout</span>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mt-2">Complete Your Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6 stagger-children">
            {/* Contact */}
            <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-6 card-hover">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--color-brand-400)]" /> Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <User className="w-3 h-3 inline mr-1" /> Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <Mail className="w-3 h-3 inline mr-1" /> Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-6 card-hover">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--color-brand-400)]" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <Phone className="w-3 h-3 inline mr-1" /> Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="+995 5XX XXX XXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <Home className="w-3 h-3 inline mr-1" /> Address Line 1 *
                  </label>
                  <input
                    type="text"
                    placeholder="Street address, building, apartment"
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <Building className="w-3 h-3 inline mr-1" /> Address Line 2
                  </label>
                  <input
                    type="text"
                    placeholder="Apt, suite, unit (optional)"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" /> City *
                  </label>
                  <input
                    type="text"
                    placeholder="Tbilisi"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <Hash className="w-3 h-3 inline mr-1" /> Postal Code *
                  </label>
                  <input
                    type="text"
                    placeholder="0101"
                    value={form.postal_code}
                    onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
                    <Globe className="w-3 h-3 inline mr-1" /> Country *
                  </label>
                  <input
                    type="text"
                    placeholder="Georgia"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment — Bank Transfer */}
            <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-6 card-hover">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[var(--color-brand-400)]" /> Bank Transfer Payment
              </h2>

              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-weak)] rounded-xl p-4 mb-5 space-y-2">
                <p className="text-xs text-[var(--color-text-tertiary)]">Bank</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{BANK_DETAILS.bank}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-3">Beneficiary</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{BANK_DETAILS.account_name}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-3">Account Number</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-bold text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] px-3 py-1.5 rounded-lg border border-[var(--color-border-weak)] flex-1 select-all">
                    {formatAccountNumber(BANK_DETAILS.account_number)}
                  </code>
                  <button
                    type="button"
                    onClick={copyAccount}
                    className="w-9 h-9 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border-weak)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all shrink-0 active:scale-[0.95]"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-3">Bank Code</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{BANK_DETAILS.bank_code}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-2">{BANK_DETAILS.note}</p>
              </div>

              <p className="text-sm text-[var(--color-text-primary)] font-medium mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[var(--color-brand-400)]" /> Upload Payment Screenshot
              </p>

              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[var(--color-border-strong)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-brand-400)] transition-colors"
              >
                {screenshotPreview ? (
                  <div className="space-y-2">
                    <img src={screenshotPreview} alt="Screenshot preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <p className="text-xs text-[var(--color-text-tertiary)]">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-[var(--color-text-tertiary)] mx-auto" />
                    <p className="text-sm text-[var(--color-text-tertiary)]">Tap to upload payment receipt</p>
                    <p className="text-xs text-[var(--color-text-tertiary)] opacity-60">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !screenshot}
              className="btn-primary w-full bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold py-4 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 text-lg"
            >
              {uploading ? "Uploading..." : submitting ? "Processing..." : `Place Order — ₾${totalPrice.toFixed(2)}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-6 card-hover sticky top-28">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--color-brand-400)]" /> Order Summary
              </h2>
              <div className="space-y-3 mb-5 max-h-[320px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-2.5 rounded-xl bg-[var(--color-surface-default)] border border-[var(--color-border-weak)]">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-overlay)] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{item.name}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[var(--color-brand-400)] shrink-0">
                      ₾{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--color-border-default)] pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                  <span>Subtotal</span>
                  <span>₾{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                  <span>Delivery</span>
                  <span className="text-[var(--color-success)]">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border-weak)]">
                  <span>Total</span>
                  <span className="text-[var(--color-brand-400)]">₾{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
