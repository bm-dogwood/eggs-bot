"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  LineController,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  TooltipItem,
  type Chart,
} from "chart.js";
import { PRICE_HISTORY } from "@/lib/constants";
import {
  sliceHistory,
  shortLabel,
  CHART_COLORS,
  baseChartOptions,
} from "@/lib/utils";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  LineController
);

const RANGES = [
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
  { label: "All", months: 999 },
];

interface PriceChartProps {
  defaultRange?: number;
  height?: number;
  darkTheme?: boolean;
}

export default function PriceChart({
  defaultRange = 12,
  height = 240,
}: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [range, setRange] = useState(defaultRange);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sliced = sliceHistory(PRICE_HISTORY, range);
    const labels = sliced.map((p) => shortLabel(p.period, p.year));
    const data = sliced.map((p) => p.price);

    if (chartRef.current) chartRef.current.destroy();

    const opts = baseChartOptions();

    chartRef.current = new ChartJS(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "$/Dozen",
            data,
            borderColor: CHART_COLORS.green,
            backgroundColor: CHART_COLORS.greenAlpha,
            borderWidth: 2.5,
            pointRadius: 2.5,
            pointBackgroundColor: CHART_COLORS.green,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        ...opts,
        plugins: {
          ...opts.plugins,
          tooltip: {
            ...opts.plugins?.tooltip,
            // Fix the font weight type issue
            bodyFont: {
              ...(opts.plugins?.tooltip as any)?.bodyFont,
              weight: 600, // Use number, not string "600"
            },
            callbacks: {
              label: (tooltipItem: TooltipItem<"line">) => {
                const value = tooltipItem.parsed.y ?? 0;
                return ` $${value.toFixed(2)} per dozen`;
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [range]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <div className="range-tabs">
          {RANGES.map((r) => (
            <button
              key={r.label}
              className={`range-tab${range === r.months ? " active" : ""}`}
              onClick={() => setRange(r.months)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", height }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="National egg price history line chart"
        />
      </div>
      <p style={{ fontSize: 10.5, color: "#d1d5db", marginTop: 8 }}>
        BLS CPI Series APU0000708111 · Monthly averages · Retail prices may vary
      </p>
    </div>
  );
}
