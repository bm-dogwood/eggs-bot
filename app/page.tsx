// app/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { NATIONAL, STORES, TRENDS } from "@/lib/eggs-data";
import { ArrowRight, MapPin, TrendingDown, Bell, Egg } from "lucide-react";

export default function Home() {
  return (
    <>
      <HeroTerminal />

      {/* BIG NUMBER STRIP */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {[
            {
              k: "National avg",
              v: `$${NATIONAL.avg}`,
              sub: `${NATIONAL.yoy}% YoY`,
            },
            { k: "Stores tracked", v: "12,840", sub: "across 50 states" },
            {
              k: "Cheapest right now",
              v: `$${STORES[0].price}`,
              sub: STORES[0].name,
            },
            { k: "Carton volatility", v: "± 38¢", sub: "30-day range" },
          ].map((s) => (
            <div key={s.k} className="bg-background px-6 py-10">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {s.k}
              </div>
              <div className="mt-2 font-display text-5xl font-black tracking-tight">
                {s.v}
              </div>
              <div className="mt-1 text-sm text-yolk">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — bento */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-yolk">
            What's inside
          </div>
          <h2 className="mt-3 font-display text-5xl font-black md:text-6xl">
            Everything you'd want to know
            <br />
            before paying for a carton.
          </h2>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-4">
          <FeatureCard
            className="md:col-span-2 md:row-span-2"
            title="Zip code → cheapest eggs nearby"
            desc="Type 5 digits. Get a live ranked list of stores within 10 miles."
            icon={MapPin}
            href="/finder"
            big
          />
          <FeatureCard
            className="md:col-span-2"
            title="Walmart · Kroger · Aldi · Costco · Target"
            desc="Side-by-side carton comparison."
            icon={Egg}
            href="/dashboard"
          />
          <FeatureCard
            title="Trend chart"
            desc="Weekly + monthly history"
            icon={TrendingDown}
            href="/dashboard"
          />
          <FeatureCard
            title="National avg tracker"
            desc="USDA + BLS data"
            icon={TrendingDown}
            href="/dashboard"
          />
          <FeatureCard
            className="md:col-span-2"
            title="Filter by egg type"
            desc="Organic · cage-free · pasture-raised · free-range"
            icon={Egg}
            href="/types"
          />
          <FeatureCard
            className="md:col-span-2"
            title="Alert: 'Eggs under $X near you'"
            desc="Set a price ceiling. We'll text you the moment a store crosses it."
            icon={Bell}
            href="/alerts"
          />
        </div>
      </section>

      {/* MINI CHART */}
    </>
  );
}

function FeatureCard({
  title,
  desc,
  icon: Icon,
  href,
  className = "",
  big = false,
}: any) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-yolk/60 ${className}`}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yolk/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <Icon className="h-7 w-7 text-yolk" />
      <div
        className={`mt-${big ? 8 : 4} font-display ${
          big ? "text-4xl" : "text-2xl"
        } font-black leading-tight`}
      >
        {title}
      </div>
      <div className="mt-2 max-w-md text-sm text-muted-foreground">{desc}</div>
      <div className="absolute bottom-5 right-6 font-mono text-xs text-muted-foreground transition-colors group-hover:text-yolk">
        open →
      </div>
    </Link>
  );
}

function MiniBars() {
  const max = Math.max(...TRENDS.map((t) => t.price));
  return (
    <div className="mt-10 flex h-56 items-end gap-2">
      {TRENDS.map((t, i) => {
        const h = (t.price / max) * 100;
        return (
          <div
            key={t.m}
            className="group relative flex flex-1 flex-col items-center justify-end"
          >
            <div className="absolute -top-8 hidden font-mono text-xs text-yolk group-hover:block">
              ${t.price}
            </div>
            <div
              className="w-full rounded-t-md bg-yolk-grad transition-all group-hover:opacity-100"
              style={{
                height: `${h}%`,
                opacity: 0.5 + (i / TRENDS.length) * 0.5,
              }}
            />
            <div className="mt-2 font-mono text-xs text-muted-foreground">
              {t.m}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const RECENT = [
  { zip: "60601", city: "CHI", price: 5.42, type: "JUMBO" },
  { zip: "90210", city: "LAX", price: 8.9, type: "PASTURE" },
  { zip: "33101", city: "MIA", price: 4.18, type: "STANDARD" },
  { zip: "10013", city: "NYC", price: 6.4, type: "ORGANIC" },
];

function HeroTerminal() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [time, setTime] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "America/New_York",
        })
      );
    };
    update();
    const t = setInterval(() => {
      update();
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/finder?zip=${zip || "10013"}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full bg-yolk/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 grain opacity-40" />

      {/* terminal header strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/60 px-6 py-3 font-mono text-[11px] uppercase tracking-widest backdrop-blur">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 font-bold text-yolk">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yolk" />
            EGGS.BOT // SECURE LINK
          </span>
          <span className="hidden text-muted-foreground md:inline">
            TERMINAL ID: 489-A
          </span>
        </div>
        <div className="flex items-center gap-6 text-muted-foreground">
          <span>
            IDX: 142.8 <span className="text-yolk">+0.04</span>
          </span>
          <span className="hidden sm:inline">VOL: 28,491</span>
          <span>SYS.TIME: {time} EST</span>
        </div>
      </div>

      {/* main grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT editorial */}
        <div className="flex flex-col justify-center border-border px-8 py-20 lg:col-span-7 lg:border-r lg:px-16 lg:py-28">
          <p className="mb-8 flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground before:h-px before:w-10 before:bg-yolk before:content-['']">
            The Global Standard
          </p>

          <h1 className="font-display text-[4.5rem] font-light leading-[0.85] tracking-tighter md:text-[6rem] xl:text-[7.5rem]">
            The price of
            <br />
            <em className="font-light italic text-yolk">monopoly.</em>
          </h1>

          <p className="mt-10 max-w-[45ch] text-lg font-light leading-snug text-muted-foreground md:text-xl">
            Track the absolute valuation of Grade A reserves. Proprietary
            intelligence for institutional poultry commodities — by zip code, in
            real time.
          </p>

          {/* market sentiment */}
          <div className="mt-14 grid max-w-lg grid-cols-2 gap-4 font-mono">
            <div className="border border-border bg-card/50 p-4 backdrop-blur">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Global Supply Index
              </div>
              <div className="mt-2 font-display text-2xl font-black text-foreground">
                RESTRICTED
              </div>
            </div>
            <div className="border border-border bg-card/50 p-4 backdrop-blur">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Yolk Reserve Tier
              </div>
              <div className="mt-2 font-display text-2xl font-black text-yolk">
                CLASS S
              </div>
            </div>
            <div className="border border-border bg-card/50 p-4 backdrop-blur">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                National Avg / Dz
              </div>
              <div className="mt-2 font-display text-2xl font-black text-foreground">
                ${NATIONAL.avg}
              </div>
            </div>
            <div className="border border-border bg-card/50 p-4 backdrop-blur">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Carton Volatility
              </div>
              <div className="mt-2 font-display text-2xl font-black text-yolk">
                ± 38¢
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT terminal query */}
        <div className="relative flex flex-col justify-center bg-card/40 px-8 py-20 lg:col-span-5 lg:px-14 lg:py-28">
          <div className="mb-8 border-b border-border pb-5">
            <h2 className="font-display text-3xl font-light text-foreground">
              Local Exchange Query
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Access localized pricing differentials by postal routing code.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="group relative space-y-6 font-mono"
          >
            <div className="pointer-events-none absolute -inset-4 border border-yolk/0 transition-colors duration-500 group-focus-within:border-yolk/30" />

            <div>
              <label
                htmlFor="zip"
                className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-yolk"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yolk" />
                ENTER ZIP CODE [US]
              </label>
              <div className="flex items-end">
                <span className="mr-3 pb-2 text-2xl text-muted-foreground">
                  &gt;
                </span>
                <input
                  id="zip"
                  value={zip}
                  onChange={(e) =>
                    setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                  placeholder="_ _ _ _ _"
                  inputMode="numeric"
                  className="w-full border-0 border-b-2 border-border bg-transparent px-0 pb-2 font-mono text-4xl tracking-[0.25em] text-foreground placeholder:text-muted/40 outline-none transition-colors focus:border-yolk"
                />
              </div>
            </div>

            <button className="mt-2 flex w-full items-center justify-between bg-yolk px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110">
              <span>Authenticate &amp; Retrieve</span>
              <span className="flex items-center gap-2 font-mono">
                [ENT] <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </form>

          {/* recent intercepts */}
          <div className="mt-14 border-t border-border pt-6 font-mono">
            <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>RECENT INTERCEPTS</span>
              <span className="text-yolk">LIVE · {tick}</span>
            </div>
            <ul className="space-y-3 text-sm">
              {RECENT.map((r, i) => (
                <li
                  key={r.zip}
                  className={`flex items-baseline justify-between transition-opacity ${
                    i === 3 ? "opacity-50" : ""
                  }`}
                >
                  <span className="text-muted-foreground">
                    {r.zip} <span className="text-yolk/70">[{r.city}]</span>
                  </span>
                  <span className="text-foreground">
                    ${r.price.toFixed(2)}{" "}
                    <span className="text-border">······</span> {r.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* bottom thread */}
      <div className="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-yolk/40 to-transparent" />
    </section>
  );
}
