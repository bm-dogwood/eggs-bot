// components/dashboard/StoresPage.tsx
"use client";

import { MapPin, DollarSign } from "lucide-react";
import StoreResults from "@/components/StoreResults";
import { Card } from "@/components/shared/Card";
import { DARK_THEME } from "@/components/shared/DarkThemeStyles";

const RETAILERS = [
  {
    name: "Aldi",
    logo: "🟦",
    pct: 22,
    color: DARK_THEME.text.accent,
    label: "Cheapest",
  },
  { name: "Walmart", logo: "🔵", pct: 35, color: "#22c55e", label: "Very low" },
  {
    name: "Kroger",
    logo: "🟥",
    pct: 52,
    color: DARK_THEME.text.warning,
    label: "Mid",
  },
  { name: "Target", logo: "🎯", pct: 65, color: "#f97316", label: "Higher" },
  {
    name: "Costco 36ct",
    logo: "🟩",
    pct: 20,
    color: DARK_THEME.text.accent,
    label: "Best/egg",
  },
];

const TIPS = [
  {
    emoji: "🛒",
    tip: "Buy in bulk at Costco",
    detail: "~$0.22/egg vs $0.35+ elsewhere. Best for 3+ dozen/month.",
  },
  {
    emoji: "🏷",
    tip: "Choose store brands",
    detail: "20–35% cheaper, often from the same farms as name brands.",
  },
  {
    emoji: "📅",
    tip: "Shop mid-week (Tue–Thu)",
    detail: "Stores restock and reprice — weekends typically cost more.",
  },
  {
    emoji: "❄️",
    tip: "Freeze surplus eggs",
    detail:
      "Crack into ice cube tray, freeze up to 12 months. Stock up on sale.",
  },
];

const DATA_SOURCES = [
  {
    store: "Kroger",
    status: "Live API",
    badge: "success",
    detail:
      "Free public API at developer.kroger.com. OAuth2 client credentials flow. Returns real-time prices by ZIP code. Covers all Kroger-owned banners (Ralph's, Fred Meyer, King Soopers, etc.).",
  },
  {
    store: "Walmart & Target",
    status: "Unofficial API",
    badge: "warning",
    detail:
      "Internal APIs discovered via browser devtools. Not officially public — may break. Alternatively, scrape search results pages with Playwright. Cache results 2–4 hours.",
  },
  {
    store: "Aldi",
    status: "HTML Scraping",
    badge: "danger",
    detail:
      "No API available. Scrape aldi.us weekly offers page with Playwright/Puppeteer. Aldi prices update weekly (ALDI Finds model). Use a rotating proxy pool in production.",
  },
];

export function StoresPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card
        title="Find Cheapest Eggs Near You"
        subtitle="Kroger: live API · Walmart/Aldi/Target/Costco: regional estimates (±5–10%)"
        icon={<MapPin size={16} />}
      >
        <StoreResults />
      </Card>

      <div className="two-column-grid">
        <Card
          title="Retailer Price Positioning"
          subtitle="Typical lowest-to-highest pricing"
        >
          <div className="retailer-list">
            {RETAILERS.map(({ name, pct, color, label }) => (
              <div key={name} className="retailer-item">
                <div className="retailer-info">
                  <div className="retailer-header">
                    <span className="retailer-name">{name}</span>
                    <span className="retailer-label" style={{ color }}>
                      {label}
                    </span>
                  </div>
                  <div className="progress-bar-dark">
                    <div
                      className="progress-fill-dark"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Money-Saving Tips" icon={<DollarSign size={16} />}>
          <div className="tips-list">
            {TIPS.map(({ tip, detail }) => (
              <div key={tip} className="tip-card">
                <span className="tip-emoji"></span>
                <div className="tip-content">
                  <h4 className="tip-title">{tip}</h4>
                  <p className="tip-detail">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Data Sources & Implementation Notes"
        subtitle="For developers building on this dashboard"
      >
        <div className="sources-grid">
          {DATA_SOURCES.map(({ store, status, badge, detail }) => (
            <div key={store} className="source-card">
              <div className="source-header">
                <h4 className="source-name">{store}</h4>
                <span className={`badge badge-${badge}`}>{status}</span>
              </div>
              <p className="source-detail">{detail}</p>
            </div>
          ))}
        </div>
      </Card>

      <style jsx>{`
        .two-column-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .retailer-list {
          padding: 8px 20px 20px;
        }

        .retailer-item {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .retailer-item:last-child {
          margin-bottom: 0;
        }

        .retailer-logo {
          font-size: 22px;
          width: 32px;
          text-align: center;
        }

        .retailer-info {
          flex: 1;
        }

        .retailer-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .retailer-name {
          font-size: 13.5px;
          font-weight: 600;
          color: ${DARK_THEME.text.primary};
        }

        .retailer-label {
          font-size: 11.5px;
          font-weight: 600;
        }

        .progress-bar-dark {
          height: 6px;
          background: ${DARK_THEME.bg.tertiary};
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill-dark {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .tips-list {
          padding: 8px 20px 20px;
        }

        .tip-card {
          display: flex;
          gap: 14px;
          padding: 14px;
          background: ${DARK_THEME.bg.secondary};
          border: 1px solid ${DARK_THEME.border.subtle};
          border-radius: 12px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }

        .tip-card:hover {
          border-color: ${DARK_THEME.border.accent};
          background: ${DARK_THEME.bg.tertiary};
        }

        .tip-card:last-child {
          margin-bottom: 0;
        }

        .tip-emoji {
          font-size: 20px;
        }

        .tip-content {
          flex: 1;
        }

        .tip-title {
          font-size: 13.5px;
          font-weight: 700;
          color: ${DARK_THEME.text.primary};
          margin: 0 0 4px;
        }

        .tip-detail {
          font-size: 12px;
          color: ${DARK_THEME.text.secondary};
          line-height: 1.6;
          margin: 0;
        }

        .sources-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .source-card {
          padding: 18px;
          background: ${DARK_THEME.bg.secondary};
          border: 1px solid ${DARK_THEME.border.subtle};
          border-radius: 14px;
        }

        .source-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .source-name {
          font-size: 14px;
          font-weight: 700;
          color: ${DARK_THEME.text.primary};
          margin: 0;
        }

        .badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .badge-warning {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .badge-danger {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .source-detail {
          font-size: 12px;
          color: ${DARK_THEME.text.secondary};
          line-height: 1.7;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .two-column-grid {
            grid-template-columns: 1fr;
          }

          .sources-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
