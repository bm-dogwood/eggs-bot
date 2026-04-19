"use client";

import { EggIcon, RefreshCw } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  overview: "Market Overview",
  prices: "Price History & Types",
  stores: "Store Finder",
  seasonal: "Seasonal Patterns",
  alerts: "Price Alerts",
  guide: "Egg Type Guide",
  faq: "FAQ & Data Sources",
};

interface TopbarProps {
  activePage: string;
  lastUpdated?: string;
}

export default function Topbar({
  activePage,
  lastUpdated = "Apr 2025",
}: TopbarProps) {
  return (
    <header
      style={{
        background: "#161615",
        borderBottom: "0.5px solid #e5e7eb",
        padding: "0 20px",
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: "-0.3px",
          paddingLeft: 1,
          borderLeft: "2px solid #111827",
          lineHeight: 1,
        }}
      >
        {" "}
        <EggIcon />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Live sources badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            border: "0.5px solid #d1d5db",
            borderRadius: 6,
            padding: "4px 9px",
            fontSize: 11,
            color: "#6b7280",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
              animation: "topbar-pulse 2.4s ease-in-out infinite",
            }}
          />
          BLS · Kroger API · Regional estimates
        </div>

        {/* Divider */}
        <div
          style={{
            width: 0.5,
            height: 14,
            background: "#e5e7eb",
            margin: "0 2px",
          }}
        />

        {/* Updated badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#f9fafb",
            borderRadius: 6,
            padding: "4px 9px",
            fontSize: 10.5,
            fontFamily: "ui-monospace, monospace",
            color: "#9ca3af",
            fontWeight: 500,
          }}
        >
          <RefreshCw size={10} style={{ opacity: 0.5 }} />
          {lastUpdated}
        </div>
      </div>

      <style>{`
        @keyframes topbar-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.75); }
        }
      `}</style>
    </header>
  );
}
