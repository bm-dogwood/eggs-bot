// app/dashboard/page.tsx
"use client";

import { useNational, useStores } from "@/lib/use-eggs-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const { national, trends, loading: blsLoading } = useNational();
  const { stores, loading: storesLoading } = useStores();

  const loading = blsLoading || storesLoading;

  return (
    <>
      <section className="border-b border-border bg-hero-grad">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="font-mono text-xs uppercase tracking-widest text-yolk">
            Live · the yolk index
          </div>
          <h1 className="mt-3 font-display text-6xl font-black md:text-7xl">
            A dashboard for <span className="italic text-yolk">eggs.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            National averages from BLS CPI series APU0000708111, weekly USDA AMS
            shell-egg reports, and live store scrapes — folded into one screen.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Big stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              k: "National avg",
              v: loading ? "—" : `$${national.avg}`,
              sub: loading ? "loading..." : `${national.weekly}% w/w`,
            },
            {
              k: "YoY change",
              v: loading ? "—" : `${national.yoy}%`,
              sub: "vs. year ago",
            },
            {
              k: "Cheapest state",
              v: loading ? "—" : national.cheapestState,
              sub: loading ? "" : `$${national.cheapestPrice}`,
            },
            {
              k: "Costliest state",
              v: loading ? "—" : national.costliestState,
              sub: loading ? "" : `$${national.costliestPrice}`,
            },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {s.k}
              </div>
              <div
                className={`mt-2 font-display text-4xl font-black ${
                  loading ? "animate-pulse text-muted-foreground" : ""
                }`}
              >
                {s.v}
              </div>
              <div className="mt-1 text-sm text-yolk">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-card">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-yolk">
                12-month trend
              </div>
              <h2 className="mt-1 font-display text-3xl font-black">
                National average, dozen Grade A large
              </h2>
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Source: BLS CPI APU0000708111
            </div>
          </div>
          <div className="mt-8 h-80">
            {blsLoading ? (
              <div className="flex h-full items-center justify-center font-mono text-sm text-muted-foreground animate-pulse">
                Fetching BLS data…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <defs>
                    <linearGradient id="yolk" x1="0" x2="1">
                      <stop offset="0%" stopColor="oklch(0.85 0.18 85)" />
                      <stop offset="100%" stopColor="oklch(0.78 0.21 55)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                  <XAxis
                    dataKey="m"
                    stroke="oklch(0.7 0.02 85)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="oklch(0.7 0.02 85)"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.18 0.012 80)",
                      border: "1px solid oklch(0.28 0.02 80)",
                      borderRadius: 12,
                    }}
                    labelStyle={{ color: "oklch(0.85 0.18 85)" }}
                    formatter={(v: unknown) =>
                      typeof v === "number"
                        ? [`$${v.toFixed(2)}`, "Price"]
                        : ["N/A", "Price"]
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="url(#yolk)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "oklch(0.85 0.18 85)" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Store comparison */}
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <div className="font-mono text-xs uppercase tracking-widest text-yolk">
              Store comparison
            </div>
            <h2 className="mt-1 font-display text-3xl font-black">
              Cheapest dozen, by retailer
            </h2>
            <div className="mt-6 h-72">
              {storesLoading ? (
                <div className="flex h-full items-center justify-center font-mono text-sm text-muted-foreground animate-pulse">
                  Fetching store prices…
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stores}>
                    <CartesianGrid
                      stroke="oklch(1 0 0 / 6%)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="oklch(0.7 0.02 85)"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="oklch(0.7 0.02 85)"
                      fontSize={12}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.18 0.012 80)",
                        border: "1px solid oklch(0.28 0.02 80)",
                        borderRadius: 12,
                      }}
                      formatter={(v: unknown) =>
                        typeof v === "number"
                          ? [`$${v.toFixed(2)}`, "Price"]
                          : ["N/A", "Price"]
                      }
                    />
                    <Bar
                      dataKey="price"
                      fill="oklch(0.85 0.18 85)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <div className="font-mono text-xs uppercase tracking-widest text-yolk">
              Leaderboard
            </div>
            <ul className="mt-4 divide-y divide-border">
              {stores.map((s, i) => (
                <li key={s.name} className="flex items-center gap-4 py-4">
                  <div className="w-6 font-display text-xl font-black text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-lg font-bold">
                      {s.name}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {s.note ?? "Large white, dz"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-black">
                      ${s.price.toFixed(2)}
                    </div>
                    <div
                      className={`font-mono text-xs ${
                        s.change < 0 ? "text-yolk" : "text-destructive"
                      }`}
                    >
                      {s.change < 0 ? "▼" : "▲"} $
                      {Math.abs(s.change).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[10px] text-muted-foreground">
              Prices fetched live from Walmart, Kroger API, Target Redsky, Aldi,
              and Costco. Changes are week-over-week estimates.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
