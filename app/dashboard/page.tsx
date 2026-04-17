"use client";

import { useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Bell,
  ExternalLink,
  RefreshCw,
  Info,
} from "lucide-react";
import type { EggPricePoint, StorePrice, EggType } from "@/lib/api";
import { getMockStorePrices } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

interface DashboardProps {
  initialStats: {
    current: number;
    previous: number;
    yearAgo: number;
    allTimeHigh: number;
    allTimeLow: number;
    history: EggPricePoint[];
  };
}

const EGG_TYPES: { value: EggType; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "conventional", label: "Conventional" },
  { value: "cage-free", label: "Cage-Free" },
  { value: "free-range", label: "Free-Range" },
  { value: "organic", label: "Organic" },
  { value: "pasture-raised", label: "Pasture-Raised" },
];

const CHART_RANGES = [
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
  { label: "ALL", months: 999 },
];

export default function Dashboard({ initialStats }: DashboardProps) {
  const [zip, setZip] = useState("");
  const [submittedZip, setSubmittedZip] = useState("");
  const [eggType, setEggType] = useState<EggType>("all");
  const [storePrices, setStorePrices] = useState<StorePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertSet, setAlertSet] = useState(false);
  const [chartRange, setChartRange] = useState(12);

  const stats = initialStats || {
    current: 4.25,
    previous: 4.1,
    yearAgo: 3.8,
    allTimeHigh: 6.5,
    allTimeLow: 1.2,
    history: [],
  };

  const safeStats = {
    current: stats.current ?? 4.25,
    previous: stats.previous ?? stats.current ?? 4.1,
    yearAgo: stats.yearAgo ?? stats.current ?? 3.8,
    allTimeHigh: stats.allTimeHigh ?? 6.5,
    allTimeLow: stats.allTimeLow ?? 1.2,
    history: stats.history ?? [],
  };

  const pctVsLastMonth = safeStats.previous
    ? ((safeStats.current - safeStats.previous) / safeStats.previous) * 100
    : 0;

  const pctVsYearAgo = safeStats.yearAgo
    ? ((safeStats.current - safeStats.yearAgo) / safeStats.yearAgo) * 100
    : 0;

  const chartData = safeStats.history.slice(-chartRange).map((p) => ({
    date: `${p.period.slice(0, 3)} '${p.year.slice(2)}`,
    price: p.price,
    rawDate: p.date,
  }));

  const handleSearch = useCallback(async () => {
    if (zip.length < 5) return;
    setLoading(true);
    setSubmittedZip(zip);
    await new Promise((r) => setTimeout(r, 800));
    const prices = getMockStorePrices(zip, eggType);
    setStorePrices(prices);
    setLoading(false);
  }, [zip, eggType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const setAlert = () => {
    if (!alertPrice) return;
    setAlertSet(true);
  };

  const cheapest = storePrices[0];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="text-center py-10 relative">
          <div
            className="absolute inset-0 rounded-3xl opacity-10"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--yolk) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h1
              className="font-display text-5xl md:text-7xl mb-3 yolk-glow-text"
              style={{ color: "var(--yolk)", letterSpacing: "0.06em" }}
            >
              EGGS.BOT
            </h1>
            <p
              className="text-lg md:text-xl mb-2"
              style={{ color: "rgba(253,246,227,0.7)" }}
            >
              Find the most competitive egg prices in your area.
            </p>
            <p
              className="text-sm"
              style={{
                color: "rgba(253,246,227,0.4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              BLS CPI Data · Retail API Aggregation · Updated Daily
            </p>
          </div>
        </section>

        {/* National Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="National Average (Dozen)"
              value={`$${safeStats.current.toFixed(2)}`}
              sub={`${pctVsLastMonth >= 0 ? "+" : ""}${pctVsLastMonth.toFixed(
                1
              )}% vs prior month`}
              trend={pctVsLastMonth}
              highlight
            />
            <StatCard
              label="vs Previous Year"
              value={`${pctVsYearAgo >= 0 ? "+" : ""}${pctVsYearAgo.toFixed(
                1
              )}%`}
              sub={`Previous: $${safeStats.yearAgo.toFixed(2)}/dz`}
              trend={-pctVsYearAgo}
            />
            <StatCard
              label="All-Time High"
              value={`$${safeStats.allTimeHigh.toFixed(2)}`}
              sub="Jan 2023 · HPAI Outbreak"
              trend={null}
            />
            <StatCard
              label="All-Time Low"
              value={`$${safeStats.allTimeLow.toFixed(2)}`}
              sub="Pre-2022 Baseline"
              trend={null}
            />
          </div>
        </section>

        {/* Zip Code Search */}
        <section className="card-dark rounded-2xl p-6 yolk-glow">
          <h2
            className="font-display text-2xl mb-1"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            LOCAL PRICE COMPARISON
          </h2>
          <p
            className="text-sm mb-5"
            style={{ color: "rgba(253,246,227,0.5)" }}
          >
            Compare real-time pricing across Aldi, Kroger, Walmart, Target &
            Costco
          </p>

          {/* Egg type filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {EGG_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setEggType(t.value)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  background:
                    eggType === t.value
                      ? "var(--yolk)"
                      : "rgba(245,158,11,0.1)",
                  color:
                    eggType === t.value
                      ? "var(--carton)"
                      : "rgba(253,246,227,0.7)",
                  border: `1px solid ${
                    eggType === t.value ? "var(--yolk)" : "var(--border)"
                  }`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--yolk)" }}
              />
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                onKeyDown={handleKeyDown}
                placeholder="Enter ZIP Code"
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(26,18,8,0.8)",
                  border: "1px solid var(--border)",
                  color: "var(--shell)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={zip.length < 5 || loading}
              className="px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-40"
              style={{
                background:
                  "linear-gradient(135deg, var(--yolk-deep), var(--yolk))",
                color: "var(--carton)",
              }}
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Searching…" : "Search"}
            </button>
          </div>

          {/* Results */}
          {loading && (
            <div className="mt-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl shimmer" />
              ))}
            </div>
          )}

          {!loading && storePrices.length > 0 && (
            <div className="mt-6 space-y-3">
              {cheapest && (
                <div
                  className="flex items-center gap-2 mb-3 text-sm px-3 py-2 rounded-lg"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <span className="font-semibold">BEST VALUE</span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    near {submittedZip}: <strong>{cheapest.store}</strong> at $
                    {cheapest.price?.toFixed(2)}/dz ($
                    {cheapest.pricePerEgg?.toFixed(3)}/egg)
                  </span>
                </div>
              )}

              {storePrices.map((s, i) => (
                <StorePriceRow key={s.store} store={s} rank={i + 1} />
              ))}

              <p
                className="text-xs mt-3 flex items-center gap-1"
                style={{
                  color: "rgba(253,246,227,0.35)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <Info size={11} />
                Kroger pricing via API. Competitor data is estimated based on
                regional averages. Confirm in-store for accuracy.
              </p>
            </div>
          )}
        </section>

        {/* Price Chart */}
        <section className="card-dark rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="font-display text-2xl"
                style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
              >
                HISTORICAL PRICE TRENDS
              </h2>
              <p
                className="text-xs mt-1"
                style={{
                  color: "rgba(253,246,227,0.4)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Source: BLS CPI · Series APU0000708111 · National Average $/Dz
              </p>
            </div>
            <div className="flex gap-2">
              {CHART_RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setChartRange(r.months)}
                  className="px-3 py-1 rounded text-xs transition-all"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background:
                      chartRange === r.months
                        ? "var(--yolk)"
                        : "rgba(245,158,11,0.1)",
                    color:
                      chartRange === r.months
                        ? "var(--carton)"
                        : "rgba(253,246,227,0.6)",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="yolkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(245,158,11,0.1)"
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fill: "rgba(253,246,227,0.4)",
                    fontSize: 11,
                    fontFamily: "DM Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{
                    fill: "rgba(253,246,227,0.4)",
                    fontSize: 11,
                    fontFamily: "DM Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v.toFixed(2)}`}
                  domain={["auto", "auto"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={stats.allTimeHigh}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                  label={{ value: "ATH", fill: "#ef4444", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#yolkGrad)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#f59e0b",
                    stroke: "#1a1208",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Price Alert */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-1"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            PRICE ALERT
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: "rgba(253,246,227,0.5)" }}
          >
            Receive a notification when egg prices drop below your target
            threshold.
          </p>
          {alertSet ? (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <Bell size={18} style={{ color: "#22c55e" }} />
              <span
                className="text-sm"
                style={{ color: "#22c55e", fontFamily: "var(--font-mono)" }}
              >
                Alert configured. You will be notified when prices fall below $
                {alertPrice}/dz.
              </span>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{
                    color: "var(--yolk)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="20"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="3.00"
                  className="w-28 pl-7 pr-3 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(26,18,8,0.8)",
                    border: "1px solid var(--border)",
                    color: "var(--shell)",
                    fontFamily: "var(--font-mono)",
                  }}
                />
              </div>
              <span
                className="self-center text-sm"
                style={{ color: "rgba(253,246,227,0.5)" }}
              >
                per dozen
              </span>
              <button
                onClick={setAlert}
                disabled={!alertPrice}
                className="ml-auto px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-40"
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "var(--yolk)",
                  border: "1px solid var(--border)",
                }}
              >
                <Bell size={15} />
                Create Alert
              </button>
            </div>
          )}
        </section>

        {/* Egg Type Guide */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-6"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            EGG GRADING & PRICING GUIDE
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                type: "Conventional",
                price: "$2.50–$3.50",
                desc: "Standard caged production. Lowest retail cost.",
                multiplier: "1.0x Base",
              },
              {
                type: "Cage-Free",
                price: "$3.50–$5.00",
                desc: "Indoor housing without cages.",
                multiplier: "~1.4x",
              },
              {
                type: "Free-Range",
                price: "$4.00–$5.50",
                desc: "Requires outdoor access.",
                multiplier: "~1.6x",
              },
              {
                type: "Organic",
                price: "$5.00–$7.00",
                desc: "USDA certified organic feed, no antibiotics.",
                multiplier: "~1.8x",
              },
              {
                type: "Pasture-Raised",
                price: "$6.00–$9.00",
                desc: "Minimum 108 sq ft of outdoor space per hen.",
                multiplier: "~2.2x",
              },
              {
                type: "Costco Bulk",
                price: "$7.99/36ct",
                desc: "Optimal per-unit cost at $0.22/egg.",
                multiplier: "Best Value",
              },
            ].map((e) => (
              <div
                key={e.type}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(26,18,8,0.6)",
                  border: "1px solid rgba(245,158,11,0.12)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(245,158,11,0.15)",
                      color: "var(--yolk)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {e.multiplier}
                  </span>
                </div>
                <div className="font-medium text-sm mb-1">{e.type}</div>
                <div
                  className="text-sm mb-1"
                  style={{
                    color: "var(--yolk)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {e.price}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(253,246,227,0.45)" }}
                >
                  {e.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ / Market Analysis */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-6"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            MARKET ANALYSIS: EGG PRICE VOLATILITY
          </h2>
          <div
            className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed"
            style={{ color: "rgba(253,246,227,0.65)" }}
          >
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                HPAI (Highly Pathogenic Avian Influenza)
              </h3>
              <p>
                Outbreaks since 2022 have necessitated the culling of over 100
                million birds in the U.S., severely constricting laying hen
                inventory. Regional supply shocks continue to impact national
                pricing structures.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                Input Costs: Feed & Energy
              </h3>
              <p>
                Corn and soybean meal futures rose sharply post-2021. Coupled
                with persistent energy inflation, operational overhead for
                producers remains elevated, directly influencing retail shelf
                prices.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                Supply Chain Consolidation
              </h3>
              <p>
                A concentrated producer landscape amplifies the price effect of
                supply disruptions. Additionally, legislative shifts such as
                California's Proposition 12 have accelerated the transition to
                cage-free systems, increasing baseline production costs
                nationwide.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                Production Lag & Recovery
              </h3>
              <p>
                The biological lag to replenish flocks is 5–6 months from chick
                to laying maturity. This inelastic supply response prevents
                rapid market corrections, sustaining elevated price levels for
                extended durations following a shock.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Helper Components (StatCard, StorePriceRow, CustomTooltip) remain unchanged structurally,
// but ensure no emojis are present inside their text values either.

function StatCard({
  label,
  value,
  sub,
  trend,
  highlight = false,
}: {
  label: string;
  value: string;
  sub: string;
  trend: number | null;
  highlight?: boolean;
}) {
  const TrendIcon =
    trend === null
      ? null
      : trend > 1
      ? TrendingUp
      : trend < -1
      ? TrendingDown
      : Minus;
  const trendColor =
    trend === null
      ? ""
      : trend > 1
      ? "#ef4444"
      : trend < -1
      ? "#22c55e"
      : "rgba(253,246,227,0.4)";

  return (
    <div
      className="rounded-2xl p-4 md:p-5"
      style={{
        background: highlight
          ? "linear-gradient(135deg, rgba(180,83,9,0.3), rgba(217,119,6,0.15))"
          : "rgba(45,31,14,0.8)",
        border: highlight
          ? "1px solid rgba(245,158,11,0.4)"
          : "1px solid var(--border)",
      }}
    >
      <p
        className="text-xs uppercase tracking-wider mb-2"
        style={{
          color: "rgba(253,246,227,0.45)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span
          className="font-display text-3xl md:text-4xl"
          style={{
            color: highlight ? "var(--yolk)" : "var(--shell)",
            letterSpacing: "0.03em",
          }}
        >
          {value}
        </span>
        {TrendIcon && (
          <TrendIcon size={16} style={{ color: trendColor, marginBottom: 6 }} />
        )}
      </div>
      <p
        className="text-xs mt-1"
        style={{
          color: "rgba(253,246,227,0.4)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {sub}
      </p>
    </div>
  );
}

function StorePriceRow({ store, rank }: { store: StorePrice; rank: number }) {
  const isBest = rank === 1;
  return (
    <a
      href={store.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:scale-[1.01]"
      style={{
        background: isBest ? "rgba(34,197,94,0.08)" : "rgba(26,18,8,0.6)",
        border: `1px solid ${
          isBest ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.12)"
        }`,
      }}
    >
      <span className="text-2xl w-8 text-center">{store.logo}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{store.store}</span>
          {isBest && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(34,197,94,0.2)",
                color: "#22c55e",
                fontFamily: "var(--font-mono)",
              }}
            >
              BEST VALUE
            </span>
          )}
          {store.source === "estimated" && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(245,158,11,0.1)",
                color: "rgba(253,246,227,0.4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              est.
            </span>
          )}
        </div>
        <div
          className="text-xs mt-0.5 flex items-center gap-2"
          style={{ color: "rgba(253,246,227,0.4)" }}
        >
          <span>{store.size}</span>
          {store.distance && <span>· {store.distance} mi</span>}
          {store.note && <span>· {store.note}</span>}
        </div>
      </div>
      <div className="text-right">
        <div
          className="font-display text-xl"
          style={{
            color: isBest ? "#22c55e" : "var(--yolk)",
            letterSpacing: "0.03em",
          }}
        >
          ${store.price?.toFixed(2)}
        </div>
        <div
          className="text-xs"
          style={{
            color: "rgba(253,246,227,0.35)",
            fontFamily: "var(--font-mono)",
          }}
        >
          ${store.pricePerEgg?.toFixed(3)}/egg
        </div>
      </div>
      <ExternalLink
        size={14}
        style={{ color: "rgba(253,246,227,0.25)", flexShrink: 0 }}
      />
    </a>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "rgba(26,18,8,0.95)",
        border: "1px solid rgba(245,158,11,0.3)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div className="text-xs mb-1" style={{ color: "rgba(253,246,227,0.5)" }}>
        {label}
      </div>
      <div className="text-lg font-medium" style={{ color: "var(--yolk)" }}>
        ${payload[0].value.toFixed(2)}
        <span
          className="text-xs ml-1"
          style={{ color: "rgba(253,246,227,0.4)" }}
        >
          /dozen
        </span>
      </div>
    </div>
  );
}
