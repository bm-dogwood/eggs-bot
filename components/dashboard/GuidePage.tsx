// components/dashboard/GuidePage.tsx
"use client";

import { Card } from "@/components/shared/Card";
import { DARK_THEME } from "@/components/shared/DarkThemeStyles";
import { EGG_TYPE_INFO, INDUSTRY_STATS } from "@/lib/constants";

export function GuidePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card
        title="Egg Type & Housing Guide"
        subtitle="All USDA-graded eggs meet minimum quality standards — housing practices vary significantly"
      >
        <div className="table-wrapper-dark">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Type</th>
                <th>Price Range</th>
                <th>Space per Hen</th>
                <th>Outdoor Access</th>
                <th>Feed</th>
                <th>Welfare</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(EGG_TYPE_INFO).map(([, info]) => (
                <tr key={info.label}>
                  <td>
                    <div className="type-cell">
                      <span className="type-emoji"></span>
                      <span className="type-name">{info.label}</span>
                    </div>
                  </td>
                  <td>
                    ${info.priceLow.toFixed(2)}–${info.priceHigh.toFixed(2)}
                  </td>
                  <td className="text-secondary">{info.space}</td>
                  <td>
                    <span
                      className={`badge ${
                        info.outdoorAccess === "Full"
                          ? "badge-success"
                          : info.outdoorAccess === "Some"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {info.outdoorAccess}
                    </span>
                  </td>
                  <td className="text-secondary">{info.feed}</td>
                  <td>
                    <div className="welfare-score">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="welfare-dot"
                          style={{
                            background:
                              i <= info.welfareScore ? "#10b981" : "#3a3a45",
                          }}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="type-cards-grid">
        {Object.entries(EGG_TYPE_INFO).map(([, info]) => (
          <div key={info.label} className="type-card">
            <div className="type-card-header">
              <span className="type-card-emoji"></span>
              <span className="badge badge-warning">{info.multiplier}</span>
            </div>
            <h4 className="type-card-title">{info.label}</h4>
            <div className="type-card-price">
              ${info.priceLow.toFixed(2)}–${info.priceHigh.toFixed(2)}
            </div>
            <p className="type-card-description">{info.description}</p>
          </div>
        ))}
      </div>

      <Card
        title="U.S. Egg Industry Key Figures"
        subtitle="Fast facts about the American egg market"
      >
        <div className="table-wrapper-dark">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Source / Note</th>
              </tr>
            </thead>
            <tbody>
              {INDUSTRY_STATS.map(({ metric, value, note }) => (
                <tr key={metric}>
                  <td className="text-secondary">{metric}</td>
                  <td className="stat-value">{value}</td>
                  <td className="stat-note">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <style jsx>{`
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

        .type-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-emoji {
          font-size: 18px;
        }

        .type-name {
          font-weight: 600;
          color: ${DARK_THEME.text.primary};
        }

        .text-secondary {
          color: ${DARK_THEME.text.secondary};
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

        .welfare-score {
          display: flex;
          gap: 3px;
        }

        .welfare-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .type-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        .type-card {
          padding: 18px;
          background: ${DARK_THEME.bg.secondary};
          border: 1px solid ${DARK_THEME.border.subtle};
          border-radius: 14px;
          transition: all 0.2s;
        }

        .type-card:hover {
          border-color: ${DARK_THEME.border.accent};
          transform: translateY(-2px);
        }

        .type-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .type-card-emoji {
          font-size: 28px;
        }

        .type-card-title {
          font-size: 14px;
          font-weight: 700;
          color: ${DARK_THEME.text.primary};
          margin: 0 0 4px;
        }

        .type-card-price {
          font-size: 18px;
          font-weight: 800;
          color: ${DARK_THEME.text.accent};
          margin-bottom: 10px;
        }

        .type-card-description {
          font-size: 12px;
          color: ${DARK_THEME.text.secondary};
          line-height: 1.6;
          margin: 0;
        }

        .stat-value {
          font-weight: 700;
          color: ${DARK_THEME.text.accent};
        }

        .stat-note {
          color: ${DARK_THEME.text.tertiary};
          font-size: 11.5px;
        }

        @media (max-width: 1200px) {
          .type-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .type-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
