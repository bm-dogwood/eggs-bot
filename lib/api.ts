// BLS CPI API - Free tier (500 requests/day)
// Egg series: APU0000708111
// api.bls.gov/publicAPI/v2/

export const BLS_SERIES = {
  eggs: "APU0000708111",
  bananas: "APU0000711211",
  grapes: "APU0000711311",
};

export interface BLSDataPoint {
  year: string;
  period: string;
  periodName: string;
  value: string;
  footnotes: Array<{ code: string; text: string }>;
}

export interface BLSSeriesResult {
  seriesID: string;
  data: BLSDataPoint[];
}

export interface BLSResponse {
  status: string;
  responseTime: number;
  message: string[];
  Results: {
    series: BLSSeriesResult[];
  };
}

export interface EggPricePoint {
  date: string;
  price: number;
  period: string;
  year: string;
}

// Fetch egg price history from BLS API (no key needed for v1, 500/day for v2)
export async function fetchEggPrices(
  startYear: string = "2022",
  endYear: string = new Date().getFullYear().toString()
): Promise<EggPricePoint[]> {
  const BLS_API_KEY = process.env.BLS_API_KEY || "";

  const url = BLS_API_KEY
    ? "https://api.bls.gov/publicAPI/v2/timeseries/data/"
    : "https://api.bls.gov/publicAPI/v1/timeseries/data/";

  const body: Record<string, unknown> = {
    seriesid: [BLS_SERIES.eggs],
    startyear: startYear,
    endyear: endYear,
  };

  if (BLS_API_KEY) {
    body.registrationkey = BLS_API_KEY;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) throw new Error(`BLS API error: ${res.status}`);

    const data: BLSResponse = await res.json();

    if (data.status !== "REQUEST_SUCCEEDED") {
      throw new Error(`BLS API failed: ${data.message?.join(", ")}`);
    }

    const series = data.Results?.series?.[0];
    if (!series) throw new Error("No series data returned");

    const points: EggPricePoint[] = series.data
      .filter((d) => d.period !== "M13") // Exclude annual averages
      .map((d) => {
        const monthNum = parseInt(d.period.replace("M", ""), 10);
        const date = new Date(parseInt(d.year), monthNum - 1, 1);
        return {
          date: date.toISOString().slice(0, 7),
          price: parseFloat(d.value),
          period: d.periodName,
          year: d.year,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return points;
  } catch (error) {
    console.error("Failed to fetch BLS egg prices:", error);
    // Return mock fallback data so the UI still works
    return getMockEggPrices();
  }
}

// Fetch latest single price
export async function fetchLatestEggPrice(): Promise<number> {
  const prices = await fetchEggPrices(
    new Date().getFullYear().toString(),
    new Date().getFullYear().toString()
  );
  if (prices.length === 0) return 3.28;
  return prices[prices.length - 1].price;
}

// Mock data fallback (reflects real historical BLS data)
export function getMockEggPrices(): EggPricePoint[] {
  return [
    { date: "2022-01", price: 1.93, period: "January", year: "2022" },
    { date: "2022-04", price: 2.52, period: "April", year: "2022" },
    { date: "2022-07", price: 2.88, period: "July", year: "2022" },
    { date: "2022-10", price: 3.51, period: "October", year: "2022" },
    { date: "2022-12", price: 4.25, period: "December", year: "2022" },
    { date: "2023-01", price: 4.82, period: "January", year: "2023" },
    { date: "2023-03", price: 3.78, period: "March", year: "2023" },
    { date: "2023-06", price: 2.06, period: "June", year: "2023" },
    { date: "2023-09", price: 2.11, period: "September", year: "2023" },
    { date: "2023-12", price: 2.51, period: "December", year: "2023" },
    { date: "2024-01", price: 2.99, period: "January", year: "2024" },
    { date: "2024-04", price: 2.72, period: "April", year: "2024" },
    { date: "2024-07", price: 2.95, period: "July", year: "2024" },
    { date: "2024-10", price: 3.37, period: "October", year: "2024" },
    { date: "2024-12", price: 4.15, period: "December", year: "2024" },
    { date: "2025-01", price: 4.95, period: "January", year: "2025" },
    { date: "2025-02", price: 5.9, period: "February", year: "2025" },
    { date: "2025-03", price: 6.23, period: "March", year: "2025" },
  ];
}

// Kroger API integration (free developer tier)
// Sign up at: https://developer.kroger.com/
export interface KrogerProduct {
  productId: string;
  description: string;
  brand: string;
  items: KrogerItem[];
  images: KrogerImage[];
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

export interface KrogerImage {
  perspective: string;
  sizes: Array<{ size: string; url: string }>;
}

export interface KrogerSearchResult {
  data: KrogerProduct[];
  meta: {
    pagination: {
      start: number;
      limit: number;
      total: number;
    };
  };
}

// Get Kroger OAuth token (client credentials flow)
async function getKrogerToken(): Promise<string> {
  const clientId = process.env.KROGER_CLIENT_ID;
  const clientSecret = process.env.KROGER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Kroger API credentials not configured");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const res = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=product.compact",
    next: { revalidate: 1800 }, // Token valid 30 min
  });

  if (!res.ok) throw new Error(`Kroger auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

// Find nearby Kroger location by zip
export async function findKrogerLocation(
  zipCode: string
): Promise<string | null> {
  try {
    const token = await getKrogerToken();
    const res = await fetch(
      `https://api.kroger.com/v1/locations?filter.zipCode.near=${zipCode}&filter.limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.locationId || null;
  } catch {
    return null;
  }
}

// Search Kroger egg prices by zip
export async function fetchKrogerEggPrices(
  zipCode: string,
  eggType: EggType = "all"
): Promise<KrogerProduct[]> {
  try {
    const token = await getKrogerToken();
    const locationId = await findKrogerLocation(zipCode);

    const typeQuery =
      eggType === "organic"
        ? "organic eggs"
        : eggType === "cage-free"
        ? "cage free eggs"
        : eggType === "pasture-raised"
        ? "pasture raised eggs"
        : "large eggs dozen";

    const locationParam = locationId ? `&filter.locationId=${locationId}` : "";

    const res = await fetch(
      `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(
        typeQuery
      )}&filter.limit=10${locationParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error(`Kroger products API error: ${res.status}`);
    const data: KrogerSearchResult = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Kroger API error:", error);
    return [];
  }
}

export type EggType =
  | "all"
  | "conventional"
  | "organic"
  | "cage-free"
  | "pasture-raised"
  | "free-range";

export interface StorePrice {
  store: string;
  logo: string;
  price: number | null;
  pricePerEgg: number | null;
  size: string;
  type: EggType;
  inStock: boolean;
  distance?: number;
  note?: string;
  link: string;
  source: "api" | "scraped" | "estimated";
}

// Mock store prices (realistic estimates when APIs unavailable)
export function getMockStorePrices(
  zipCode: string,
  eggType: EggType
): StorePrice[] {
  const baseMap: Record<string, number> = {
    all: 1,
    conventional: 1,
    "cage-free": 1.4,
    "free-range": 1.6,
    organic: 1.8,
    "pasture-raised": 2.2,
  };
  const mult = baseMap[eggType] || 1;

  return [
    {
      store: "Aldi",
      logo: "",
      price: parseFloat((2.49 * mult).toFixed(2)),
      pricePerEgg: parseFloat(((2.49 * mult) / 12).toFixed(3)),
      size: "12 Large",
      type: eggType === "all" ? "conventional" : eggType,
      inStock: true,
      distance: 1.2,
      link: "https://www.aldi.us/products/fresh-produce-meat-and-seafood/eggs/",
      source: "estimated" as const,
      note: "Goldhen brand — typically lowest price",
    },
    {
      store: "Kroger",
      logo: "",
      price: parseFloat((2.79 * mult).toFixed(2)),
      pricePerEgg: parseFloat(((2.79 * mult) / 12).toFixed(3)),
      size: "12 Large",
      type: eggType === "all" ? "conventional" : eggType,
      inStock: true,
      distance: 0.8,
      link: `https://www.kroger.com/search?query=eggs`,
      source: "api" as const,
    },
    {
      store: "Walmart",
      logo: "",
      price: parseFloat((2.88 * mult).toFixed(2)),
      pricePerEgg: parseFloat(((2.88 * mult) / 12).toFixed(3)),
      size: "12 Large",
      type: eggType === "all" ? "conventional" : eggType,
      inStock: true,
      distance: 2.1,
      link: "https://www.walmart.com/browse/food/eggs/976759_976786_8910173",
      source: "estimated" as const,
    },
    {
      store: "Target",
      logo: "",
      price: parseFloat((3.19 * mult).toFixed(2)),
      pricePerEgg: parseFloat(((3.19 * mult) / 12).toFixed(3)),
      size: "12 Large",
      type: eggType === "all" ? "conventional" : eggType,
      inStock: true,
      distance: 3.4,
      link: "https://www.target.com/c/eggs-dairy/-/N-5xt1q",
      source: "estimated" as const,
    },
    {
      store: "Costco",
      logo: "",
      price: parseFloat((7.99 * mult).toFixed(2)),
      pricePerEgg: parseFloat(((7.99 * mult) / 36).toFixed(3)),
      size: "36 Large",
      type: eggType === "all" ? "conventional" : eggType,
      inStock: true,
      distance: 5.6,
      link: "https://www.costco.com/eggs.html",
      source: "estimated" as const,
      note: "Membership required — best per-egg value",
    },
  ].sort((a, b) => (a.pricePerEgg || 0) - (b.pricePerEgg || 0));
}

// National average stats
export async function getNationalStats() {
  const prices = await fetchEggPrices(
    "2023",
    new Date().getFullYear().toString()
  );
  const latest = prices[prices.length - 1];
  const yearAgo = prices.find((p) => {
    const d = new Date(p.date);
    const now = new Date(latest?.date || new Date());
    return (
      d.getFullYear() === now.getFullYear() - 1 &&
      d.getMonth() === now.getMonth()
    );
  });

  const allTimeHigh = Math.max(...prices.map((p) => p.price));
  const allTimeLow = Math.min(...prices.map((p) => p.price));

  return {
    current: latest?.price ?? 4.95,
    previous: prices[prices.length - 2]?.price ?? 5.9,
    yearAgo: yearAgo?.price ?? 2.99,
    allTimeHigh,
    allTimeLow,
    history: prices,
  };
}
