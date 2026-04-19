// components/dashboard/OverviewPage.tsx
"use client";

import { ExternalLink, MapPin } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import PriceChart from "@/components/PieChart";
import StoreResults from "@/components/StoreResults";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { Card } from "@/components/shared/Card";
import { SnapshotList } from "@/components/shared/SnapshotList";
import { PriceDriversList } from "@/components/shared/PriceDriversList";
import { DARK_THEME } from "@/components/shared/DarkThemeStyles";
import { PRICE_HISTORY } from "@/lib/constants";
import { calcPctChange } from "@/lib/utils";

const current = PRICE_HISTORY[PRICE_HISTORY.length - 1].price;
const previous = PRICE_HISTORY[PRICE_HISTORY.length - 2].price;
const yearAgo = PRICE_HISTORY[PRICE_HISTORY.length - 13].price;
const allHigh = Math.max(...PRICE_HISTORY.map((p) => p.price));
const allLow = Math.min(...PRICE_HISTORY.map((p) => p.price));

const SNAPSHOT_ITEMS = [
  { label: "Laying hens (US)", value: "~380M", color: DARK_THEME.text.primary },
  { label: "Birds culled '22–", value: "100M+", color: DARK_THEME.text.danger },
  { label: "Cage-free share", value: "~35%", color: DARK_THEME.text.accent },
  {
    label: "Farm gate price",
    value: "$1.40–2.20",
    color: DARK_THEME.text.primary,
  },
  { label: "Retail markup", value: "60–80%", color: DARK_THEME.text.primary },
  {
    label: "Recovery time",
    value: "5–6 months",
    color: DARK_THEME.text.warning,
  },
];

const PRICE_DRIVERS = [
  {
    label: "HPAI Outbreaks",
    pct: 88,
    color: DARK_THEME.text.danger,
    bgColor: "rgba(239, 68, 68, 0.15)",
    level: "Critical",
  },
  {
    label: "Feed & Energy",
    pct: 62,
    color: DARK_THEME.text.warning,
    bgColor: "rgba(245, 158, 11, 0.15)",
    level: "Elevated",
  },
  {
    label: "Cage-Free Mandates",
    pct: 55,
    color: DARK_THEME.text.warning,
    bgColor: "rgba(245, 158, 11, 0.15)",
    level: "Moderate",
  },
  {
    label: "Retail Margins",
    pct: 35,
    color: DARK_THEME.text.accent,
    bgColor: "rgba(16, 185, 129, 0.15)",
    level: "Stable",
  },
];

export function OverviewPage() {
  const pctMonth = calcPctChange(current, previous);
  const pctYear = calcPctChange(current, yearAgo);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AlertBanner />

      <div className="metrics-grid">
        <MetricCard
          label="National Average"
          value={`$${current.toFixed(2)}`}
          delta={pctMonth}
          deltaLabel="vs last month"
          primary
          darkTheme
        />
        <MetricCard
          label="Year-over-Year"
          value={`${pctYear >= 0 ? "+" : ""}${pctYear.toFixed(1)}%`}
          sub={`One year ago: $${yearAgo.toFixed(2)}/dz`}
          darkTheme
        />
        <MetricCard
          label="All-Time High"
          value={`$${allHigh.toFixed(2)}`}
          sub="Jan 2023 · Bird flu outbreak"
          darkTheme
        />
        <MetricCard
          label="All-Time Low"
          value={`$${allLow.toFixed(2)}`}
          sub="Pre-2022 · Before supply disruptions"
          darkTheme
        />
      </div>

      <div className="overview-grid">
        <Card
          title="National Price History"
          subtitle="BLS CPI · APU0000708111 · Grade A large eggs, per dozen"
          action={
            <button className="card-action-btn">
              <ExternalLink size={14} />
            </button>
          }
        >
          <PriceChart darkTheme />
        </Card>

        <div className="sidebar-column">
          <Card title="Market Snapshot">
            <SnapshotList items={SNAPSHOT_ITEMS} />
          </Card>

          <Card title="Price Drivers">
            <PriceDriversList drivers={PRICE_DRIVERS} />
          </Card>
        </div>
      </div>

      <Card
        title="Quick Store Lookup"
        subtitle="Enter your ZIP to compare prices near you"
        icon={<MapPin size={16} />}
      >
        <StoreResults />
      </Card>

      <style jsx>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
        }

        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-action-btn {
          padding: 6px 10px;
          background: transparent;
          border: 1px solid ${DARK_THEME.border.medium};
          border-radius: 8px;
          color: ${DARK_THEME.text.secondary};
          cursor: pointer;
          transition: all 0.2s;
        }

        .card-action-btn:hover {
          background: ${DARK_THEME.bg.hover};
          border-color: ${DARK_THEME.border.accent};
          color: ${DARK_THEME.text.accent};
        }

        @media (max-width: 1024px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
