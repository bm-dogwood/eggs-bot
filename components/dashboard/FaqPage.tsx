"use client";

import { useState } from "react";
import { Clock, ChevronDown, BarChart2, Store, Info } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .faq-root {
          font-family: 'DM Sans', sans-serif;
          max-width: 820px;
          margin: 0 auto;
          padding: 2.5rem 1.25rem 4rem;
          background: transparent;
        }

        /* ── Header ── */
        .faq-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .faq-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #c8954a;
          animation: breathe 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.65); }
        }
        .faq-eyebrow-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c8954a;
        }
        .faq-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 400;
          line-height: 1.1;
          margin: 0 0 10px;
          color: #f1f5f9;
        }
        .faq-title em {
          font-style: italic;
          color: #c8954a;
        }
        .faq-subtitle {
          font-size: 14.5px;
          font-weight: 300;
          color: #64748b;
          margin: 0 0 28px;
          line-height: 1.65;
        }
        .faq-rule {
          width: 40px;
          height: 1.5px;
          background: #c8954a;
          border: none;
          margin: 0 0 36px;
          opacity: 0.8;
        }

        /* ── Accordion ── */
        .faq-list {
          border-top: 0.5px solid rgba(255,255,255,0.07);
          margin-bottom: 60px;
        }
        .faq-item {
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .faq-trigger {
          all: unset;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          padding: 22px 0;
          cursor: pointer;
          gap: 20px;
        }
        .faq-q {
          font-size: 14.5px;
          font-weight: 500;
          color: #cbd5e1;
          line-height: 1.5;
          transition: color 0.18s;
        }
        .faq-trigger:hover .faq-q {
          color: #e2e8f0;
        }
        .faq-chevron {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 0.5px solid rgba(255,255,255,0.09);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #475569;
          transition: background 0.22s, border-color 0.22s, color 0.22s, transform 0.3s;
          background: rgba(255,255,255,0.03);
        }
        .faq-trigger:hover .faq-chevron {
          border-color: rgba(255,255,255,0.15);
          color: #94a3b8;
        }
        .faq-item.is-open .faq-chevron {
          background: #c8954a;
          border-color: #c8954a;
          color: #0f1117;
          transform: rotate(180deg);
        }

        /* smooth expand via grid-template-rows */
        .faq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-item.is-open .faq-body {
          grid-template-rows: 1fr;
        }
        .faq-body-inner {
          overflow: hidden;
        }
        .faq-answer {
          font-size: 13.5px;
          font-weight: 300;
          color: #64748b;
          line-height: 1.9;
          padding: 2px 56px 24px 0;
          max-width: 660px;
          margin: 0;
        }

        /* ── Sources section ── */
        .sources-label {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #334155;
          margin: 0 0 16px;
        }
        .sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .source-card {
          background: #0d1420;
          padding: 24px;
          transition: background 0.18s;
        }
        .source-card:hover {
          background: #101926;
        }
        .source-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .source-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
        }
        .source-badges {
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: flex-end;
        }
        .badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .badge-live {
          background: rgba(52, 211, 153, 0.08);
          color: #34d399;
          border: 0.5px solid rgba(52, 211, 153, 0.2);
        }
        .badge-est {
          background: rgba(200, 149, 74, 0.08);
          color: #c8954a;
          border: 0.5px solid rgba(200, 149, 74, 0.2);
        }
        .badge-official {
          background: rgba(100, 116, 139, 0.08);
          color: #64748b;
          border: 0.5px solid rgba(100, 116, 139, 0.18);
        }
        .source-name {
          font-size: 14px;
          font-weight: 500;
          color: #cbd5e1;
          margin: 0 0 4px;
        }
        .source-ref {
          font-size: 11px;
          font-weight: 500;
          color: #c8954a;
          letter-spacing: 0.04em;
          margin: 0 0 12px;
          text-transform: uppercase;
          opacity: 0.75;
        }
        .source-desc {
          font-size: 13px;
          font-weight: 300;
          color: #475569;
          line-height: 1.75;
          margin: 0 0 14px;
        }
        .source-lag {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          color: #334155;
        }
        .store-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }
        .store-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 300;
          color: #64748b;
        }

        /* ── Disclaimer ── */
        .disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.02);
          border: 0.5px solid rgba(255,255,255,0.05);
          border-left: 2px solid rgba(200,149,74,0.45);
          border-radius: 0 8px 8px 0;
        }
        .disclaimer-icon {
          color: #334155;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .disclaimer-text {
          font-size: 12.5px;
          font-weight: 300;
          color: #475569;
          line-height: 1.8;
          margin: 0;
        }
        .disclaimer-text strong {
          font-weight: 500;
          color: #64748b;
        }

        @media (max-width: 540px) {
          .faq-answer   { padding-right: 0; }
          .sources-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="faq-root">
        {/* ── Header ── */}
        <div className="faq-eyebrow">
          <div className="faq-dot" />
          <span className="faq-eyebrow-text">Help &amp; info</span>
        </div>
        <h1 className="faq-title">
          Got <em>questions?</em>
        </h1>
        <p className="faq-subtitle">
          Everything you need to know about egg pricing, sources, and
          methodology.
        </p>
        <hr className="faq-rule" />

        {/* ── Accordion ── */}
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? " is-open" : ""}`}>
              <button
                className="faq-trigger"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
              >
                <span className="faq-q">{item.q}</span>
                <div className="faq-chevron">
                  <ChevronDown size={13} strokeWidth={2} />
                </div>
              </button>
              <div className="faq-body">
                <div className="faq-body-inner">
                  <p className="faq-answer">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Data sources ── */}
        <section>
          <p className="sources-label">Data sources &amp; methodology</p>

          <div className="sources-grid">
            {/* National average */}
            <div className="source-card">
              <div className="source-top">
                <div className="source-icon">
                  <BarChart2 size={16} strokeWidth={1.5} />
                </div>
                <div className="source-badges">
                  <span className="badge badge-official">Official</span>
                </div>
              </div>
              <p className="source-name">National average</p>
              <p className="source-ref">U.S. Bureau of Labor Statistics CPI</p>
              <p className="source-desc">
                Series APU0000708111 — average retail price of one dozen Grade A
                large eggs, collected monthly from urban areas nationwide.
              </p>
              <div className="source-lag">
                <Clock size={12} strokeWidth={1.5} />
                Lags real-time prices by 2–4 weeks
              </div>
            </div>

            {/* Store pricing */}
            <div className="source-card">
              <div className="source-top">
                <div className="source-icon">
                  <Store size={16} strokeWidth={1.5} />
                </div>
                <div className="source-badges">
                  <span className="badge badge-live">Live</span>
                  <span className="badge badge-est">Estimate</span>
                </div>
              </div>
              <p className="source-name">Store pricing</p>
              <div className="store-rows">
                <div className="store-row">
                  <span className="badge badge-live">Live</span>
                  Kroger — via official API
                </div>
                <div className="store-row">
                  <span className="badge badge-est">Est.</span>
                  Walmart, Aldi, Target, Costco
                </div>
              </div>
              <p className="source-desc">
                Regional benchmark estimates with ±5–10% accuracy. Web scraping
                required for real-time non-Kroger pricing.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">
            <div className="disclaimer-icon">
              <Info size={14} strokeWidth={1.5} />
            </div>
            <p className="disclaimer-text">
              <strong>eggs.bot</strong> is an independent tool, not affiliated
              with any retailer, the USDA, or the BLS. All prices are for
              informational purposes only — always verify in-store before
              purchasing.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
