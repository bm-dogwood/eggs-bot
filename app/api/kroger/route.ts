// app/api/kroger/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKrogerToken } from "@/lib/kroger-auth";

const BASE = "https://api.kroger.com/v1";

interface KrogerLocation {
  locationId: string;
  name: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  };
  geolocation: { latitude: number; longitude: number };
}

interface KrogerProduct {
  productId: string;
  description: string;
  items: Array<{
    price?: { regular: number; promo: number };
    size?: string;
  }>;
}

async function zipToCoords(
  zip: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json&limit=1`,
      { headers: { "User-Agent": "EggTracker/1.0" } }
    );
    const data = await res.json();
    if (!data?.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get("zip") ?? "77024";

  try {
    const token = await getKrogerToken();

    // 1. Find Kroger-family stores near ZIP
    const locRes = await fetch(
      `${BASE}/locations?filter.zipCode.near=${zip}&filter.radiusInMiles=10&filter.limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!locRes.ok) throw new Error(`Kroger locations ${locRes.status}`);
    const locJson = await locRes.json();
    const locations: KrogerLocation[] = locJson.data ?? [];

    if (!locations.length) throw new Error("No Kroger stores near this ZIP");

    // 2. Get egg prices for first location (cheapest typically)
    const locId = locations[0].locationId;
    const prodRes = await fetch(
      `${BASE}/products?filter.term=large+grade+a+eggs&filter.locationId=${locId}&filter.limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!prodRes.ok) throw new Error(`Kroger products ${prodRes.status}`);
    const prodJson = await prodRes.json();
    const products: KrogerProduct[] = prodJson.data ?? [];

    // Pick cheapest item with a price
    const priced = products
      .flatMap((p) =>
        p.items
          .filter((i) => i.price?.regular)
          .map((i) => ({
            description: p.description,
            price: i.price!.promo > 0 ? i.price!.promo : i.price!.regular,
            size: i.size ?? "dozen",
          }))
      )
      .sort((a, b) => a.price - b.price);

    const coords = await zipToCoords(zip);

    const nearby = locations.map((loc) => {
      const miles = coords
        ? haversine(
            coords.lat,
            coords.lng,
            loc.geolocation.latitude,
            loc.geolocation.longitude
          ).toFixed(1)
        : "?";
      return {
        store: loc.name,
        addr: `${loc.address.addressLine1}, ${loc.address.city}`,
        miles: parseFloat(String(miles)),
        price: priced[0]?.price ?? 3.99,
        type: priced[0]?.description ?? "Large Grade A, dz",
      };
    });

    return NextResponse.json({ nearby, cheapestEgg: priced[0] ?? null });
  } catch (err) {
    console.error("[Kroger API]", err);
    // Fallback to demo data
    return NextResponse.json({ nearby: FALLBACK_NEARBY, cheapestEgg: null });
  }
}

const FALLBACK_NEARBY = [
  {
    store: "Kroger",
    addr: "1234 Westheimer Rd, Houston",
    miles: 1.1,
    price: 2.79,
    type: "Large Grade A, dz",
  },
  {
    store: "Aldi",
    addr: "5678 Memorial Dr, Houston",
    miles: 1.8,
    price: 2.18,
    type: "Large White, dz",
  },
  {
    store: "Walmart",
    addr: "9101 Katy Fwy, Houston",
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
