import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = buildMetadata({
  title: "Aldi Egg Prices 2025 — Cheapest Eggs? Goldhen Review | EGGS.BOT",
  description:
    "Aldi egg prices in 2025. Are Aldi Goldhen eggs the cheapest? Price history, quality comparison vs Walmart and Kroger, and tips for saving more.",
  path: "/aldi-egg-prices",
  keywords: [
    "Aldi egg prices",
    "Aldi Goldhen eggs",
    "Aldi eggs 2025",
    "cheapest eggs Aldi",
    "Aldi vs Walmart eggs",
  ],
});

export default function AldiEggPrices() {
  const products = [
    {
      name: "Goldhen Large White (12ct)",
      price: 2.49,
      count: 12,
      perEgg: 0.207,
      type: "Conventional",
      rating: "★★★★☆",
    },
    {
      name: "Goldhen Large Brown (12ct)",
      price: 2.79,
      count: 12,
      perEgg: 0.232,
      type: "Conventional",
      rating: "★★★★☆",
    },
    {
      name: "Goldhen Cage-Free (12ct)",
      price: 3.99,
      count: 12,
      perEgg: 0.332,
      type: "Cage-Free",
      rating: "★★★★☆",
    },
    {
      name: "Goldhen Free-Range (12ct)",
      price: 4.49,
      count: 12,
      perEgg: 0.374,
      type: "Free-Range",
      rating: "★★★★☆",
    },
    {
      name: "Simply Nature Organic (12ct)",
      price: 5.49,
      count: 12,
      perEgg: 0.457,
      type: "Organic",
      rating: "★★★★☆",
    },
  ];

  const vsCompetitors = [
    { store: "Aldi (Goldhen)", perDoz: 2.49, badge: "🏆 LOWEST" },
    { store: "Kroger (store brand)", perDoz: 2.79, badge: "" },
    { store: "Walmart (Great Value)", perDoz: 2.88, badge: "" },
    { store: "Target (Good & Gather)", perDoz: 3.19, badge: "" },
    { store: "Whole Foods (365)", perDoz: 3.99, badge: "" },
  ];

  const tips = [
    {
      title: "Shop on Wednesdays",
      detail:
        "Aldi's ALDI FINDS rotate weekly (Thursdays) but conventional grocery prices reset mid-week. Egg shelf stock is typically freshest Wednesday–Thursday.",
    },
    {
      title: "No price matching",
      detail:
        "Aldi doesn't price match and doesn't accept coupons. The price is the price — which is already the lowest.",
    },
    {
      title: "Stock up when in stock",
      detail:
        "Aldi supply can be inconsistent. If you find eggs well-stocked, buying 2–3 dozen makes sense — eggs last 3–5 weeks refrigerated.",
    },
    {
      title: "Cage-free for minimal premium",
      detail:
        "At $3.99 vs $2.49, Aldi cage-free is a 60¢ step up. That cage-free price still beats many competitors' conventional prices.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--carton)" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div>
          <h1
            className="font-display text-5xl md:text-6xl mb-3"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            ALDI EGG PRICES 2025
          </h1>
          <p className="text-lg" style={{ color: "rgba(253,246,227,0.65)" }}>
            Goldhen eggs — consistently the lowest conventional egg price at any
            major U.S. grocery chain.
          </p>
        </div>

        {/* Price spotlight */}
        <div className="card-dark rounded-2xl p-8 text-center yolk-glow">
          <div className="text-4xl mb-2">🏆</div>
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{
              color: "rgba(253,246,227,0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Aldi Goldhen Large · 12ct
          </p>
          <div
            className="font-display text-7xl mb-2"
            style={{ color: "var(--yolk)", letterSpacing: "0.04em" }}
          >
            $2.49
          </div>
          <div
            className="text-sm"
            style={{
              color: "rgba(253,246,227,0.5)",
              fontFamily: "var(--font-mono)",
            }}
          >
            $0.207 per egg · typically lowest in the U.S.
          </div>
        </div>

        {/* All Aldi egg products */}
        <section>
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            ALL ALDI EGG PRODUCTS
          </h2>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div
                key={p.name}
                className="card-dark rounded-xl p-4 flex items-center gap-4"
              >
                <span className="text-2xl">🥚</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="flex gap-3 mt-0.5">
                    <span
                      className="text-xs"
                      style={{ color: "rgba(253,246,227,0.4)" }}
                    >
                      {p.type}
                    </span>
                    <span className="text-xs" style={{ color: "var(--yolk)" }}>
                      {p.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="font-display text-xl"
                    style={{
                      color: i === 0 ? "#22c55e" : "var(--yolk)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    ${p.price.toFixed(2)}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: "rgba(253,246,227,0.35)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    ${p.perEgg.toFixed(3)}/egg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* vs competitors */}
        <section className="card-dark rounded-2xl overflow-hidden">
          <div
            className="p-5 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <h2
              className="font-display text-2xl"
              style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
            >
              ALDI VS COMPETITORS (12ct conventional)
            </h2>
          </div>
          <div>
            {vsCompetitors.map((c, i) => {
              const pct = i === 0 ? 0 : ((c.perDoz - 2.49) / 2.49) * 100;
              return (
                <div
                  key={c.store}
                  className="flex items-center gap-4 px-5 py-3.5"
                  style={{ borderBottom: "1px solid rgba(245,158,11,0.08)" }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{c.store}</span>
                      {c.badge && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: "rgba(34,197,94,0.2)",
                            color: "#22c55e",
                          }}
                        >
                          {c.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="text-sm font-mono"
                    style={{
                      color: "var(--yolk)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    ${c.perDoz.toFixed(2)}
                  </div>
                  {pct > 0 && (
                    <div
                      className="text-xs w-20 text-right"
                      style={{
                        color: "#ef4444",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      +{pct.toFixed(0)}% more
                    </div>
                  )}
                  {pct === 0 && (
                    <div
                      className="text-xs w-20 text-right"
                      style={{
                        color: "#22c55e",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      baseline
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Aldi tips */}
        <section>
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            ALDI EGG SHOPPING TIPS
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tips.map((t) => (
              <div key={t.title} className="card-dark rounded-xl p-4">
                <div
                  className="font-medium text-sm mb-2"
                  style={{ color: "var(--yolk)" }}
                >
                  {t.title}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "rgba(253,246,227,0.55)" }}
                >
                  {t.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quality verdict */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            ARE ALDI EGGS GOOD QUALITY?
          </h2>
          <div
            className="text-sm leading-relaxed space-y-3"
            style={{ color: "rgba(253,246,227,0.65)" }}
          >
            <p>
              Goldhen eggs are Grade A USDA certified — the same grade as
              Eggland's Best, Vital Farms, and all major name brands. The "Grade
              A" designation covers shell integrity, white consistency, and yolk
              position. Nutritionally, there is{" "}
              <strong style={{ color: "var(--shell)" }}>
                no meaningful difference
              </strong>{" "}
              between Goldhen and premium conventional brands.
            </p>
            <p>
              Like most large grocery chains, Aldi sources Goldhen eggs from
              regional producers — the specific farm varies by location. This
              means freshness and quality can vary slightly by region, but in
              consumer testing, Goldhen consistently scores comparably to
              name-brand eggs at 2× the price.
            </p>
            <div
              className="p-4 rounded-xl mt-4"
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <strong style={{ color: "var(--yolk)" }}>Bottom line:</strong>
              <span style={{ color: "rgba(253,246,227,0.7)" }}>
                {" "}
                For conventional eggs, Aldi Goldhen is the best value in U.S.
                grocery. The only reason to shop elsewhere is proximity,
                availability, or a sale at another store.
              </span>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--yolk-deep), var(--yolk))",
              color: "var(--carton)",
            }}
          >
            🥚 Find cheapest eggs near your ZIP →
          </Link>
        </div>
      </main>
    </div>
  );
}
