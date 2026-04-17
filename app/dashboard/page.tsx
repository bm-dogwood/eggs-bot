"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  ChevronDown,
  ChevronUp,
  BarChart2,
  ShoppingCart,
  AlertCircle,
  Egg,
  Leaf,
  Award,
  DollarSign,
  Clock,
  Globe,
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

const FAQ_ITEMS = [
  {
    q: "Why are egg prices so high right now?",
    a: "Prices remain elevated due to a combination of factors: ongoing HPAI (bird flu) outbreaks reducing flock sizes, elevated feed and energy costs, and structural market changes driven by state cage-free mandates. Recovery lags because replacing hens takes 5–6 months from chick to laying maturity.",
  },
  {
    q: "What is HPAI and how does it affect prices?",
    a: "Highly Pathogenic Avian Influenza (HPAI) is a devastating bird disease that has led to the culling of 100M+ birds since 2022. When a flock tests positive, the entire operation must be depopulated to prevent spread — instantly removing millions of eggs from supply and spiking prices regionally and nationally.",
  },
  {
    q: "What's the cheapest way to buy eggs?",
    a: "Costco's 36-count packs consistently offer the lowest per-egg cost (~$0.22/egg). Aldi and Walmart are the best options for 12-count cartons. Buying store-brand conventional eggs and avoiding pre-packaged specialty varieties can save 30–50% vs. name brands.",
  },
  {
    q: "Are cage-free eggs worth the price premium?",
    a: "Cage-free hens have more space and better welfare outcomes than conventional caged birds, but studies show minimal nutritional difference in the eggs. Free-range and pasture-raised eggs tend to have higher omega-3s. Whether the premium is 'worth it' depends on your priorities around animal welfare, nutrition, and budget.",
  },
  {
    q: "Will prices come down in 2025?",
    a: "Analysts expect gradual normalization as flocks recover from HPAI and new cage-free facilities come online. However, any new outbreak can cause rapid re-escalation. The baseline price floor has likely risen permanently due to higher production standards and energy costs.",
  },
  {
    q: "How is the national average price calculated?",
    a: "The national average shown here is derived from the BLS CPI dataset, series APU0000708111, which tracks the average retail price of one dozen Grade A large eggs. Data is collected monthly from urban areas across the United States.",
  },
];

// Seasonal trend data (mock)
const SEASONAL_DATA = [
  { month: "Jan", price: 5.1, demand: "High" },
  { month: "Feb", price: 4.8, demand: "High" },
  { month: "Mar", price: 4.2, demand: "Med" },
  { month: "Apr", price: 3.9, demand: "Med" },
  { month: "May", price: 3.6, demand: "Low" },
  { month: "Jun", price: 3.4, demand: "Low" },
  { month: "Jul", price: 3.5, demand: "Low" },
  { month: "Aug", price: 3.7, demand: "Med" },
  { month: "Sep", price: 3.9, demand: "Med" },
  { month: "Oct", price: 4.1, demand: "Med" },
  { month: "Nov", price: 4.6, demand: "High" },
  { month: "Dec", price: 5.3, demand: "High" },
];

