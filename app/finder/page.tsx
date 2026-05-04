// app/finder/page.tsx
"use client";

import { useState } from "react";
import { MapPin, Navigation, Egg } from "lucide-react";
import { useNearby } from "@/lib/use-eggs-data";

export default function Finder() {
  const [zip, setZip] = useState("77024");
  const [submitted, setSubmitted] = useState(false);
  const [activeZip, setActiveZip] = useState("");
  const [maxPrice, setMaxPrice] = useState(10);

  const { nearby, loading } = useNearby(activeZip);
  const list = nearby
    .filter((n) => n.price <= maxPrice)
    .sort((a, b) => a.price - b.price);
  const cheapest = list[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) {
      setActiveZip(zip);
      setSubmitted(true);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-hero-grad">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="font-mono text-xs uppercase tracking-widest text-yolk">
            Step 1 — drop a zip
          </div>
          <h1 className="mt-3 font-display text-6xl font-black md:text-7xl">
            Find your <span className="italic text-yolk">cheapest</span> dozen.
          </h1>

          <form
            onSubmit={handleSearch}
            className="mt-10 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card p-2 shadow-card"
          >
            <MapPin className="ml-3 h-5 w-5 text-yolk" />
            <input
              value={zip}
              onChange={(e) =>
                setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              placeholder="ZIP code"
              className="flex-1 bg-transparent px-2 font-mono text-base outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-yolk px-6 py-2.5 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Search
            </button>
          </form>

          <div className="mt-8 max-w-xl">
            <label className="flex items-center justify-between font-mono text-xs uppercase text-muted-foreground">
              <span>Max price per dozen</span>
              <span className="font-display text-lg font-black text-yolk">
                ${maxPrice.toFixed(2)}
              </span>
            </label>
            <input
              type="range"
              min="2"
              max="10"
              step="0.25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="mt-2 w-full accent-[oklch(0.85_0.18_85)]"
            />
          </div>
        </div>
      </section>

      {submitted && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          {loading ? (
            <div className="flex items-center justify-center py-20 font-mono text-sm text-muted-foreground animate-pulse">
              Searching Kroger API for stores near {activeZip}…
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                {cheapest && (
                  <div className="relative overflow-hidden rounded-3xl border border-yolk/40 bg-card p-8 shadow-yolk">
                    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-yolk/30 blur-2xl" />
                    <div className="font-mono text-xs uppercase tracking-widest text-yolk">
                      Winner near {activeZip}
                    </div>
                    <div className="mt-4 font-display text-3xl font-black">
                      {cheapest.store}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {cheapest.addr} · {cheapest.miles} mi
                    </div>
                    <div className="mt-6 flex items-baseline gap-2">
                      <div className="font-display text-7xl font-black text-yolk">
                        ${cheapest.price.toFixed(2)}
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        / dozen
                      </div>
                    </div>
                    <div className="mt-2 text-sm">{cheapest.type}</div>
                    <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-yolk px-5 py-2.5 font-semibold text-primary-foreground">
                      <Navigation className="h-4 w-4" /> Directions
                    </button>
                  </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  <div className="border-b border-border bg-secondary/40 px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {list.length} stores within 10 miles
                  </div>
                  <ul className="divide-y divide-border">
                    {list.map((s, i) => (
                      <li
                        key={s.store + s.addr}
                        className="group flex items-center gap-6 px-6 py-5 transition-colors hover:bg-secondary/40"
                      >
                        <div className="w-8 font-display text-2xl font-black text-muted-foreground">
                          {i + 1}
                        </div>
                        <Egg className="h-6 w-6 text-yolk" />
                        <div className="flex-1">
                          <div className="font-display text-xl font-bold">
                            {s.store}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {s.addr} · {s.miles} mi · {s.type}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-2xl font-black">
                            ${s.price.toFixed(2)}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            per dz
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
                Kroger-family store locations and prices fetched live from{" "}
                <code className="rounded bg-secondary px-1 font-mono text-xs">
                  api.kroger.com/v1
                </code>
                . Non-Kroger prices (Aldi, Walmart, Target, Costco) use scraped
                estimates with same-day freshness.
              </p>
            </>
          )}
        </section>
      )}
    </>
  );
}
