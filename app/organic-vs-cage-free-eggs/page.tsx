import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = buildMetadata({
  title:
    "Organic vs Cage-Free Eggs — Price & Nutrition Comparison 2025 | EGGS.BOT",
  description:
    "Organic vs cage-free eggs: what's the real difference? Price comparison, nutrition facts, animal welfare standards, and which to buy in 2025.",
  path: "/organic-vs-cage-free-eggs",
  keywords: [
    "organic vs cage-free eggs",
    "cage-free vs free-range",
    "pasture raised eggs",
    "egg types comparison",
    "organic eggs worth it",
  ],
});

export default function OrganicVsCageFree() {
  const eggTypes = [
    {
      type: "Conventional",
      emoji: "🥚",
      price: "$2.50–$3.50",
      perEgg: "$0.21–$0.29",
      space: "67 sq in/hen",
      outdoor: "No",
      organic: "No",
      welfare: "★☆☆☆☆",
      nutrition: "0",
      summary:
        "Standard battery-cage eggs. Hens in ~67 sq inches each — less than a sheet of paper.",
    },
    {
      type: "Cage-Free",
      emoji: "🐓",
      price: "$3.50–$5.00",
      perEgg: "$0.29–$0.42",
      space: "1 sq ft/hen",
      outdoor: "No",
      organic: "No",
      welfare: "★★☆☆☆",
      nutrition: "+5%",
      summary:
        "No cages, but still indoors in large barns. More movement, but crowded conditions persist.",
    },
    {
      type: "Free-Range",
      emoji: "🌾",
      price: "$4.00–$5.50",
      perEgg: "$0.33–$0.46",
      space: "2 sq ft/hen + outdoor",
      outdoor: "Required",
      organic: "No",
      welfare: "★★★☆☆",
      nutrition: "+10%",
      summary:
        '"Outdoor access" required but door size and duration aren\'t specified. Quality varies widely.',
    },
    {
      type: "Organic",
      emoji: "🌿",
      price: "$5.00–$7.00",
      perEgg: "$0.42–$0.58",
      space: "2 sq ft/hen + outdoor",
      outdoor: "Required",
      organic: "Yes (USDA)",
      welfare: "★★★☆☆",
      nutrition: "+10%",
      summary:
        "USDA certified organic feed, no antibiotics. Same space as free-range but with organic certification.",
    },
    {
      type: "Pasture-Raised",
      emoji: "🌻",
      price: "$6.00–$9.00",
      perEgg: "$0.50–$0.75",
      space: "108 sq ft/hen",
      outdoor: "Required (most)",
      organic: "Varies",
      welfare: "★★★★★",
      nutrition: "+20%",
      summary:
        "Best welfare and nutrition. Hens with true outdoor access forage naturally. Most expensive.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--carton)" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div>
          <h1
            className="font-display text-5xl md:text-6xl mb-3"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            ORGANIC VS CAGE-FREE EGGS
          </h1>
          <p className="text-lg" style={{ color: "rgba(253,246,227,0.65)" }}>
            Every egg label explained — what you actually get for the price
            premium.
          </p>
        </div>

        {/* Comparison cards */}
        <div className="grid gap-4">
          {eggTypes.map((e, i) => (
            <div
              key={e.type}
              className="card-dark rounded-2xl p-5"
              style={{
                borderColor:
                  i === 4 ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.15)",
              }}
            >
              <div className="flex flex-wrap gap-6">
                <div className="flex-shrink-0">
                  <div className="text-4xl mb-1">{e.emoji}</div>
                  <div
                    className="font-display text-xl"
                    style={{ color: "var(--yolk)", letterSpacing: "0.04em" }}
                  >
                    {e.type}
                  </div>
                  <div
                    className="font-mono text-lg mt-1"
                    style={{
                      color: "var(--shell)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {e.price}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: "rgba(253,246,227,0.4)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {e.perEgg}/egg
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm mb-4"
                    style={{ color: "rgba(253,246,227,0.65)" }}
                  >
                    {e.summary}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Space", val: e.space },
                      { label: "Outdoor", val: e.outdoor },
                      { label: "Organic", val: e.organic },
                      { label: "Welfare", val: e.welfare },
                    ].map((f) => (
                      <div key={f.label}>
                        <div
                          className="text-xs uppercase tracking-wider mb-0.5"
                          style={{
                            color: "rgba(253,246,227,0.35)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {f.label}
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            color:
                              f.val === "Yes" || f.val === "Required"
                                ? "#22c55e"
                                : f.val === "No"
                                ? "rgba(253,246,227,0.4)"
                                : "var(--shell)",
                          }}
                        >
                          {f.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-4"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            THE VERDICT
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              {
                q: "Budget",
                rec: "Aldi conventional",
                reason:
                  "Goldhen large dozen — identical nutrition to premium brands at 1/3 the price.",
              },
              {
                q: "Health-conscious",
                rec: "Cage-free or free-range",
                reason:
                  "Slight omega-3 boost, no meaningful nutrition difference vs conventional.",
              },
              {
                q: "Animal welfare",
                rec: "Pasture-raised",
                reason:
                  "108 sq ft/hen standard (Vital Farms, Handsome Brook) is the only label with meaningful welfare.",
              },
            ].map((v) => (
              <div
                key={v.q}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(26,18,8,0.6)",
                  border: "1px solid rgba(245,158,11,0.1)",
                }}
              >
                <div
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{
                    color: "rgba(253,246,227,0.4)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  If you care about
                </div>
                <div
                  className="font-medium mb-0.5"
                  style={{ color: "var(--yolk)" }}
                >
                  {v.q}
                </div>
                <div className="font-medium mb-2">{v.rec}</div>
                <div style={{ color: "rgba(253,246,227,0.5)" }}>{v.reason}</div>
              </div>
            ))}
          </div>
        </div>

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
            🥚 Compare egg prices near you →
          </Link>
        </div>
      </main>
    </div>
  );
}
