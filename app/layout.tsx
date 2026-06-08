import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeInitializer from "@/components/ThemeInitializer";
import ReferralTracker from "@/components/ReferralTracker";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Katove — Private Luxury Marketplace",
  description: "Georgia's black market for the world's finest luxury goods. Cartier, Rolex, Audemars Piguet, Dior, Goyard, Louis Vuitton.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Katove — Private Luxury Marketplace",
    description: "Georgia's black market for the world's finest luxury goods.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <AuthProvider>
          <CartProvider>
            <ThemeInitializer />
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
            <main className="min-h-screen bg-[var(--color-surface-default)] text-[var(--color-text-primary)] overflow-x-hidden">
              <Navbar />
              {children}
            </main>
            <Footer />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
