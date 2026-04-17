import { NextResponse } from 'next/server';
import { getMockStorePrices, fetchKrogerEggPrices } from '@/lib/api';
import type { EggType, StorePrice } from '@/lib/api';

export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');
  const eggType = (searchParams.get('type') || 'all') as EggType;

  if (!zip || zip.length !== 5 || !/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ZIP code' },
      { status: 400 }
    );
  }

  const results: StorePrice[] = [];

  // Try Kroger API (free)
  const hasKrogerCreds =
    process.env.KROGER_CLIENT_ID && process.env.KROGER_CLIENT_SECRET;

  if (hasKrogerCreds) {
    try {
      const krogerProducts = await fetchKrogerEggPrices(zip, eggType);

      if (krogerProducts.length > 0) {
        // Map Kroger API response to StorePrice format
        for (const product of krogerProducts.slice(0, 3)) {
          const item = product.items?.[0];
          if (!item?.price?.regular) continue;

          results.push({
            store: 'Kroger',
            logo: '🏪',
            price: item.price.promo || item.price.regular,
            pricePerEgg: (item.price.promo || item.price.regular) / 12,
            size: item.size || '12 Large',
            type: eggType === 'all' ? 'conventional' : eggType,
            inStock: true,
            link: `https://www.kroger.com/p/${product.description
              .toLowerCase()
              .replace(/\s+/g, '-')}/${product.productId}`,
            source: 'api',
          });
        }
      }
    } catch (err) {
      console.error('Kroger API error in route:', err);
    }
  }

  // Add estimated prices for other stores
  const mockPrices = getMockStorePrices(zip, eggType);

  // Merge: keep Kroger from API if available, use mock for rest
  const storesInResults = new Set(results.map((r) => r.store));
  for (const mock of mockPrices) {
    if (!storesInResults.has(mock.store)) {
      results.push(mock);
    }
  }

  // Sort by price per egg
  results.sort((a, b) => (a.pricePerEgg || 999) - (b.pricePerEgg || 999));

  return NextResponse.json({
    success: true,
    zip,
    eggType,
    krogerApiUsed: hasKrogerCreds,
    count: results.length,
    data: results,
  });
}
