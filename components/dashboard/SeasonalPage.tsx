// components/dashboard/SeasonalPage.tsx
"use client";

import { Calendar } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { TooltipItem } from "chart.js";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/shared/Card";
import { DARK_THEME } from "@/components/shared/DarkThemeStyles";
import { SEASONAL_DATA } from "@/lib/constants";
import { demandColor } from "@/lib/utils";

const maxPrice = Math.max(...SEASONAL_DATA.map((d) => d.price));
const minPrice = Math.min(...SEASONAL_DATA.map((d) => d.price));
const peakIdx = SEASONAL_DATA.findIndex((d) => d.price === maxPrice);
const lowIdx = SEASONAL_DATA.findIndex((d) => d.price === minPrice);

const chartData = {
  labels: SEASONAL_DATA.map((d) => d.month),
  datasets: [
    {
      data: SEASONAL_DATA.map((d) => d.price),
      backgroundColor: SEASONAL_DATA.map((d) =>
        d.demand === "High"
          ? "rgba(239, 68, 68, 0.7)"
          : d.demand === "Med"
          ? "rgba(245, 158, 11, 0.65)"
          : "rgba(16, 185, 129, 0.65)"
      ),
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

const barOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1e1e24",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      titleColor: "#a1a1aa",
      bodyColor: "#f0f0f5",
      padding: 12,
      callbacks: {
        label: (tooltipItem: TooltipItem<"bar">) => {
          const value = tooltipItem.parsed.y ?? 0;
          return ` $${value.toFixed(2)}/dozen`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#71717a", font: { size: 11 } },
      border: { display: false },
    },
    y: {
      grid: { color: "rgba(255, 255, 255, 0.06)" },
      ticks: {
        color: "#71717a",
        font: { size: 11 },
        callback: (v: string | number) => `$${Number(v).toFixed(1)}`,
      },
      border: { display: false },
    },
  },
};

const SEASONAL_EXPLANATIONS = [
  {
    period: "Nov–Feb · High",
    color: DARK_THEME.text.danger,
    body: "Holiday baking for Thanksgiving, Christmas and New Year drives major demand spikes. Cold weather also slightly reduces laying rates as hens need more energy for warmth.",
  },
  {
    period: "Mar–Apr · Medium",
    color: DARK_THEME.text.warning,
    body: "Easter creates a short demand spike — eggs and dye kits sell out for 2–3 weeks. Otherwise moderate. A good window to buy before summer lows arrive.",
  },
  {
    period: "May–Sep · Low",
    color: DARK_THEME.text.accent,
    body: "Summer sees the lowest egg prices of the year. Longer daylight improves laying rates, and holiday demand is absent. The optimal time to stock up and freeze extras.",
  },
];

export function SeasonalPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="metrics-grid">
        <MetricCard
          label="Peak Month"
          value={SEASONAL_DATA[peakIdx].month}
          sub={`$${maxPrice.toFixed(2)} avg · Holiday demand`}
          primary
          darkTheme
        />
        <MetricCard
          label="Cheapest Month"
          value={SEASONAL_DATA[lowIdx].month}
          sub={`$${minPrice.toFixed(2)} avg · Off-peak`}
          darkTheme
        />
        <MetricCard
          label="Peak Premium"
          value="+56%"
          sub="Dec vs Jun average"
          darkTheme
        />
        <MetricCard
          label="Best to Stock Up"
          value="Jun–Jul"
          sub="Lowest annual prices historically"
          darkTheme
        />
      </div>

      <div className="two-column-grid">
        <Card
          title="Monthly Price Pattern"
          subtitle="5-year average — when eggs get expensive"
          icon={<Calendar size={16} />}
        >
          <div className="legend-container">
            {[
              { label: "High demand", color: "rgba(239, 68, 68, 0.7)" },
              { label: "Medium", color: "rgba(245, 158, 11, 0.65)" },
              { label: "Low demand", color: "rgba(16, 185, 129, 0.65)" },
            ].map(({ label, color }) => (
              <div key={label} className="legend-item">
                <div className="legend-dot" style={{ background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 220, position: "relative" }}>
            <Bar
              data={chartData}
              options={barOpts}
              aria-label="Monthly seasonal egg price pattern"
            />
          </div>
        </Card>

        <Card
          title="Monthly Breakdown"
          subtitle="Demand level and average price"
        >
          <div className="monthly-list">
            {SEASONAL_DATA.map((d) => {
              const dc = demandColor[d.demand];
              return (
                <div key={d.month} className="monthly-item">
                  <span className="monthly-name">{d.month}</span>
                  <div className="monthly-bar-wrapper">
                    <div
                      className="monthly-bar"
                      style={{
                        width: `${(d.price / maxPrice) * 100}%`,
                        background: dc.bg,
                      }}
                    />
                  </div>
                  <span className="monthly-price">${d.price.toFixed(2)}</span>
                  <span
                    className="monthly-demand"
                    style={{
                      background: dc.badge,
                      color: dc.text,
                    }}
                  >
                    {d.demand}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title="Why Do Prices Move Seasonally?">
        <div className="seasonal-grid">
          {SEASONAL_EXPLANATIONS.map(({ period, color, body }) => (
            <div key={period} className="seasonal-card">
              <h4 className="seasonal-period" style={{ color }}>
                {period}
              </h4>
              <p className="seasonal-body">{body}</p>
            </div>
          ))}
        </div>
      </Card>

      <style jsx>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .two-column-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .legend-container {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: ${DARK_THEME.text.secondary};
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .monthly-list {
          padding: 8px 20px 20px;
        }

        .monthly-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 7px 0;
          border-bottom: 1px solid ${DARK_THEME.border.subtle};
        }

        .monthly-item:last-child {
          border-bottom: none;
        }

        .monthly-name {
          font-size: 12.5px;
          font-weight: 600;
          color: ${DARK_THEME.text.primary};
          width: 36px;
        }

        .monthly-bar-wrapper {
          flex: 1;
          height: 6px;
          background: ${DARK_THEME.bg.tertiary};
          border-radius: 3px;
          overflow: hidden;
        }

        .monthly-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .monthly-price {
          font-size: 12.5px;
          font-weight: 600;
          color: ${DARK_THEME.text.primary};
          width: 48px;
          text-align: right;
        }

        .monthly-demand {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          width: 42px;
          text-align: center;
        }

        .seasonal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .seasonal-card {
          padding: 18px;
          background: ${DARK_THEME.bg.secondary};
          border: 1px solid ${DARK_THEME.border.subtle};
          border-radius: 14px;
          transition: all 0.2s;
        }

        .seasonal-card:hover {
          border-color: ${DARK_THEME.border.accent};
        }

        .seasonal-period {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 10px;
        }

        .seasonal-body {
          font-size: 12.5px;
          color: ${DARK_THEME.text.secondary};
          line-height: 1.7;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .two-column-grid {
            grid-template-columns: 1fr;
          }

          .seasonal-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
