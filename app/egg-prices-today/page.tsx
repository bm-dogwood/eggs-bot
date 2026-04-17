import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getNationalStats } from "@/lib/api";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = buildMetadata({
  title:
    "Egg Prices Today 2025 — National Average & Store Comparison | EGGS.BOT",
  description:
    "Current egg prices today from BLS CPI data. National average egg price, weekly trends, and store-by-store comparison for 2025. Updated daily.",
  path: "/egg-prices-today",
  keywords: [
    "egg prices today",
    "current egg prices",
    "egg prices 2025",
    "egg price update",
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Egg Prices Today — Current National Average and Store Comparison",
  description:
    "Daily updated egg prices from BLS CPI data with store comparisons.",
  url: "https://eggsbot.com/egg-prices-today",
  publisher: { "@type": "Organization", name: "EGGS.BOT" },
};

export default async function EggPricesToday() {
  const stats = await getNationalStats();
  const pct = ((stats.current - stats.previous) / stats.previous) * 100;
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const storeEstimates = [
    { store: "Aldi", price: 2.49, note: "Goldhen large dozen" },
    { store: "Kroger", price: 2.79, note: "Simple Truth large dozen" },
    { store: "Walmart", price: 2.88, note: "Great Value large dozen" },
    { store: "Target", price: 3.19, note: "Good & Gather large dozen" },
    { store: "Costco", price: 7.99, note: "Kirkland 36ct ($0.22/egg)" },
    { store: "Whole Foods", price: 4.99, note: "365 large dozen" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: "var(--carton)" }}>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--yolk)", fontFamily: "var(--font-mono)" }}
            >
              Updated {today}
            </p>
            <h1
              className="font-display text-5xl md:text-6xl mb-3"
              style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
            >
              EGG PRICES TODAY
            </h1>
            <p className="text-lg" style={{ color: "rgba(253,246,227,0.65)" }}>
              Current national average egg price from BLS CPI data with major
              store comparisons.
            </p>
          </div>

          {/* Current price spotlight */}
          <div className="card-dark rounded-2xl p-8 text-center yolk-glow">
            <p
              className="text-sm uppercase tracking-widest mb-2"
              style={{
                color: "rgba(253,246,227,0.5)",
                fontFamily: "var(--font-mono)",
              }}
            >
              National Average · Dozen Large Eggs
            </p>
            <div
              className="font-display text-7xl md:text-8xl mb-3"
              style={{ color: "var(--yolk)", letterSpacing: "0.04em" }}
            >
              ${stats.current.toFixed(2)}
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{
                background:
                  pct > 0 ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                color: pct > 0 ? "#ef4444" : "#22c55e",
                fontFamily: "var(--font-mono)",
              }}
            >
              {pct > 0 ? "📈" : "📉"} {pct > 0 ? "+" : ""}
              {pct.toFixed(1)}% vs last month
            </div>
            <p
              className="mt-4 text-xs"
              style={{
                color: "rgba(253,246,227,0.35)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Source: BLS CPI Series APU0000708111
            </p>
          </div>

          {/* Store table */}
          <div className="card-dark rounded-2xl overflow-hidden">
            <div
              className="p-5 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h2
                className="font-display text-2xl"
                style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
              >
                TODAY'S STORE PRICES (EST.)
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "rgba(26,18,8,0.5)",
                  }}
                >
                  {["Store", "Price/Dozen", "$/Egg", "Product"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                      style={{
                        color: "rgba(253,246,227,0.4)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {storeEstimates.map((s, i) => (
                  <tr
                    key={s.store}
                    style={{ borderBottom: "1px solid rgba(245,158,11,0.08)" }}
                  >
                    <td className="px-5 py-3.5 font-medium">{s.store}</td>
                    <td
                      className="px-5 py-3.5"
                      style={{
                        color: "var(--yolk)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${s.price.toFixed(2)}
                      {i === 0 && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "#22c55e" }}
                        >
                          ★ lowest
                        </span>
                      )}
                    </td>
                    <td
                      className="px-5 py-3.5"
                      style={{
                        color: "rgba(253,246,227,0.5)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      $
                      {s.store === "Costco"
                        ? "0.222"
                        : (s.price / 12).toFixed(3)}
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs"
                      style={{ color: "rgba(253,246,227,0.4)" }}
                    >
                      {s.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p
              className="px-5 py-3 text-xs"
              style={{
                color: "rgba(253,246,227,0.3)",
                fontFamily: "var(--font-mono)",
                borderTop: "1px solid var(--border)",
              }}
            >
              * Prices are estimates. Verify at your local store or use{" "}
              <Link href="/" className="underline hover:text-yolk">
                EGGS.BOT
              </Link>{" "}
              with your ZIP for local prices.
            </p>
          </div>

          {/* Content */}
          <article
            className="prose-style space-y-6 text-sm leading-relaxed"
            style={{ color: "rgba(253,246,227,0.65)" }}
          >
            <h2
              className="font-display text-2xl"
              style={{ color: "var(--shell)", letterSpacing: "0.04em" }}
            >
              WHAT DRIVES TODAY'S EGG PRICE?
            </h2>
            <p>
              Today's egg prices are shaped primarily by three forces: HPAI
              (bird flu) outbreaks, feed costs, and energy prices. The national
              average of{" "}
              <strong style={{ color: "var(--yolk)" }}>
                ${stats.current.toFixed(2)}/dozen
              </strong>{" "}
              reflects these ongoing pressures, which have kept prices elevated
              since the 2022 outbreak cycle began.
            </p>
            <p>
              The USDA reports that laying hen inventory fluctuates with each
              outbreak, and recovery takes 5–6 months since replacement flocks
              must be raised from chicks. This biological bottleneck is the
              primary reason egg prices can't recover quickly even when outbreak
              pressures ease.
            </p>

            <h2
              className="font-display text-2xl mt-8"
              style={{ color: "var(--shell)", letterSpacing: "0.04em" }}
            >
              HOW TO SAVE ON EGGS TODAY
            </h2>
            <ul className="space-y-2">
              {[
                "Shop at Aldi first — their Goldhen brand is consistently the lowest-priced conventional egg",
                "Buy in bulk at Costco if you use more than 2 dozen per week — $0.22/egg beats most retailers",
                "Check weekly circulars at Kroger and Walmart — loss-leader egg sales happen regularly",
                "Consider store-brand cage-free over name-brand conventional for a similar price",
                "Freeze excess eggs by cracking into ice cube trays during sales",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    style={{
                      color: "var(--yolk)",
                      fontFamily: "var(--font-mono)",
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all"
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
    </>
  );
}