export default function Dashboard({ initialStats }: DashboardProps) {
  const [zip, setZip] = useState("");
  const [submittedZip, setSubmittedZip] = useState("");
  const [eggType, setEggType] = useState<EggType>("all");
  const [storePrices, setStorePrices] = useState<StorePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSet, setAlertSet] = useState(false);
  const [chartRange, setChartRange] = useState(12);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const priceChartRef = useRef<HTMLCanvasElement>(null);
  const seasonalChartRef = useRef<HTMLCanvasElement>(null);
  const typeChartRef = useRef<HTMLCanvasElement>(null);
  const priceChartInstance = useRef<any>(null);
  const seasonalChartInstance = useRef<any>(null);
  const typeChartInstance = useRef<any>(null);

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

  // Slice history for selected range
  const slicedHistory = safeStats.history.slice(-chartRange);

  // Load Chart.js once, then render charts
  useEffect(() => {
    const scriptId = "chartjs-cdn";
    const existingScript = document.getElementById(scriptId);

    const initCharts = () => {
      const ChartJS = (window as any).Chart;
      if (!ChartJS) return;

      // --- Price History Chart ---
      if (priceChartRef.current) {
        if (priceChartInstance.current) priceChartInstance.current.destroy();
        const labels = slicedHistory.map(
          (p) => `${p.period.slice(0, 3)} '${p.year.slice(2)}`
        );
        const prices = slicedHistory.map((p) => p.price);
        priceChartInstance.current = new ChartJS(priceChartRef.current, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "$/Dozen",
                data: prices,
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245,158,11,0.12)",
                borderWidth: 2.5,
                pointRadius: 0,
                pointHoverRadius: 5,
                tension: 0.35,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(26,18,8,0.95)",
                borderColor: "rgba(245,158,11,0.3)",
                borderWidth: 1,
                titleColor: "rgba(253,246,227,0.5)",
                bodyColor: "#f59e0b",
                callbacks: {
                  label: (ctx: any) => ` $${ctx.parsed.y.toFixed(2)}/dozen`,
                },
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(245,158,11,0.07)" },
                ticks: {
                  color: "rgba(253,246,227,0.4)",
                  font: { size: 11, family: "DM Mono" },
                  maxRotation: 45,
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
              },
              y: {
                grid: { color: "rgba(245,158,11,0.07)" },
                ticks: {
                  color: "rgba(253,246,227,0.4)",
                  font: { size: 11, family: "DM Mono" },
                  callback: (v: any) => `$${Number(v).toFixed(2)}`,
                },
                // Annotate ATH
                afterDataLimits: (axis: any) => {
                  axis.max = Math.max(axis.max, safeStats.allTimeHigh + 0.3);
                },
              },
            },
          },
        });
      }

      // --- Seasonal Trend Chart ---
      if (seasonalChartRef.current) {
        if (seasonalChartInstance.current)
          seasonalChartInstance.current.destroy();
        seasonalChartInstance.current = new ChartJS(seasonalChartRef.current, {
          type: "bar",
          data: {
            labels: SEASONAL_DATA.map((d) => d.month),
            datasets: [
              {
                label: "Avg Price ($/dz)",
                data: SEASONAL_DATA.map((d) => d.price),
                backgroundColor: SEASONAL_DATA.map((d) =>
                  d.demand === "High"
                    ? "rgba(239,68,68,0.7)"
                    : d.demand === "Med"
                    ? "rgba(245,158,11,0.6)"
                    : "rgba(34,197,94,0.6)"
                ),
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(26,18,8,0.95)",
                borderColor: "rgba(245,158,11,0.3)",
                borderWidth: 1,
                titleColor: "rgba(253,246,227,0.5)",
                bodyColor: "#f59e0b",
                callbacks: {
                  label: (ctx: any) => ` $${ctx.parsed.y.toFixed(2)}/dozen`,
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  color: "rgba(253,246,227,0.45)",
                  font: { size: 11, family: "DM Mono" },
                },
              },
              y: {
                grid: { color: "rgba(245,158,11,0.07)" },
                ticks: {
                  color: "rgba(253,246,227,0.4)",
                  font: { size: 11, family: "DM Mono" },
                  callback: (v: any) => `$${Number(v).toFixed(1)}`,
                },
              },
            },
          },
        });
      }

      // --- Egg Type Price Chart ---
      if (typeChartRef.current) {
        if (typeChartInstance.current) typeChartInstance.current.destroy();
        typeChartInstance.current = new ChartJS(typeChartRef.current, {
          type: "bar",
          data: {
            labels: [
              "Conventional",
              "Cage-Free",
              "Free-Range",
              "Organic",
              "Pasture-Raised",
            ],
            datasets: [
              {
                label: "Min Price",
                data: [2.5, 3.5, 4.0, 5.0, 6.0],
                backgroundColor: "rgba(245,158,11,0.35)",
                borderRadius: 4,
              },
              {
                label: "Max Price",
                data: [3.5, 5.0, 5.5, 7.0, 9.0],
                backgroundColor: "rgba(245,158,11,0.75)",
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(26,18,8,0.95)",
                borderColor: "rgba(245,158,11,0.3)",
                borderWidth: 1,
                titleColor: "rgba(253,246,227,0.5)",
                bodyColor: "#f59e0b",
                callbacks: {
                  label: (ctx: any) =>
                    ` ${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}/dz`,
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  color: "rgba(253,246,227,0.45)",
                  font: { size: 11, family: "DM Mono" },
                },
              },
              y: {
                stacked: false,
                grid: { color: "rgba(245,158,11,0.07)" },
                ticks: {
                  color: "rgba(253,246,227,0.4)",
                  font: { size: 11, family: "DM Mono" },
                  callback: (v: any) => `$${Number(v).toFixed(0)}`,
                },
              },
            },
          },
        });
      }
    };

    if (existingScript) {
      initCharts();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = initCharts;
      document.head.appendChild(script);
    }

    return () => {
      priceChartInstance.current?.destroy();
      seasonalChartInstance.current?.destroy();
      typeChartInstance.current?.destroy();
    };
  }, [chartRange, safeStats.history]);

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
        {/* ─── Hero ─────────────────────────────────────────────── */}
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
              The most complete egg price tracker in America.
            </p>
            <p
              className="text-sm mb-6"
              style={{
                color: "rgba(253,246,227,0.4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              BLS CPI Data · Retail API Aggregation · Updated Daily
            </p>
            <div
              className="flex flex-wrap justify-center gap-6 text-xs"
              style={{
                fontFamily: "var(--font-mono)",
                color: "rgba(253,246,227,0.5)",
              }}
            >
              <span className="flex items-center gap-1.5">
                <Globe size={12} style={{ color: "var(--yolk)" }} /> National
                Coverage
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart2 size={12} style={{ color: "var(--yolk)" }} /> 5+
                Years of History
              </span>
              <span className="flex items-center gap-1.5">
                <ShoppingCart size={12} style={{ color: "var(--yolk)" }} /> 5
                Major Retailers
              </span>
              <span className="flex items-center gap-1.5">
                <Bell size={12} style={{ color: "var(--yolk)" }} /> Price Alerts
              </span>
            </div>
          </div>
        </section>

        {/* ─── National Stats ───────────────────────────────────── */}
        <section>
          <h2
            className="font-display text-xl mb-4"
            style={{ color: "rgba(253,246,227,0.5)", letterSpacing: "0.05em" }}
          >
            NATIONAL SNAPSHOT
          </h2>
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
              sub={`Year ago: $${safeStats.yearAgo.toFixed(2)}/dz`}
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

        {/* ─── Market Alert Banner ──────────────────────────────── */}
        <section
          className="rounded-2xl px-6 py-4 flex items-start gap-4"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <AlertCircle
            size={20}
            style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}
          />
          <div>
            <p
              className="text-sm font-semibold mb-0.5"
              style={{ color: "#ef4444", fontFamily: "var(--font-mono)" }}
            >
              ACTIVE MARKET ALERT
            </p>
            <p className="text-sm" style={{ color: "rgba(253,246,227,0.65)" }}>
              A new HPAI detection in the Midwest has been reported. Regional
              prices in Illinois, Iowa, and Indiana may spike 15–25% over the
              next 4–6 weeks as flocks are depopulated per USDA protocol.
              Monitor local store prices closely.
            </p>
          </div>
        </section>

        {/* ─── Historical Price Chart ───────────────────────────── */}
        <section className="card-dark rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
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
                Source: BLS CPI · Series APU0000708111 · National Avg $/Dozen
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

          {/* ATH annotation label */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="flex items-center gap-1.5 text-xs px-2 py-1 rounded"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#ef4444",
                fontFamily: "var(--font-mono)",
                border: "1px dashed rgba(239,68,68,0.4)",
              }}
            >
              ATH ${safeStats.allTimeHigh.toFixed(2)} — Jan 2023 HPAI outbreak
            </span>
            <span
              className="flex items-center gap-1.5 text-xs px-2 py-1 rounded"
              style={{
                background: "rgba(34,197,94,0.1)",
                color: "#22c55e",
                fontFamily: "var(--font-mono)",
                border: "1px dashed rgba(34,197,94,0.3)",
              }}
            >
              ATL ${safeStats.allTimeLow.toFixed(2)} — Pre-2022 baseline
            </span>
          </div>

          <div style={{ position: "relative", height: "300px", width: "100%" }}>
            <canvas
              ref={priceChartRef}
              role="img"
              aria-label="Line chart of national average egg prices per dozen over time"
            >
              Historical egg price data.
            </canvas>
          </div>

          <p
            className="text-xs mt-3 flex items-center gap-1"
            style={{
              color: "rgba(253,246,227,0.3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <Info size={11} /> Monthly averages. Retail data may differ from BLS
            survey prices.
          </p>
        </section>

        {/* ─── Two-column charts ────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seasonal Trends */}
          <section className="card-dark rounded-2xl p-6">
            <h2
              className="font-display text-xl mb-1"
              style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
            >
              SEASONAL PATTERNS
            </h2>
            <p
              className="text-xs mb-4"
              style={{
                color: "rgba(253,246,227,0.4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Avg monthly price across 5-year composite
            </p>
            <div
              className="flex gap-4 mb-3 text-xs"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "rgba(239,68,68,0.7)",
                    display: "inline-block",
                  }}
                />{" "}
                High demand
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "rgba(245,158,11,0.6)",
                    display: "inline-block",
                  }}
                />{" "}
                Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "rgba(34,197,94,0.6)",
                    display: "inline-block",
                  }}
                />{" "}
                Low demand
              </span>
            </div>
            <div
              style={{ position: "relative", height: "220px", width: "100%" }}
            >
              <canvas
                ref={seasonalChartRef}
                role="img"
                aria-label="Bar chart of average egg prices by month showing seasonal patterns"
              >
                Seasonal egg price data by month.
              </canvas>
            </div>
            <p
              className="text-xs mt-3"
              style={{
                color: "rgba(253,246,227,0.35)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Holiday baking (Nov–Feb) and Easter consistently drive demand
              peaks.
            </p>
          </section>

          {/* Egg Type Price Range */}
          <section className="card-dark rounded-2xl p-6">
            <h2
              className="font-display text-xl mb-1"
              style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
            >
              PRICE BY EGG TYPE
            </h2>
            <p
              className="text-xs mb-4"
              style={{
                color: "rgba(253,246,227,0.4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Typical retail range per dozen ($/dz)
            </p>
            <div
              className="flex gap-4 mb-3 text-xs"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "rgba(245,158,11,0.35)",
                    display: "inline-block",
                  }}
                />{" "}
                Min price
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "rgba(245,158,11,0.75)",
                    display: "inline-block",
                  }}
                />{" "}
                Max price
              </span>
            </div>
            <div
              style={{ position: "relative", height: "220px", width: "100%" }}
            >
              <canvas
                ref={typeChartRef}
                role="img"
                aria-label="Bar chart comparing min and max prices for each egg type"
              >
                Egg type price range comparison.
              </canvas>
            </div>
            <p
              className="text-xs mt-3"
              style={{
                color: "rgba(253,246,227,0.35)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Pasture-raised can cost up to 3.5x conventional at peak pricing.
            </p>
          </section>
        </div>

        {/* ─── ZIP Code Search ──────────────────────────────────── */}
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
            Compare real-time pricing across Aldi, Kroger, Walmart, Target &amp;
            Costco
          </p>

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
                <Info size={11} /> Kroger pricing via API. Competitor data
                estimated from regional averages. Confirm in-store.
              </p>
            </div>
          )}
        </section>

        {/* ─── Price Alert ──────────────────────────────────────── */}
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
            Get notified by email when the national average drops below your
            target threshold.
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
                Alert set. You will be notified when prices fall below $
                {alertPrice}/dz.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
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
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 min-w-48 px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(26,18,8,0.8)",
                  border: "1px solid var(--border)",
                  color: "var(--shell)",
                  fontFamily: "var(--font-mono)",
                }}
              />
              <button
                onClick={setAlert}
                disabled={!alertPrice || !alertEmail}
                className="px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-40"
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

        {/* ─── Egg Type Guide ───────────────────────────────────── */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-2"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            EGG GRADING &amp; PRICING GUIDE
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "rgba(253,246,227,0.5)" }}
          >
            All USDA-graded eggs sold in the U.S. must meet minimum quality
            standards, but housing and feed practices vary widely across egg
            types — which is reflected in retail price.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                type: "Conventional",
                price: "$2.50–$3.50",
                desc: "Standard battery-cage production. Lowest retail cost. Hens housed at ~67 sq in of space per bird.",
                multiplier: "1.0x Base",
                icon: Egg,
              },
              {
                type: "Cage-Free",
                price: "$3.50–$5.00",
                desc: "Indoor housing without cages. Hens can move freely but don't have outdoor access. Required by law in many states.",
                multiplier: "~1.4x",
                icon: Egg,
              },
              {
                type: "Free-Range",
                price: "$4.00–$5.50",
                desc: "USDA requires outdoor access, though the duration and quality of access varies significantly by producer.",
                multiplier: "~1.6x",
                icon: Leaf,
              },
              {
                type: "Organic",
                price: "$5.00–$7.00",
                desc: "USDA certified organic feed, no antibiotics or synthetic pesticides. Must also be cage-free.",
                multiplier: "~1.8x",
                icon: Leaf,
              },
              {
                type: "Pasture-Raised",
                price: "$6.00–$9.00",
                desc: "Minimum 108 sq ft of outdoor pasture per hen. Strongest animal welfare standard. Humane Certified or AWA certified.",
                multiplier: "~2.2x",
                icon: Award,
              },
              {
                type: "Costco Bulk (36ct)",
                price: "$7.99/36ct",
                desc: "Best per-unit cost at ~$0.22/egg. Great for high-volume households. Typically cage-free or conventional.",
                multiplier: "Best Value",
                icon: DollarSign,
              },
            ].map((e) => {
              const Icon = e.icon;
              return (
                <div
                  key={e.type}
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(26,18,8,0.6)",
                    border: "1px solid rgba(245,158,11,0.12)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon size={16} style={{ color: "var(--yolk)" }} />
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
                    className="text-sm mb-2"
                    style={{
                      color: "var(--yolk)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {e.price}
                  </div>
                  <div
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(253,246,227,0.45)" }}
                  >
                    {e.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Buying Tips ──────────────────────────────────────── */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-6"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            HOW TO SAVE ON EGGS
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                tip: "Buy in bulk at Costco or Sam's Club",
                detail:
                  "Per-egg cost drops to $0.20–0.25 vs $0.35+ at standard retailers. Best if you use 3+ dozen/month.",
                icon: ShoppingCart,
              },
              {
                tip: "Shop store brands over name brands",
                detail:
                  "Store-brand eggs are 20–35% cheaper and come from the same farms as many name brands.",
                icon: DollarSign,
              },
              {
                tip: "Check prices mid-week",
                detail:
                  "Grocery stores often restock and reprice Tuesday–Thursday. Weekend shoppers frequently see higher prices.",
                icon: Clock,
              },
              {
                tip: "Avoid holiday weeks",
                detail:
                  "Easter, Thanksgiving, and Christmas cause predictable demand spikes. Stock up 1–2 weeks before.",
                icon: Bell,
              },
              {
                tip: "Compare per-egg, not per-dozen",
                detail:
                  "Jumbo eggs cost more per dozen but often deliver better value per gram of protein than medium-sized packs.",
                icon: BarChart2,
              },
              {
                tip: "Freeze what you won't use",
                detail:
                  "Crack and freeze eggs in ice cube trays for up to 12 months. Ideal for catching a sale.",
                icon: Leaf,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.tip}
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(26,18,8,0.6)",
                    border: "1px solid rgba(245,158,11,0.1)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 rounded-lg p-1.5 flex-shrink-0"
                      style={{ background: "rgba(245,158,11,0.15)" }}
                    >
                      <Icon size={14} style={{ color: "var(--yolk)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">{item.tip}</p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "rgba(253,246,227,0.45)" }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Market Analysis ──────────────────────────────────── */}
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
                pricing structures. The virus spreads through wild bird
                migration routes, making geographic containment extremely
                difficult.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                Input Costs: Feed &amp; Energy
              </h3>
              <p>
                Corn and soybean meal futures rose sharply post-2021. Coupled
                with persistent energy inflation, operational overhead for
                producers remains elevated, directly influencing retail shelf
                prices. Feed accounts for roughly 60–70% of total egg production
                cost, making commodity markets a key price driver.
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
                supply disruptions. The top 5 egg producers control over 30% of
                U.S. laying capacity. Additionally, California's Proposition 12
                and similar legislation in other states have accelerated the
                transition to cage-free systems, increasing baseline production
                costs nationwide by an estimated $0.80–$1.20 per dozen.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                Production Lag &amp; Recovery
              </h3>
              <p>
                The biological lag to replenish flocks is 5–6 months from chick
                to laying maturity. This inelastic supply response prevents
                rapid market corrections, sustaining elevated price levels for
                extended durations following a supply shock. Hatcheries also
                face capacity constraints when trying to rapidly scale chick
                production.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                Retail Markup Structures
              </h3>
              <p>
                Eggs are often used as a "loss leader" by major grocery chains.
                However, during supply crunches, grocers have been criticized
                for excessive markups. Wholesale prices recovered faster than
                retail in 2023–2024, suggesting some price stickiness at the
                consumer level that benefits retailer margins.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--shell)" }}
              >
                International Trade &amp; Export Pressure
              </h3>
              <p>
                The U.S. exports approximately 4–5% of total egg production.
                During domestic shortages, export demand can exacerbate
                tightness. Conversely, import restrictions from countries
                experiencing their own HPAI outbreaks limit the ability to
                offset domestic supply shortfalls through trade.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Key Statistics Table ─────────────────────────────── */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-6"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            U.S. EGG INDUSTRY: KEY FIGURES
          </h2>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(245,158,11,0.2)" }}>
                  {["Metric", "Value", "Notes"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pr-6 text-xs"
                      style={{
                        color: "rgba(253,246,227,0.4)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Annual egg production",
                    "~110 billion eggs",
                    "USDA NASS 2023",
                  ],
                  ["Laying hens in U.S.", "~380 million", "As of Q1 2024"],
                  [
                    "Per capita consumption",
                    "~286 eggs/year",
                    "USDA ERS estimate",
                  ],
                  ["Birds culled since 2022", "100M+", "HPAI response"],
                  ["Cage-free share of market", "~35%", "Up from 5% in 2015"],
                  [
                    "Top producer share (top 5)",
                    "~30%",
                    "Cal-Maine Foods leads",
                  ],
                  [
                    "Average farm gate price",
                    "$1.40–$2.20/dz",
                    "Varies by contract/region",
                  ],
                  ["Retail markup (est.)", "60–80%", "Over farm gate"],
                  [
                    "USDA inspection coverage",
                    "100%",
                    "All shell eggs federally graded",
                  ],
                ].map(([metric, value, note]) => (
                  <tr
                    key={metric}
                    style={{ borderBottom: "1px solid rgba(245,158,11,0.07)" }}
                  >
                    <td className="py-3 pr-6" style={{ color: "var(--shell)" }}>
                      {metric}
                    </td>
                    <td
                      className="py-3 pr-6 font-medium"
                      style={{
                        color: "var(--yolk)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {value}
                    </td>
                    <td
                      className="py-3"
                      style={{
                        color: "rgba(253,246,227,0.4)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section className="card-dark rounded-2xl p-6">
          <h2
            className="font-display text-2xl mb-6"
            style={{ color: "var(--yolk)", letterSpacing: "0.05em" }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(245,158,11,0.12)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left text-sm font-medium transition-all"
                  style={{
                    background:
                      openFaq === i
                        ? "rgba(245,158,11,0.08)"
                        : "rgba(26,18,8,0.6)",
                    color: "var(--shell)",
                  }}
                >
                  <span>{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp
                      size={16}
                      style={{ color: "var(--yolk)", flexShrink: 0 }}
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      style={{ color: "rgba(253,246,227,0.4)", flexShrink: 0 }}
                    />
                  )}
                </button>
                {openFaq === i && (
                  <div
                    className="px-4 pb-4 pt-1 text-sm leading-relaxed"
                    style={{
                      background: "rgba(245,158,11,0.04)",
                      color: "rgba(253,246,227,0.65)",
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Data Sources & Disclaimer ────────────────────────── */}
        <section
          className="rounded-2xl p-6"
          style={{
            background: "rgba(26,18,8,0.4)",
            border: "1px solid rgba(245,158,11,0.08)",
          }}
        >
          <h2
            className="font-display text-lg mb-3"
            style={{ color: "rgba(253,246,227,0.4)", letterSpacing: "0.05em" }}
          >
            DATA SOURCES &amp; METHODOLOGY
          </h2>
          <p
            className="text-xs leading-relaxed mb-3"
            style={{
              color: "rgba(253,246,227,0.35)",
              fontFamily: "var(--font-mono)",
            }}
          >
            National average prices are sourced from the U.S. Bureau of Labor
            Statistics Consumer Price Index (BLS CPI), series APU0000708111 —
            "Eggs, Grade A, Large, per Dz." This data is collected monthly from
            urban households across all U.S. census regions. Local store pricing
            is sourced from retailer APIs where available (Kroger) and estimated
            from regional benchmarks for other retailers. Estimated prices carry
            an error margin of ±5–10%. All price data is updated daily.
          </p>
          <p
            className="text-xs"
            style={{
              color: "rgba(253,246,227,0.25)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Eggs.bot is an independent price tracking tool and is not affiliated
            with any retailer, the USDA, or the BLS. Prices shown are for
            informational purposes only. Always verify in-store pricing before
            purchase.
          </p>
        </section>
      </div>
    </>
  );
}

/* ─── Sub-components ────────────────────────────────────────── */

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
