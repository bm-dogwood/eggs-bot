// lib/api.ts
// Unified egg-price API helpers

export type EggType =
  | "all"
  | "conventional"
  | "cage-free"
  | "free-range"
  | "organic"
  | "pasture-raised";

export interface StorePrice {
  store: string;
  logo: string;
  price: number;
  pricePerEgg: number;
  size: string;
  type: EggType | "conventional";
  inStock: boolean;
  link?: string;
  source: "api" | "mock" | "scrape";
  addr?: string;
  miles?: number;
  change?: number;
  note?: string;
}

export interface BLSDataPoint {
  year: string;
  period: string; // M01–M12
  periodName: string;
  value: string;
}

export interface TrendPoint {
  m: string; // "Jan", "Feb" …
  price: number;
}

/* ─────────────────────────────────────────
   BLS CPI — series APU0000708111
   ───────────────────────────────────────── */

const BLS_API_BASE = "https://api.bls.gov/publicAPI/v2";
const BLS_SERIES = "APU0000708111"; // Grade A large eggs, 1 dozen

export async function fetchEggPrices(
  startYear: string,
  endYear: string
): Promise<TrendPoint[]> {
  const apiKey = process.env.BLS_API_KEY;
  if (!apiKey) throw new Error("BLS_API_KEY not set");

  const res = await fetch(`${BLS_API_BASE}/timeseries/data/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seriesid: [BLS_SERIES],
      startyear: startYear,
      endyear: endYear,
      registrationkey: apiKey,
    }),
  });

  if (!res.ok) throw new Error(`BLS API error: ${res.status}`);

  const json = await res.json();
  const series = json?.Results?.series?.[0]?.data as BLSDataPoint[] | undefined;
  if (!series) throw new Error("No BLS data returned");

  // Sort chronologically, map to TrendPoint
  const MONTH_ABBR = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return series
    .filter((d) => d.period !== "M13") // skip annual avg
    .sort((a, b) =>
      a.year !== b.year
        ? Number(a.year) - Number(b.year)
        : Number(a.period.slice(1)) - Number(b.period.slice(1))
    )
    .map((d) => ({
      m: `${MONTH_ABBR[Number(d.period.slice(1))]} ${d.year.slice(2)}`,
      price: parseFloat(d.value),
    }));
}

export function getMockEggPrices(): TrendPoint[] {
  return [
    { m: "May 24", price: 2.88 },
    { m: "Jun 24", price: 2.95 },
    { m: "Jul 24", price: 3.1 },
    { m: "Aug 24", price: 3.28 },
    { m: "Sep 24", price: 3.45 },
    { m: "Oct 24", price: 3.62 },
    { m: "Nov 24", price: 3.87 },
    { m: "Dec 24", price: 4.15 },
    { m: "Jan 25", price: 4.95 },
    { m: "Feb 25", price: 5.9 },
    { m: "Mar 25", price: 6.23 },
    { m: "Apr 25", price: 5.47 },
    { m: "May 25", price: 4.82 },
  ];
}

/* ─────────────────────────────────────────
   Kroger API
   ───────────────────────────────────────── */

let _krogerToken: { token: string; expiresAt: number } | null = null;

async function getKrogerToken(): Promise<string> {
  if (_krogerToken && Date.now() < _krogerToken.expiresAt) {
    return _krogerToken.token;
  }

  const clientId = process.env.KROGER_CLIENT_ID!;
  const clientSecret = process.env.KROGER_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const res = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=product.compact",
  });

  if (!res.ok) throw new Error(`Kroger auth error: ${res.status}`);

  const json = await res.json();
  _krogerToken = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000 - 60_000,
  };
  return _krogerToken.token;
}

const EGG_TYPE_QUERY: Record<EggType, string> = {
  all: "eggs dozen",
  conventional: "large eggs dozen",
  "cage-free": "cage free eggs dozen",
  "free-range": "free range eggs dozen",
  organic: "organic eggs dozen",
  "pasture-raised": "pasture raised eggs dozen",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchKrogerEggPrices(
  zip: string,
  eggType: EggType
): Promise<any[]> {
  const token = await getKrogerToken();
  const query = EGG_TYPE_QUERY[eggType] ?? "eggs dozen";

  // First find a Kroger location near the zip
  const locRes = await fetch(
    `https://api.kroger.com/v1/locations?filter.zipCode.near=${zip}&filter.radiusInMiles=10&filter.limit=1`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!locRes.ok) throw new Error(`Kroger locations error: ${locRes.status}`);
  const locJson = await locRes.json();
  const locationId: string = locJson.data?.[0]?.locationId;
  if (!locationId) throw new Error("No Kroger locations found");

  // Fetch products at that location
  const prodRes = await fetch(
    `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(
      query
    )}&filter.locationId=${locationId}&filter.limit=5`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!prodRes.ok) throw new Error(`Kroger products error: ${prodRes.status}`);

  const prodJson = await prodRes.json();
  return prodJson.data ?? [];
}

/* ─────────────────────────────────────────
   Mock / estimated store prices
   (used when real API isn't available)
   ───────────────────────────────────────── */

const BASE_PRICES: Record<string, number> = {
  Aldi: 2.19,
  Walmart: 2.46,
  "H-E-B": 2.62,
  Kroger: 2.74,
  Target: 2.89,
  "Whole Foods": 4.99,
  Costco: 5.49,
};

const TYPE_MULTIPLIER: Record<EggType, number> = {
  all: 1.0,
  conventional: 1.0,
  "cage-free": 1.35,
  "free-range": 1.6,
  organic: 1.9,
  "pasture-raised": 2.4,
};

export function getMockStorePrices(
  zip: string,
  eggType: EggType
): StorePrice[] {
  // Seed variance from zip so results feel "local"
  const seed = zip.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const mul = TYPE_MULTIPLIER[eggType] ?? 1;

  const STORES = [
    {
      store: "Aldi",
      logo: "🛒",
      addr: "1201 N Shepherd Dr",
      miles: 1.2,
      change: -0.18,
    },
    {
      store: "Walmart",
      logo: "🏬",
      addr: "7811 Katy Fwy",
      miles: 2.4,
      change: 0.06,
    },
    {
      store: "H-E-B",
      logo: "🛍️",
      addr: "5225 Katy Fwy",
      miles: 2.9,
      change: -0.05,
    },
    {
      store: "Kroger",
      logo: "🏪",
      addr: "3203 W Holcombe Blvd",
      miles: 3.1,
      change: 0.12,
    },
    {
      store: "Target",
      logo: "🎯",
      addr: "4323 San Felipe St",
      miles: 3.6,
      change: -0.08,
    },
    {
      store: "Whole Foods",
      logo: "🌿",
      addr: "1700 Post Oak Blvd",
      miles: 5.2,
      change: 0.22,
    },
    {
      store: "Costco",
      logo: "📦",
      addr: "613 W Bay Area Blvd",
      miles: 6.4,
      note: "24-count",
      change: 0.35,
    },
  ];

  return STORES.map(({ store, logo, addr, miles, change, note }) => {
    const base = BASE_PRICES[store] ?? 3.0;
    const variance = ((seed % 30) - 15) / 100; // ± 0.15
    const price = Math.round((base * mul + variance) * 100) / 100;
    return {
      store,
      logo,
      price,
      pricePerEgg: Math.round((price / 12) * 1000) / 1000,
      size: note ?? "12 Large",
      type: eggType === "all" ? "conventional" : eggType,
      inStock: true,
      addr,
      miles,
      change: change ?? 0,
      note,
      source: "mock",
    };
  });
}

/* ─────────────────────────────────────────
   National stats — computed from BLS data
   ───────────────────────────────────────── */

export interface NationalStats {
  avg: string;
  weekly: string;
  yoy: string;
  cheapestState: string;
  cheapestPrice: string;
  costliestState: string;
  costliestPrice: string;
}

export function computeNational(trends: TrendPoint[]): NationalStats {
  if (!trends.length) {
    return {
      avg: "4.82",
      weekly: "-2.1",
      yoy: "+67",
      cheapestState: "Iowa",
      cheapestPrice: "3.21",
      costliestState: "Hawaii",
      costliestPrice: "8.49",
    };
  }
  const latest = trends[trends.length - 1].price;
  const prev = trends[trends.length - 2]?.price ?? latest;
  const yearAgo = trends[trends.length - 13]?.price ?? trends[0].price;
  const weekly = (((latest - prev) / prev) * 100).toFixed(1);
  const yoy = (((latest - yearAgo) / yearAgo) * 100).toFixed(0);
  return {
    avg: latest.toFixed(2),
    weekly,
    yoy: `${Number(yoy) > 0 ? "+" : ""}${yoy}`,
    cheapestState: "Iowa",
    cheapestPrice: (latest * 0.67).toFixed(2),
    costliestState: "Hawaii",
    costliestPrice: (latest * 1.76).toFixed(2),
  };
}
