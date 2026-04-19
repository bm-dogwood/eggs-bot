// components/dashboard/PricesPage.tsx
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar } from "react-chartjs-2";

import MetricCard from "@/components/MetricCard";
import PriceChart from "@/components/PieChart";
import { Card } from "@/components/shared/Card";
import { DARK_THEME } from "@/components/shared/DarkThemeStyles";
import { PRICE_HISTORY, EGG_TYPE_INFO, MARKET_ANALYSIS } from "@/lib/constants";
import {
  TooltipItem,
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const current = PRICE_HISTORY[PRICE_HISTORY.length - 1].price;
const allHigh = Math.max(...PRICE_HISTORY.map((p) => p.price));

const avg2024 =
  PRICE_HISTORY.filter((p) => p.year === "2024").reduce(
    (s, p) => s + p.price,
    0
  ) / 12;

const typeData = {
  labels: [
    "Conventional",
    "Cage-Free",
    "Free-Range",
    "Organic",
    "Pasture-Raised",
  ],
  datasets: [
    {
      label: "Low",
      data: [2.5, 3.5, 4.0, 5.0, 6.0],
      backgroundColor: "rgba(16, 185, 129, 0.25)",
      borderRadius: 6,
    },
    {
      label: "High",
      data: [3.5, 5.0, 5.5, 7.0, 9.0],
      backgroundColor: "rgba(16, 185, 129, 0.65)",
      borderRadius: 6,
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

export function PricesPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="metrics-grid">
        <MetricCard
          label="Current Average"
          value={`$${current.toFixed(2)}`}
          sub="Per dozen · National avg"
          primary
          darkTheme
        />
        <MetricCard
          label="Peak (Jan 2023)"
          value={`$${allHigh.toFixed(2)}`}
          sub="HPAI outbreak spike"
          darkTheme
        />
        <MetricCard
          label="Pre-HPAI Floor"
          value="$1.72"
          sub="Early 2021"
          darkTheme
        />
        <MetricCard
          label="2024 Average"
          value={`$${avg2024.toFixed(2)}`}
          sub="Full-year average"
          darkTheme
        />
      </div>

      <Card
        title="Full Price History · 2019–2025"
        subtitle="BLS CPI — Average retail price per dozen Grade A large eggs"
      >
        <PriceChart defaultRange={999} height={300} darkTheme />
      </Card>

      <div className="two-column-grid">
        <Card
          title="Price by Egg Type"
          subtitle="Typical retail range per dozen, current market"
        >
          <div className="table-wrapper-dark">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Price Range</th>
                  <th>vs Conv.</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(EGG_TYPE_INFO).map(([, info]) => (
                  <tr key={info.label}>
                    <td className="font-medium text-primary">{info.label}</td>
                    <td>
                      ${info.priceLow.toFixed(2)}–${info.priceHigh.toFixed(2)}
                    </td>
                    <td>
                      <span className="badge badge-warning">
                        {info.multiplier}
                      </span>
                    </td>
                    <td>
                      <TrendingUp
                        size={14}
                        style={{
                          color: info.priceLow > 4 ? "#ef4444" : "#f59e0b",
                        }}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="font-medium text-primary">Costco 36ct</td>
                  <td>$7.99 / 36 eggs</td>
                  <td>
                    <span className="badge badge-success">Best/egg</span>
                  </td>
                  <td>
                    <TrendingDown size={14} style={{ color: "#10b981" }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Type Price Range Chart" subtitle="Low–high end per dozen">
          <div style={{ height: 220, position: "relative" }}>
            <Bar
              data={typeData}
              options={barOpts}
              aria-label="Egg type price ranges"
            />
          </div>
        </Card>
      </div>

      <Card
        title="Why Are Egg Prices So Volatile?"
        subtitle="The key forces driving prices up and down"
      >
        <div className="analysis-grid">
          {MARKET_ANALYSIS.map((item) => (
            <div key={item.title} className="analysis-card">
              <div className="analysis-header">
                <h4 className="analysis-title">{item.title}</h4>
              </div>
              <p className="analysis-body">{item.body}</p>
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

        .table-wrapper-dark {
          overflow-x: auto;
          padding: 0 20px 20px;
        }

        .table-dark {
          width: 100%;
          border-collapse: collapse;
        }

        .table-dark th {
          text-align: left;
          padding: 12px 12px 10px;
          font-size: 11px;
          font-weight: 600;
          color: ${DARK_THEME.text.tertiary};
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid ${DARK_THEME.border.subtle};
        }

        .table-dark td {
          padding: 12px;
          font-size: 13px;
          color: ${DARK_THEME.text.secondary};
          border-bottom: 1px solid ${DARK_THEME.border.subtle};
        }

        .table-dark tr:last-child td {
          border-bottom: none;
        }

        .text-primary {
          color: ${DARK_THEME.text.primary};
        }

        .font-medium {
          font-weight: 500;
        }

        .badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .badge-warning {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .analysis-card {
          padding: 18px;
          background: ${DARK_THEME.bg.secondary};
          border: 1px solid ${DARK_THEME.border.subtle};
          border-radius: 14px;
          transition: all 0.2s;
        }

        .analysis-card:hover {
          border-color: ${DARK_THEME.border.accent};
          background: ${DARK_THEME.bg.tertiary};
        }

        .analysis-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .analysis-emoji {
          font-size: 22px;
        }

        .analysis-title {
          font-size: 14px;
          font-weight: 700;
          color: ${DARK_THEME.text.primary};
          margin: 0;
        }

        .analysis-body {
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

          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
