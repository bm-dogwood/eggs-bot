// components/dashboard/AlertsPage.tsx
"use client";

import { useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { DARK_THEME } from "@/components/shared/DarkThemeStyles";
import { PRICE_HISTORY } from "@/lib/constants";

const current = PRICE_HISTORY[PRICE_HISTORY.length - 1].price;

const FORECAST_SCENARIOS = [
  {
    type: "best",
    label: "Best case — no new outbreaks",
    body: "Prices could reach $3.00–$3.50 by late 2025 as flock recovery progresses and new cage-free facilities come online. Requires sustained outbreak-free period of 6+ months.",
  },
  {
    type: "base",
    label: "Base case — current trajectory",
    body: "Gradual decline to $3.50–$4.00 by year-end, with seasonal spikes at Thanksgiving and Christmas pushing back above $4.50 briefly.",
  },
  {
    type: "risk",
    label: "Risk case — new HPAI wave",
    body: "A major new outbreak could push prices back toward $5.00–$6.00+, matching or exceeding 2023 peaks. Remains a real risk through wild bird migration season.",
  },
  {
    type: "struct",
    label: "Structural floor (permanent)",
    body: "Cage-free compliance costs (~$0.80–$1.20/dz) mean prices are unlikely to return to pre-2022 levels even in a full recovery. The new normal is higher than before 2022.",
  },
];

export function AlertsPage() {
  const [price, setPrice] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [type, setType] = useState("National average");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (price && email) setSubmitted(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card
        title="Set a Price Alert"
        subtitle="Get an email when the national average drops below your target price"
        icon={<Bell size={16} />}
      >
        {submitted ? (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>
              Alert set! We&apos;ll email {email} when prices fall below $
              {parseFloat(price).toFixed(2)}/dozen.
            </span>
          </div>
        ) : (
          <>
            <div className="alert-form">
              <div className="form-group">
                <label className="form-label">Target price (per dozen)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    className="input-dark"
                    type="number"
                    step="0.01"
                    min="1"
                    max="20"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3.00"
                  />
                </div>
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Email address</label>
                <input
                  className="input-dark"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Alert type</label>
                <select
                  className="select-dark"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>National average</option>
                  <option>Any region drop</option>
                  <option>Specific store</option>
                </select>
              </div>
              {type === "Specific store" && (
                <div className="form-group">
                  <label className="form-label">ZIP code</label>
                  <input
                    className="input-dark zip-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                    placeholder="ZIP"
                  />
                </div>
              )}
              <button
                className="btn-dark"
                onClick={handleSubmit}
                disabled={!price || !email}
              >
                <Bell size={14} />
                Set Alert
              </button>
            </div>
            <div className="form-hint">
              National average is currently{" "}
              <strong>${current.toFixed(2)}/dozen</strong>. Historical low in
              2021 was $1.72.
            </div>
          </>
        )}
      </Card>

      <Card
        title="Price Outlook Scenarios"
        subtitle="When to expect lower prices — analyst forecasts & historical patterns"
      >
        <div className="forecast-grid">
          {FORECAST_SCENARIOS.map(({ type, label, body }) => (
            <div key={type} className={`forecast-card forecast-${type}`}>
              <div className="forecast-label">{label}</div>
              <p className="forecast-body">{body}</p>
            </div>
          ))}
        </div>
      </Card>

      <style jsx>{`
        .success-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 12px;
          color: #10b981;
          font-size: 14px;
          font-weight: 500;
        }

        .alert-form {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: flex-end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .flex-1 {
          flex: 1;
          min-width: 220px;
        }

        .form-label {
          font-size: 10.5px;
          font-weight: 600;
          color: ${DARK_THEME.text.tertiary};
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-wrapper {
          position: relative;
          width: 130px;
        }

        .input-prefix {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: ${DARK_THEME.text.accent};
          font-weight: 700;
        }

        .input-dark {
          padding: 10px 12px;
          padding-left: 28px;
          background: ${DARK_THEME.bg.tertiary};
          border: 1px solid ${DARK_THEME.border.medium};
          border-radius: 10px;
          color: ${DARK_THEME.text.primary};
          font-size: 14px;
          transition: all 0.2s;
          width: 100%;
        }

        .input-dark:focus {
          outline: none;
          border-color: ${DARK_THEME.text.accent};
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .input-dark::placeholder {
          color: ${DARK_THEME.text.tertiary};
        }

        .select-dark {
          padding: 10px 12px;
          background: ${DARK_THEME.bg.tertiary};
          border: 1px solid ${DARK_THEME.border.medium};
          border-radius: 10px;
          color: ${DARK_THEME.text.primary};
          font-size: 14px;
          cursor: pointer;
        }

        .zip-input {
          width: 100px;
        }

        .btn-dark {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: ${DARK_THEME.gradient.accent};
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-dark:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-dark:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-hint {
          margin-top: 14px;
          font-size: 12px;
          color: ${DARK_THEME.text.tertiary};
        }

        .form-hint strong {
          color: ${DARK_THEME.text.accent};
        }

        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .forecast-card {
          padding: 18px;
          border-radius: 14px;
          border: 1px solid;
        }

        .forecast-best {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .forecast-base {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.2);
        }

        .forecast-risk {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .forecast-struct {
          background: rgba(107, 114, 128, 0.08);
          border-color: rgba(107, 114, 128, 0.2);
        }

        .forecast-label {
          font-size: 13px;
          font-weight: 700;
          color: ${DARK_THEME.text.primary};
          margin-bottom: 10px;
        }

        .forecast-body {
          font-size: 12.5px;
          color: ${DARK_THEME.text.secondary};
          line-height: 1.7;
          margin: 0;
        }

        @media (max-width: 768px) {
          .forecast-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
