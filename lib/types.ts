// ─── Egg Types ───────────────────────────────────────────────────────────────
export type EggType =
  | "all"
  | "conventional"
  | "cage-free"
  | "free-range"
  | "organic"
  | "pasture-raised";

// ─── BLS / Price History ─────────────────────────────────────────────────────
export interface EggPricePoint {
  period: string; // e.g. "January"
  year: string; // e.g. "2024"
  price: number; // USD per dozen
}

export interface PriceStats {
  current: number;
  previous: number;
  yearAgo: number;
  allTimeHigh: number;
  allTimeLow: number;
  history: EggPricePoint[];
}

// ─── Store / Retail ──────────────────────────────────────────────────────────
export type PriceSource = "api" | "estimated" | "scraped";

export interface StorePrice {
  store: string;
  logo: string;
  price: number; // per dozen
  pricePerEgg: number;
  size: string; // e.g. "12-count"
  eggType: EggType;
  source: PriceSource;
  distance?: number; // miles
  link: string;
  note?: string;
  inStock: boolean;
}

// ─── Kroger API types ────────────────────────────────────────────────────────
export interface KrogerProduct {
  productId: string;
  description: string;
  items: KrogerItem[];
}

export interface KrogerItem {
  itemId: string;
  price: {
    regular: number;
    promo?: number;
  };
  size: string;
  soldBy: string;
}

export interface KrogerLocation {
  locationId: string;
  name: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  };
  geolocation: {
    latitude: number;
    longitude: number;
  };
}

// ─── Alerts ─────────────────────────────────────────────────────────────────
export interface PriceAlert {
  id: string;
  email: string;
  targetPrice: number;
  eggType: EggType;
  zip?: string;
  createdAt: string;
  active: boolean;
}

// ─── Seasonal ────────────────────────────────────────────────────────────────
export interface SeasonalDataPoint {
  month: string;
  price: number;
  demand: "High" | "Med" | "Low";
}

// ─── API Response wrappers ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  error?: string;
  cached?: boolean;
  fetchedAt: string;
}
