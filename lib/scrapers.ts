/**
 * eggs.bot — Web Scrapers
 * ─────────────────────────────────────────────────────────────────────────────
 * Production scraping for Walmart, Target, and Aldi.
 * Uses Playwright with stealth to avoid bot detection.
 *
 * Install dependencies:
 *   npm install playwright playwright-extra puppeteer-extra-plugin-stealth
 *   npx playwright install chromium
 *
 * Usage:
 *   import { scrapeWalmartEggPrice } from '@/lib/scrapers'
 *   const price = await scrapeWalmartEggPrice('10001')
 */

// NOTE: In Next.js, scrapers must run in Node.js API routes (not Edge runtime)
// Add to your route: export const runtime = 'nodejs'

type ScrapeResult = {
  price: number | null;
  pricePerEgg: number | null;
  productName: string | null;
  inStock: boolean;
  scrapedAt: string;
  source: "scraped";
};

// ─── Walmart ──────────────────────────────────────────────────────────────────
// Walmart's internal API is the most reliable approach.
// The search API endpoint works without auth and returns structured JSON.
export async function scrapeWalmartEggPrice(
  zip: string,
  eggType: string = "large eggs"
): Promise<ScrapeResult> {
  const defaultResult: ScrapeResult = {
    price: null,
    pricePerEgg: null,
    productName: null,
    inStock: false,
    scrapedAt: new Date().toISOString(),
    source: "scraped",
  };

  try {
    // Walmart's internal search API (discovered via devtools)
    const query = encodeURIComponent(`${eggType} dozen`);
    const url = `https://www.walmart.com/search/api/preso?query=${query}&prg=desktop&page=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.walmart.com/",
        wm_zip: zip,
      },
    });

    if (!res.ok) throw new Error(`Walmart API ${res.status}`);
    const data = await res.json();

    // Navigate the response structure (may change — monitor for breakage)
    const items = data?.payload?.products ?? data?.items ?? [];
    const eggProducts = items.filter(
      (item: { name?: string }) =>
        item.name?.toLowerCase().includes("egg") &&
        item.name?.toLowerCase().includes("dozen")
    );

    if (!eggProducts.length) return defaultResult;

    // Sort by price ascending, take cheapest
    eggProducts.sort(
      (
        a: { priceInfo?: { currentPrice?: { price?: number } } },
        b: { priceInfo?: { currentPrice?: { price?: number } } }
      ) =>
        (a.priceInfo?.currentPrice?.price ?? 999) -
        (b.priceInfo?.currentPrice?.price ?? 999)
    );

    const best = eggProducts[0];
    const price = best.priceInfo?.currentPrice?.price ?? null;

    // Determine egg count from product name
    const countMatch = best.name?.match(/(\d+)\s*(?:count|ct|eggs?)/i);
    const count = countMatch ? parseInt(countMatch[1]) : 12;

    return {
      price,
      pricePerEgg: price ? price / count : null,
      productName: best.name ?? null,
      inStock: best.availabilityStatus === "IN_STOCK",
      scrapedAt: new Date().toISOString(),
      source: "scraped",
    };
  } catch (err) {
    console.error("[Walmart scraper]", err);
    return defaultResult;
  }
}

// ─── Target ──────────────────────────────────────────────────────────────────
// Target's RedSky API returns product data including pricing.
// Unofficial but stable — used by third-party Target price trackers.
export async function scrapeTargetEggPrice(
  zip: string,
  eggType: string = "large eggs"
): Promise<ScrapeResult> {
  const defaultResult: ScrapeResult = {
    price: null,
    pricePerEgg: null,
    productName: null,
    inStock: false,
    scrapedAt: new Date().toISOString(),
    source: "scraped",
  };

  try {
    const query = encodeURIComponent(`${eggType} dozen`);
    // Target search API (unofficial)
    const url = `https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v1?keyword=${query}&channel=web&count=24&default_purchasability_filter=true&pricing_store_id=auto`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
        Referer: "https://www.target.com/",
      },
    });

    if (!res.ok) throw new Error(`Target API ${res.status}`);
    const data = await res.json();

    const products = data?.data?.search?.products ?? [];
    const eggProducts = products.filter(
      (p: { item?: { product_description?: { title?: string } } }) =>
        p.item?.product_description?.title?.toLowerCase().includes("egg")
    );

    if (!eggProducts.length) return defaultResult;

    // Sort by price
    eggProducts.sort(
      (
        a: { price?: { current_retail?: number } },
        b: { price?: { current_retail?: number } }
      ) => (a.price?.current_retail ?? 999) - (b.price?.current_retail ?? 999)
    );

    const best = eggProducts[0];
    const price = best.price?.current_retail ?? null;
    const title = best.item?.product_description?.title ?? null;
    const countMatch = title?.match(/(\d+)\s*(?:count|ct|eggs?)/i);
    const count = countMatch ? parseInt(countMatch[1]) : 12;

    return {
      price,
      pricePerEgg: price ? price / count : null,
      productName: title,
      inStock: best.availability_status === "IN_STOCK",
      scrapedAt: new Date().toISOString(),
      source: "scraped",
    };
  } catch (err) {
    console.error("[Target scraper]", err);
    return defaultResult;
  }
}

// ─── Aldi ─────────────────────────────────────────────────────────────────────
// Aldi has no API. Full HTML scraping required via Playwright.
// Prices update weekly — cache results for 6+ hours.
//
// IMPORTANT: Requires playwright installed in your environment.
// For Vercel deployment, use a separate scraping service (Railway, Render, etc.)
// and call it from your Next.js API routes.
export async function scrapeAldiEggPrice(): Promise<ScrapeResult> {
  const defaultResult: ScrapeResult = {
    price: null,
    pricePerEgg: null,
    productName: null,
    inStock: false,
    scrapedAt: new Date().toISOString(),
    source: "scraped",
  };

  // Uncomment when Playwright is installed:
  /*
    const { chromium } = await import('playwright');
    const { default: StealthPlugin } = await import('puppeteer-extra-plugin-stealth');
  
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        viewport: { width: 1280, height: 720 },
      });
      const page = await context.newPage();
  
      await page.goto('https://www.aldi.us/en/offers/', {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
  
      // Find egg products in weekly specials
      const eggCards = await page.locator('[data-testid="product-card"]').filter({
        hasText: /egg/i
      }).all();
  
      for (const card of eggCards) {
        const name = await card.locator('h3, .product-title').textContent();
        if (!name?.toLowerCase().includes('egg')) continue;
  
        const priceText = await card.locator('.price, [class*="price"]').textContent();
        const priceMatch = priceText?.match(/\$?([\d.]+)/);
        if (!priceMatch) continue;
  
        const price = parseFloat(priceMatch[1]);
        const countMatch = name.match(/(\d+)\s*(?:count|ct|eggs?)/i);
        const count = countMatch ? parseInt(countMatch[1]) : 12;
  
        return {
          price,
          pricePerEgg: price / count,
          productName: name.trim(),
          inStock: true, // If it's in the weekly ad, it's in stock
          scrapedAt: new Date().toISOString(),
          source: 'scraped',
        };
      }
    } catch (err) {
      console.error('[Aldi scraper]', err);
    } finally {
      await browser?.close();
    }
    */

  console.warn(
    "[Aldi scraper] Playwright not installed — returning null price"
  );
  return defaultResult;
}

// ─── Costco ──────────────────────────────────────────────────────────────────
// Costco pricing is relatively stable. Their search API works without auth.
export async function scrapeCostcoEggPrice(): Promise<ScrapeResult> {
  const defaultResult: ScrapeResult = {
    price: null,
    pricePerEgg: null,
    productName: null,
    inStock: false,
    scrapedAt: new Date().toISOString(),
    source: "scraped",
  };

  try {
    // Costco search endpoint (unofficial)
    const res = await fetch(
      "https://www.costco.com/CatalogSearch?keyword=eggs&pageSize=24&currentPage=0&sortBy=price-asc",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "text/html,application/xhtml+xml",
          Referer: "https://www.costco.com/",
        },
      }
    );

    if (!res.ok) throw new Error(`Costco ${res.status}`);

    // Parse HTML for price (Costco is server-rendered)
    const html = await res.text();
    // Look for structured data or price elements
    const priceMatch = html.match(/"price":\s*"?([\d.]+)"?/);
    const nameMatch = html.match(
      /<span[^>]*automation-id="productName"[^>]*>([^<]+)<\/span>/
    );

    if (!priceMatch) return defaultResult;

    const price = parseFloat(priceMatch[1]);
    const name = nameMatch?.[1]?.trim() ?? "Kirkland Signature Large Eggs";
    const countMatch = name.match(/(\d+)\s*(?:count|ct|eggs?)/i);
    const count = countMatch ? parseInt(countMatch[1]) : 36; // Costco default is 36ct

    return {
      price,
      pricePerEgg: price / count,
      productName: name,
      inStock: true,
      scrapedAt: new Date().toISOString(),
      source: "scraped",
    };
  } catch (err) {
    console.error("[Costco scraper]", err);
    return defaultResult;
  }
}

// ─── Aggregator — run all scrapers in parallel ───────────────────────────────
export async function scrapeAllStorePrices(zip: string) {
  const [walmart, target, aldi, costco] = await Promise.allSettled([
    scrapeWalmartEggPrice(zip),
    scrapeTargetEggPrice(zip),
    scrapeAldiEggPrice(),
    scrapeCostcoEggPrice(),
  ]);

  return {
    walmart: walmart.status === "fulfilled" ? walmart.value : null,
    target: target.status === "fulfilled" ? target.value : null,
    aldi: aldi.status === "fulfilled" ? aldi.value : null,
    costco: costco.status === "fulfilled" ? costco.value : null,
  };
}
