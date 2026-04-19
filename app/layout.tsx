import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { buildMetadata } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetadata({
  title: "EGGS.BOT — Find the Cheapest Eggs Near You | Real-Time Price Tracker",
  description:
    "Find the cheapest eggs near you with real-time price comparison across Walmart, Kroger, Aldi, Costco & Target. Track egg price trends from BLS CPI data. Updated daily.",
  keywords: [
    "egg prices today",
    "cheapest eggs near me",
    "egg price comparison",
    "egg price tracker 2025",
    "grocery egg prices",
  ],
});

// Structured data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "EGGS.BOT",
  description: "Real-time egg price comparison and tracker",
  url: "https://eggsbot.com",
  applicationCategory: "ShoppingApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Egg price comparison by zip code",
    "Price trend charts",
    "National average egg price tracking",
    "Organic and cage-free egg filters",
  ],
  images: [
    {
      url: "https://images.pexels.com/photos/30805256/pexels-photo-30805256.jpeg",
      width: 1200,
      height: 630,
    },
  ],
  logo: "https://images.pexels.com/photos/30805256/pexels-photo-30805256.jpeg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
