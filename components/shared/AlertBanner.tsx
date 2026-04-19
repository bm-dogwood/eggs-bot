// components/shared/AlertBanner.tsx
"use client";

import { AlertTriangle } from "lucide-react";

export function AlertBanner() {
  return (
    <>
      <div className="alert-banner-dark">
        <div className="alert-icon-wrapper">
          <AlertTriangle size={18} />
        </div>
        <div className="alert-content">
          <div className="alert-title-dark">
            <span>Active Market Alert</span>
            <span className="alert-badge">HPAI Detection • Midwest</span>
          </div>
          <div className="alert-body-dark">
            A new bird flu outbreak has been confirmed in Iowa, Illinois, and
            Indiana. Expect{" "}
            <strong className="text-warning">15–25% price spikes</strong> over
            the next 4–6 weeks as affected flocks are cleared per USDA protocol.
          </div>
        </div>
      </div>

      <style jsx>{`
        .alert-banner-dark {
          display: flex;
          gap: 14px;
          padding: 16px 20px;
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.12) 0%,
            rgba(239, 68, 68, 0.06) 100%
          );
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 14px;
          backdrop-filter: blur(8px);
        }

        .alert-icon-wrapper {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.15);
          border-radius: 10px;
          color: #ef4444;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title-dark {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          font-size: 15px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .alert-badge {
          padding: 2px 10px;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #ef4444;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .alert-body-dark {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.6;
        }

        .text-warning {
          color: #f59e0b;
        }
      `}</style>
    </>
  );
}
