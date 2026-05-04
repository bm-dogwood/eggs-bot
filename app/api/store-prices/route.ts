// app/api/stores/route.ts
import { NextResponse } from "next/server";
import { getMockStorePrices, fetchKrogerEggPrices } from "@/lib/api";
import type { EggType, StorePrice } from "@/lib/api";

export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip");
  const eggType = (searchParams.get("type") || "all") as EggType;

  if (!zip || zip.length !== 5 || !/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { success: false, error: "Invalid ZIP code" },
      { status: 400 }
    );
  }

  const results: StorePrice[] = [];
  const hasKrogerCreds =
    !!process.env.KROGER_CLIENT_ID && !!process.env.KROGER_CLIENT_SECRET;

  // ── Kroger (live API) ──────────────────────────────────────────────────────
  if (hasKrogerCreds) {
    try {
      const krogerProducts = await fetchKrogerEggPrices(zip, eggType);
      for (const product of krogerProducts.slice(0, 3)) {
        const item = product.items?.[0];
        if (!item?.price?.regular) continue;
        const price: number = item.price.promo ?? item.price.regular;
        results.push({
          store: "Kroger",
          logo: "🏪",
          price,
          pricePerEgg: Math.round((price / 12) * 1000) / 1000,
          size: item.size ?? "12 Large",
          type: eggType === "all" ? "conventional" : eggType,
          inStock: true,
          link: `https://www.kroger.com/p/${product.description
            .toLowerCase()
            .replace(/\s+/g, "-")}/${product.productId}`,
          source: "api",
        });
      }
    } catch (err) {
      console.error("Kroger API error:", err);
    }
  }

  // ── Other stores (estimated / mock) ────────────────────────────────────────
  const mockPrices = getMockStorePrices(zip, eggType);
  const storesInResults = new Set(results.map((r) => r.store));
  for (const mock of mockPrices) {
    if (!storesInResults.has(mock.store)) results.push(mock);
  }

  // Sort cheapest first
  results.sort((a, b) => (a.pricePerEgg ?? 999) - (b.pricePerEgg ?? 999));

  return NextResponse.json({
    success: true,
    zip,
    eggType,
    krogerApiUsed: hasKrogerCreds,
    count: results.length,
    data: results,
  });
}
