// lib/use-eggs-data.ts
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrendPoint {
  m: string;
  price: number;
}

export interface NationalStats {
  avg: string;
  weekly: string;
  yoy: string;
  cheapestState: string;
  cheapestPrice: string;
  costliestState: string;
  costliestPrice: string;
  trends: TrendPoint[];
}

export interface StoreEntry {
  name: string;
  price: number;
  change: number;
  note?: string;
}

export interface NearbyStore {
  store: string;
  addr: string;
  miles: number;
  price: number;
  type: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useNational() {
  const { data, error, isLoading } = useSWR<NationalStats>(
    "/api/bls",
    fetcher,
    {
      refreshInterval: 0, // daily via revalidate on server
      revalidateOnFocus: false,
    }
  );

  return {
    national: data ?? FALLBACK_NATIONAL,
    trends: data?.trends ?? FALLBACK_TRENDS,
    loading: isLoading,
    error,
  };
}

export function useStores() {
  const { data, error, isLoading } = useSWR<{ stores: StoreEntry[] }>(
    "/api/stores",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    stores: data?.stores ?? FALLBACK_STORES,
    loading: isLoading,
    error,
  };
}

export function useNearby(zip: string) {
  const { data, error, isLoading } = useSWR<{ nearby: NearbyStore[] }>(
    zip.length === 5 ? `/api/kroger?zip=${zip}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    nearby: data?.nearby ?? FALLBACK_NEARBY,
    loading: isLoading,
    error,
  };
}

// ─── Static egg type data (no external API) ───────────────────────────────────

export const EGG_TYPES = [
  {
    id: "conventional",
    name: "Conventional",
    avg: 2.47,
    blurb: "Cheapest bird. No frills, no claims.",
  },
  {
    id: "cage-free",
    name: "Cage-Free",
    avg: 3.29,
    blurb: "No cages — but still indoors.",
  },
  {
    id: "free-range",
    name: "Free-Range",
    avg: 3.89,
    blurb: "Outdoor access. Often minimal.",
  },
  {
    id: "organic",
    name: "Organic",
    avg: 4.69,
    blurb: "Non-GMO feed, no antibiotics.",
  },
  {
    id: "pasture-raised",
    name: "Pasture-Raised",
    avg: 6.29,
    blurb: "108 sq ft per bird. The gold standard.",
  },
];

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FALLBACK_NATIONAL: NationalStats = {
  avg: "3.47",
  weekly: "-1.2",
  yoy: "+28.4",
  cheapestState: "Mississippi",
  cheapestPrice: "2.18",
  costliestState: "Hawaii",
  costliestPrice: "6.89",
  trends: [],
};

export const FALLBACK_TRENDS: TrendPoint[] = [
  { m: "Jun", price: 2.41 },
  { m: "Jul", price: 2.67 },
  { m: "Aug", price: 2.83 },
  { m: "Sep", price: 2.95 },
  { m: "Oct", price: 3.14 },
  { m: "Nov", price: 3.37 },
  { m: "Dec", price: 3.82 },
  { m: "Jan", price: 4.15 },
  { m: "Feb", price: 4.52 },
  { m: "Mar", price: 4.28 },
  { m: "Apr", price: 3.79 },
  { m: "May", price: 3.47 },
];

const FALLBACK_STORES: StoreEntry[] = [
  { name: "Aldi", price: 2.18, change: -0.21, note: "Large White, dz" },
  { name: "Walmart", price: 2.46, change: -0.12 },
  { name: "Kroger", price: 2.79, change: -0.08 },
  { name: "Target", price: 2.89, change: 0.05, note: "Good & Gather Lg, dz" },
  { name: "Costco", price: 5.49, change: 0.31, note: "Kirkland 24-ct" },
];

export const FALLBACK_NEARBY: NearbyStore[] = [
  {
    store: "Aldi",
    addr: "1234 Memorial Dr, Houston",
    miles: 1.2,
    price: 2.18,
    type: "Large White, dz",
  },
  {
    store: "Walmart",
    addr: "5678 Katy Fwy, Houston",
    miles: 2.4,
    price: 2.46,
    type: "Great Value Lg, dz",
  },
  {
    store: "H-E-B",
    addr: "2345 S Voss Rd, Houston",
    miles: 2.9,
    price: 2.62,
    type: "Large Grade A, dz",
  },
  {
    store: "Kroger",
    addr: "9101 Westheimer Rd, Houston",
    miles: 3.1,
    price: 2.74,
    type: "Kroger Lg, dz",
  },
  {
    store: "Target",
    addr: "3456 Westheimer Rd, Houston",
    miles: 3.6,
    price: 2.89,
    type: "Good & Gather Lg, dz",
  },
  {
    store: "Whole Foods",
    addr: "4567 Westheimer Rd, Houston",
    miles: 5.2,
    price: 4.99,
    type: "Organic Cage-Free, dz",
  },
  {
    store: "Costco",
    addr: "5678 Katy Fwy, Houston",
    miles: 6.4,
    price: 5.49,
    type: "Kirkland 24-ct",
  },
];
