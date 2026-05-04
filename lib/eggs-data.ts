export const STORES = [
  { name: "Aldi", price: 2.18, change: -0.12, color: "var(--chart-1)" },
  { name: "Walmart", price: 2.46, change: -0.04, color: "var(--chart-2)" },
  { name: "Kroger", price: 2.74, change: +0.08, color: "var(--chart-3)" },
  { name: "Target", price: 2.89, change: +0.02, color: "var(--chart-4)" },
  {
    name: "Costco",
    price: 5.49,
    change: -0.2,
    color: "var(--chart-5)",
    note: "24-pack",
  },
];

export const TRENDS = [
  { m: "Jun", price: 2.05 },
  { m: "Jul", price: 2.21 },
  { m: "Aug", price: 2.34 },
  { m: "Sep", price: 2.51 },
  { m: "Oct", price: 2.69 },
  { m: "Nov", price: 2.88 },
  { m: "Dec", price: 3.12 },
  { m: "Jan", price: 3.45 },
  { m: "Feb", price: 3.92 },
  { m: "Mar", price: 4.21 },
  { m: "Apr", price: 3.87 },
  { m: "May", price: 3.41 },
];

// lib/eggs-data.ts
// Runtime data layer — call from Server Components or API routes.
// Client components import the typed shapes and receive them as props.

import {
  fetchEggPrices,
  getMockEggPrices,
  getMockStorePrices,
  computeNational,
  type TrendPoint,
  type StorePrice,
  type NationalStats,
} from "./api";

export type { TrendPoint, StorePrice, NationalStats };

/* ─── Trend data (BLS CPI) ─── */
export async function getTrends(
  startYear = "2024",
  endYear = new Date().getFullYear().toString()
): Promise<TrendPoint[]> {
  try {
    return await fetchEggPrices(startYear, endYear);
  } catch {
    return getMockEggPrices();
  }
}

/* ─── Store prices (Kroger API + mock for others) ─── */
export async function getStorePrices(zip = "77024"): Promise<StorePrice[]> {
  // Always use mock for non-Kroger stores; Kroger merged in the API route
  return getMockStorePrices(zip, "all");
}

/* ─── National stats derived from trend data ─── */
export async function getNational(zip?: string): Promise<NationalStats> {
  const trends = await getTrends();
  return computeNational(trends);
}

/* ─── Egg type reference data (static) ─── */
export interface EggTypeInfo {
  id: string;
  name: string;
  avg: number;
  blurb: string;
}

export const EGG_TYPES: EggTypeInfo[] = [
  {
    id: "conventional",
    name: "Conventional",
    avg: 4.82,
    blurb: "The baseline bird.",
  },
  { id: "cage-free", name: "Cage-Free", avg: 6.31, blurb: "Uncaged, indoors." },
  {
    id: "free-range",
    name: "Free-Range",
    avg: 7.7,
    blurb: "Outdoor access, briefly.",
  },
  {
    id: "organic",
    name: "Organic",
    avg: 9.14,
    blurb: "Certified organic feed.",
  },
  {
    id: "pasture-raised",
    name: "Pasture-Raised",
    avg: 11.57,
    blurb: "The premium life.",
  },
];

/* ─── Nearby store list for Finder (mock shape) ─── */
export interface NearbyStore {
  store: string;
  addr: string;
  miles: number;
  price: number;
  type: string;
}

export async function getNearbyStores(zip: string): Promise<NearbyStore[]> {
  const prices = await getMockStorePrices(zip, "all");
  return prices.map((p) => ({
    store: p.store,
    addr: p.addr ?? "",
    miles: p.miles ?? 0,
    price: p.price,
    type: p.note ?? "Large white, dz",
  }));
}

export const NEARBY = [
  {
    store: "Aldi",
    addr: "2410 W Main St",
    miles: 1.2,
    price: 2.18,
    type: "Large White, dz",
  },
  {
    store: "Walmart Supercenter",
    addr: "8800 Hwy 6",
    miles: 2.4,
    price: 2.46,
    type: "Great Value, dz",
  },
  {
    store: "H-E-B",
    addr: "1525 N Loop",
    miles: 2.9,
    price: 2.62,
    type: "Hill Country, dz",
  },
  {
    store: "Kroger",
    addr: "350 Westheimer",
    miles: 3.1,
    price: 2.74,
    type: "Brown Cage-Free, dz",
  },
  {
    store: "Target",
    addr: "4323 San Felipe",
    miles: 3.6,
    price: 2.89,
    type: "Good & Gather, dz",
  },
  {
    store: "Whole Foods",
    addr: "11145 Westheimer",
    miles: 5.2,
    price: 4.99,
    type: "Organic Pasture, dz",
  },
];

export const NATIONAL = {
  avg: 3.41,
  yoy: -12.4,
  weekly: -3.1,
  cheapestState: "Iowa",
  cheapestPrice: 2.04,
  costliestState: "Hawaii",
  costliestPrice: 7.18,
};

export const TICKER = [
  "USDA: shell-egg wholesale dropped $0.18 this week",
  "Iowa flocks back online — supply rising",
  "California cage-free mandate keeps prices 38% above national",
  "Costco 24-pack restock alert: $5.49",
  "Aldi undercuts Walmart in 71% of zip codes",
  "Avian flu watch: 4 states monitored",
];
