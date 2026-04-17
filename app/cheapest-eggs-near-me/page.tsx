import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "../../components/Navbar";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Cheapest Eggs Near Me — By ZIP Code Price Comparison | EGGS.BOT",
  description:
    "Find the cheapest eggs near you by ZIP code. Compare egg prices at Aldi, Kroger, Walmart, Target, and Costco near you. Free egg price lookup.",
  path: "/cheapest-eggs-near-me",
  keywords: [
    "cheapest eggs near me",
    "eggs near me",
    "cheap eggs",
    "egg prices near me",
    "where to buy eggs cheapest",
  ],
});

export default function CheapestEggsNearMe() {
  const storeRanking = [
    {
      rank: 1,
      store: "Aldi",
      why: "No-frills format, house brand only, low overhead = lowest egg prices consistently. Goldhen large dozen beats all competitors most weeks.",
      price: "~$2.49",
      membership: false,
    },
    {
      rank: 2,
      store: "Kroger",
      why: "Free API access means real-time pricing. Simple Truth and Kroger brand compete directly with Aldi on conventional eggs. Weekly sales can beat Aldi.",
      price: "~$2.79",
      membership: false,
    },
    {
      rank: 3,
      store: "Walmart",
      why: "Great Value eggs are priced aggressively. Walmart's scale means consistent low pricing, often within 10–20¢ of Aldi.",
      price: "~$2.88",
      membership: false,
    },
    {
      rank: 4,
      store: "Costco",
      why: "Membership required but Kirkland 36-count at ~$7.99 delivers the best per-egg value ($0.22/egg) for heavy users.",
      price: "$7.99/36ct",
      membership: true,
    },
    {
      rank: 5,
      store: "Target",
      why: "Good & Gather brand is quality-forward at a slight premium. Circle card members get 5% off, narrowing the gap with competitors.",
      price: "~$3.19",
      membership: false,
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
            CHEAPEST EGGS NEAR ME
          </h1>
          <p className="text-lg" style={{ color: "rgba(253,246,227,0.65)" }}>
            Where to find the lowest egg prices near you, ranked by typical
            cost.
          </p>
        </div>

        {/* ZIP search CTA */}
        <div className="card-dark rounded-2xl p-6 yolk-glow text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <h2
            className="font-display text-2xl mb-2"
            style={{ color: "var(--yolk)" }}
          >
            GET LOCAL PRICES
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: "rgba(253,246,227,0.55)" }}
          >
            Enter your ZIP code on our main dashboard for real-time prices via
            Kroger API
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--yolk-deep), var(--yolk))",
              color: "var(--carton)",
            }}
          >
            🔍 Search by ZIP code →
          </Link>
        </div>

        {/* Store ranking */}
        <div>
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            STORES RANKED BY EGG PRICE
          </h2>
          <div className="space-y-3">
            {storeRanking.map((s) => (
              <div
                key={s.store}
                className="card-dark rounded-xl p-5 flex gap-4"
              >
                <div
                  className="font-display text-4xl flex-shrink-0 w-12 text-center"
                  style={{
                    color:
                      s.rank === 1 ? "var(--yolk)" : "rgba(253,246,227,0.2)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {String(s.rank).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">{s.store}</span>
                    <span
                      className="font-mono text-sm px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(245,158,11,0.15)",
                        color: "var(--yolk)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {s.price}
                    </span>
                    {s.membership && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(253,246,227,0.4)",
                        }}
                      >
                        membership
                      </span>
                    )}
                    {s.rank === 1 && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(34,197,94,0.2)",
                          color: "#22c55e",
                        }}
                      >
                        🏆 CHEAPEST
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(253,246,227,0.5)" }}
                  >
                    {s.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            PRO TIPS
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                tip: "Check circulars first",
                detail:
                  "Kroger and Walmart run loss-leader egg promotions regularly. Loss leaders can beat Aldi.",
              },
              {
                tip: "Buy store brand",
                detail:
                  "Name-brand eggs (Eggland's Best, Vital Farms) charge 30–100% more for marginal differences.",
              },
              {
                tip: "Costco math",
                detail:
                  "At $0.22/egg vs ~$0.23/egg at Aldi, Costco wins if you use 36+ eggs before they expire.",
              },
              {
                tip: "Use Kroger API data",
                detail:
                  "EGGS.BOT pulls live Kroger prices for your ZIP. Search on our homepage for real prices.",
              },
            ].map((t) => (
              <div
                key={t.tip}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(26,18,8,0.6)",
                  border: "1px solid rgba(245,158,11,0.1)",
                }}
              >
                <div
                  className="font-medium text-sm mb-1"
                  style={{ color: "var(--yolk)" }}
                >
                  {t.tip}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(253,246,227,0.5)" }}
                >
                  {t.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
