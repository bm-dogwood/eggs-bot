import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = buildMetadata({
  title: "Costco Egg Prices 2025 — Kirkland Eggs Worth It? | EGGS.BOT",
  description:
    "Costco Kirkland egg prices in 2025. Is Costco the cheapest place to buy eggs? Price per egg comparison vs Aldi, Walmart, and Kroger. Member analysis.",
  path: "/costco-egg-prices",
  keywords: [
    "Costco egg prices",
    "Kirkland eggs",
    "Costco eggs 2025",
    "Costco eggs per egg price",
    "is Costco cheapest for eggs",
  ],
});

export default function CostcoEggPrices() {
  const products = [
    {
      name: "Kirkland Large White (36ct)",
      price: 7.99,
      count: 36,
      perEgg: 0.222,
      type: "Conventional",
      notes: "Best per-egg value",
    },
    {
      name: "Kirkland Organic (2×24ct)",
      price: 13.99,
      count: 48,
      perEgg: 0.291,
      type: "Organic",
      notes: "USDA certified",
    },
    {
      name: "Kirkland Cage-Free (24ct)",
      price: 8.99,
      count: 24,
      perEgg: 0.374,
      type: "Cage-Free",
      notes: "No added hormones",
    },
  ];

  const comparison = [
    {
      store: "Costco (Kirkland 36ct)",
      perEgg: 0.222,
      perDoz: 2.66,
      winner: true,
    },
    {
      store: "Aldi (Goldhen 12ct)",
      perEgg: 0.207,
      perDoz: 2.49,
      winner: false,
    },
    {
      store: "Walmart (Great Value 12ct)",
      perEgg: 0.24,
      perDoz: 2.88,
      winner: false,
    },
    {
      store: "Kroger (store brand 12ct)",
      perEgg: 0.232,
      perDoz: 2.79,
      winner: false,
    },
    {
      store: "Target (Good & Gather 12ct)",
      perEgg: 0.266,
      perDoz: 3.19,
      winner: false,
    },
  ].sort((a, b) => a.perEgg - b.perEgg);

  return (
    <div className="min-h-screen" style={{ background: "var(--carton)" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div>
          <h1
            className="font-display text-5xl md:text-6xl mb-3"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            COSTCO EGG PRICES 2025
          </h1>
          <p className="text-lg" style={{ color: "rgba(253,246,227,0.65)" }}>
            Are Costco Kirkland eggs actually the cheapest? Full price breakdown
            and comparison.
          </p>
        </div>

        {/* Costco products */}
        <section>
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            CURRENT COSTCO EGG PRICES
          </h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.name}
                className="card-dark rounded-xl p-5 flex items-center gap-6"
              >
                <span className="text-3xl">🥚</span>
                <div className="flex-1">
                  <div className="font-medium mb-1">{p.name}</div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(253,246,227,0.4)" }}
                  >
                    {p.type} · {p.notes}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-display text-2xl"
                    style={{ color: "var(--yolk)", letterSpacing: "0.03em" }}
                  >
                    ${p.price.toFixed(2)}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: "rgba(253,246,227,0.4)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    ${p.perEgg.toFixed(3)}/egg · {p.count}ct
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Per-egg comparison */}
        <section className="card-dark rounded-2xl overflow-hidden">
          <div
            className="p-5 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <h2
              className="font-display text-2xl"
              style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
            >
              PER-EGG PRICE COMPARISON
            </h2>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "rgba(245,158,11,0.08)" }}
          >
            {comparison.map((c, i) => (
              <div
                key={c.store}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <span
                  className="font-display text-xl w-8 flex-shrink-0"
                  style={{
                    color: i === 0 ? "#22c55e" : "rgba(253,246,227,0.2)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-sm">{c.store}</span>
                {i === 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(34,197,94,0.2)",
                      color: "#22c55e",
                    }}
                  >
                    CHEAPEST/EGG
                  </span>
                )}
                <span
                  className="font-mono text-sm"
                  style={{
                    color: "var(--yolk)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ${c.perEgg.toFixed(3)}/egg
                </span>
                <span
                  className="font-mono text-sm w-20 text-right"
                  style={{
                    color: "rgba(253,246,227,0.4)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ${c.perDoz.toFixed(2)}/dz
                </span>
              </div>
            ))}
          </div>
          <p
            className="px-5 py-3 text-xs"
            style={{
              borderTop: "1px solid var(--border)",
              color: "rgba(253,246,227,0.3)",
            }}
          >
            * Prices are estimates. Aldi typically wins on per-egg cost at small
            quantities.
          </p>
        </section>

        {/* Verdict */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            IS COSTCO WORTH IT FOR EGGS?
          </h2>
          <div
            className="space-y-4 text-sm leading-relaxed"
            style={{ color: "rgba(253,246,227,0.65)" }}
          >
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <strong style={{ color: "#22c55e" }}>✅ YES if:</strong> you use
              36+ eggs before expiry (~3 weeks), already have a membership for
              other items, and cook eggs frequently. At $0.222/egg, it's
              competitive.
            </div>
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <strong style={{ color: "#ef4444" }}>❌ NOT if:</strong> you're
              buying eggs just for Costco's price — Aldi Goldhen at $0.207/egg
              is slightly cheaper with no membership, no bulk commitment, and no
              risk of 24 wasted eggs.
            </div>
            <p>
              The real Costco egg value is{" "}
              <strong style={{ color: "var(--shell)" }}>
                convenience for bulk buyers
              </strong>
              . If you're already making a Costco run, the 36ct is excellent.
              Dedicated egg-price shoppers should check Aldi first.
            </p>
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
            🥚 Compare all stores near your ZIP →
          </Link>
        </div>
      </main>
    </div>
  );
}
