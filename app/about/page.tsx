// app/about/page.tsx

import { Layout } from "@/components/Layout";

export default function About() {
  return (
    <>
      <section className="border-b border-border bg-hero-grad">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="font-mono text-xs uppercase tracking-widest text-yolk">
            A short essay
          </div>
          <h1 className="mt-3 font-display text-6xl font-black md:text-7xl">
            Why a whole website about{" "}
            <span className="italic text-yolk">eggs</span>?
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-8 px-6 py-20 text-lg leading-relaxed text-muted-foreground">
        <p>
          In the last three years the price of a dozen eggs has roughly doubled,
          halved, doubled again, and become — somehow — a political football.
          Meanwhile, the actual cheapest carton near you can sit in a freezer
          aisle 1.3 miles away, untouched, while you pay $2 more across town.
        </p>
        <p className="font-display text-2xl font-bold text-foreground">
          EGGS.BOT is a small public utility for fixing that.
        </p>
        <p>
          We pull the BLS Consumer Price Index series for eggs, the USDA
          Agricultural Marketing Service shell-egg wholesale reports, the Kroger
          Public API for in-store pricing, and a handful of polite scrapers for
          stores that don't expose feeds (Aldi, Costco, Target, Instacart). Then
          we line it all up next to your zip code.
        </p>
        <p>
          No login. No app to install. No "premium" tier hiding the answer
          behind a wall.
        </p>

        <div className="grid gap-6 pt-10 md:grid-cols-3">
          {(
            [
              ["Kroger API", "Live SKU pricing"],
              ["BLS CPI v2", "Historical national avg"],
              ["USDA AMS", "Wholesale shell-egg"],
              ["Walmart (RapidAPI)", "Local store pricing"],
              ["Instacart scrape", "Aldi · Target stock"],
              ["Costco scrape", "Bulk warehouse pricing"],
            ] as const
          ).map(([t, d]) => (
            <div
              key={t}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="font-display text-xl font-black text-foreground">
                {t}
              </div>
              <div className="mt-1 font-mono text-xs text-muted-foreground">
                {d}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
