// app/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  MapPin,
  TrendingDown,
  Bell,
  Egg,
  Navigation,
} from "lucide-react";
import { useNational, useStores, FALLBACK_TRENDS } from "@/lib/use-eggs-data";

export default function HomePage() {
  const [zip, setZip] = useState("");
  const { national, trends } = useNational();
  const { stores } = useStores();

  const cheapestStore = stores[0] ?? { name: "Aldi", price: 2.18 };

  return (
    <>
      <HeroMap
        zip={zip}
        setZip={setZip}
        national={national}
        cheapestStore={cheapestStore}
      />

      {/* BIG NUMBER STRIP */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {[
            {
              k: "National avg",
              v: `$${national.avg}`,
              sub: `${national.yoy}% YoY`,
            },
            { k: "Stores tracked", v: "12,840", sub: "across 50 states" },
            {
              k: "Cheapest right now",
              v: `$${cheapestStore.price.toFixed(2)}`,
              sub: cheapestStore.name,
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
            What&apos;s inside
          </div>
          <h2 className="mt-3 font-display text-5xl font-black md:text-6xl">
            Everything you&apos;d want to know
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
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card md:p-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-yolk">
                12-month trend
              </div>
              <h3 className="mt-2 font-display text-4xl font-black">
                National avg, dozen Grade A
              </h3>
            </div>
            <Link
              href="/dashboard"
              className="rounded-full border border-yolk px-5 py-2 text-sm font-semibold text-yolk transition-colors hover:bg-yolk hover:text-primary-foreground"
            >
              Open full Yolk Index →
            </Link>
          </div>
          <MiniBars trends={trends.length ? trends : FALLBACK_TRENDS} />
        </div>
      </section>
    </>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  className?: string;
  big?: boolean;
}

function FeatureCard({
  title,
  desc,
  icon: Icon,
  href,
  className = "",
  big = false,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-yolk/60 ${className}`}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yolk/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <Icon className="h-7 w-7 text-yolk" />
      <div
        className={`mt-${big ? "8" : "4"} font-display ${
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

// ─── Mini Bars Chart ──────────────────────────────────────────────────────────

interface TrendPoint {
  m: string;
  price: number;
}

function MiniBars({ trends }: { trends: TrendPoint[] }) {
  const max = Math.max(...trends.map((t) => t.price));

  return (
    <div className="mt-10 flex h-56 items-end gap-2">
      {trends.map((t, i) => {
        const h = (t.price / max) * 100;
        return (
          <div
            key={t.m}
            className="group relative flex flex-1 flex-col items-center justify-end"
          >
            <div className="absolute -top-8 hidden font-mono text-xs text-yolk group-hover:block">
              ${t.price.toFixed(2)}
            </div>
            <div
              className="w-full rounded-t-md bg-yolk-grad transition-all group-hover:opacity-100"
              style={{
                height: `${h}%`,
                opacity: 0.5 + (i / trends.length) * 0.5,
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

// ─── Map Pins Data ────────────────────────────────────────────────────────────

interface Pin {
  x: number;
  y: number;
  store: string;
  price: number;
  miles: number;
  best?: boolean;
}

const PINS: Pin[] = [
  { x: 28, y: 38, store: "Aldi", price: 2.18, miles: 1.2, best: true },
  { x: 52, y: 22, store: "Walmart", price: 2.46, miles: 2.4 },
  { x: 68, y: 48, store: "H-E-B", price: 2.62, miles: 2.9 },
  { x: 42, y: 62, store: "Kroger", price: 2.74, miles: 3.1 },
  { x: 78, y: 70, store: "Target", price: 2.89, miles: 3.6 },
  { x: 18, y: 72, store: "Whole Foods", price: 4.99, miles: 5.2 },
  { x: 60, y: 80, store: "Costco", price: 5.49, miles: 6.4 },
];

// ─── Hero with Map ────────────────────────────────────────────────────────────

interface HeroMapProps {
  zip: string;
  setZip: (s: string) => void;
  national: { avg: string; weekly: string };
  cheapestStore: { name: string; price: number };
}

function HeroMap({ zip, setZip, national, cheapestStore }: HeroMapProps) {
  const router = useRouter();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => (a + 1) % PINS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const activePin = PINS[active];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) {
      router.push(`/finder?zip=${zip}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-hero-grad">
      <div className="absolute inset-0 grain opacity-40" />
      <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-yolk/15 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pt-16 pb-24 lg:grid-cols-[1fr_1.05fr] lg:pt-24">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yolk" />
            live · 12,840 stores tracked
          </div>
          <h1 className="mt-6 font-display text-6xl font-black leading-[0.92] tracking-tight md:text-7xl xl:text-8xl">
            Find the cheapest
            <br />
            dozen <span className="italic text-yolk">on the map.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Drop a zip code. We&apos;ll plot every store within driving distance
            and rank the cartons cheapest first.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-border bg-card p-2 shadow-card"
          >
            <MapPin className="ml-3 h-5 w-5 text-yolk" />
            <input
              value={zip}
              onChange={(e) =>
                setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              placeholder="Enter zip code"
              inputMode="numeric"
              className="flex-1 bg-transparent px-2 font-mono text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="group flex items-center gap-2 rounded-full bg-yolk px-5 py-2.5 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Locate{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            <MiniStat
              k="Nat'l avg"
              v={`$${national.avg}`}
              sub={`${national.weekly}% wk`}
            />
            <MiniStat
              k="Cheapest"
              v={`$${cheapestStore.price.toFixed(2)}`}
              sub={cheapestStore.name}
            />
            <MiniStat k="Saved/yr" v="$184" sub="vs. avg" />
          </div>
        </div>

        {/* RIGHT — map */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
            <div className="absolute inset-0 bg-[oklch(0.16_0.012_80)]" />
            <div className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.85_0.18_85_/_8%),transparent_60%)]" />
            <svg
              className="absolute inset-0 h-full w-full opacity-60"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="streets"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 8 0 L 0 0 0 8"
                    fill="none"
                    stroke="oklch(1 0 0 / 5%)"
                    strokeWidth="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#streets)" />
              <path
                d="M -5 35 Q 30 28 60 50 T 105 70"
                stroke="oklch(0.85 0.18 85 / 25%)"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M 20 -5 Q 30 30 50 55 T 70 105"
                stroke="oklch(0.78 0.21 55 / 18%)"
                strokeWidth="0.6"
                fill="none"
              />
              <path
                d="M -5 78 L 105 78"
                stroke="oklch(1 0 0 / 6%)"
                strokeWidth="0.4"
                fill="none"
              />
            </svg>

            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yolk/20"
                  style={{
                    width: `${i * 130}px`,
                    height: `${i * 130}px`,
                    animation: `yolk-pulse 4s ease-out ${i * 0.6}s infinite`,
                  }}
                />
              ))}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-4 w-4 rounded-full bg-yolk shadow-yolk">
                <div className="absolute inset-0 animate-ping rounded-full bg-yolk/60" />
              </div>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-card/90 px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground backdrop-blur">
                you · {zip || "77024"}
              </div>
            </div>

            {PINS.map((p, i) => {
              const isActive = i === active;
              return (
                <button
                  key={p.store}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="absolute -translate-x-1/2 -translate-y-full"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div
                    className={`relative flex flex-col items-center transition-all ${
                      isActive ? "scale-110" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold shadow-card ${
                        p.best
                          ? "bg-yolk text-primary-foreground"
                          : isActive
                          ? "bg-card text-yolk border border-yolk"
                          : "bg-card/80 text-foreground border border-border"
                      }`}
                    >
                      ${p.price}
                    </div>
                    <div
                      className={`mt-0.5 h-2 w-2 rotate-45 ${
                        p.best
                          ? "bg-yolk"
                          : isActive
                          ? "bg-yolk"
                          : "bg-card border border-border"
                      }`}
                    />
                    {p.best && (
                      <span className="absolute -top-2 -right-2 inline-flex h-3 w-3 rounded-full bg-yolk animate-ping" />
                    )}
                  </div>
                </button>
              );
            })}

            <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80 font-mono text-[10px] backdrop-blur">
              <Navigation className="h-4 w-4 text-yolk" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border bg-card/85 px-3 py-2 font-mono text-[10px] uppercase backdrop-blur">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yolk" /> cheapest
              </span>
              <span className="text-muted-foreground">
                7 stores · 10mi radius
              </span>
              <span className="text-yolk">live</span>
            </div>
          </div>

          <div
            key={active}
            className="absolute -bottom-6 -left-6 w-64 rounded-2xl border border-yolk/40 bg-card p-4 shadow-yolk backdrop-blur md:-left-10"
            style={{ animation: "fade-in 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase text-muted-foreground">
                  {activePin.miles} mi away
                </div>
                <div className="font-display text-xl font-black">
                  {activePin.store}
                </div>
              </div>
              <Egg className="h-6 w-6 text-yolk" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <div className="font-display text-4xl font-black text-yolk">
                ${activePin.price}
              </div>
              <div className="font-mono text-xs text-muted-foreground">/dz</div>
            </div>
          </div>

          <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-border bg-card/90 p-3 font-mono shadow-card backdrop-blur md:block">
            <div className="text-[10px] uppercase text-muted-foreground">
              national avg
            </div>
            <div className="mt-0.5 font-display text-2xl font-black">
              ${national.avg}
            </div>
            <div className="text-[10px] text-yolk">▼ {national.weekly}% wk</div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MiniStatProps {
  k: string;
  v: string;
  sub: string;
}
function MiniStat({ k, v, sub }: MiniStatProps) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3 backdrop-blur">
      <div className="font-mono text-[10px] uppercase text-muted-foreground">
        {k}
      </div>
      <div className="mt-1 font-display text-xl font-black leading-none">
        {v}
      </div>
      <div className="mt-1 font-mono text-[10px] text-yolk">{sub}</div>
    </div>
  );
}
